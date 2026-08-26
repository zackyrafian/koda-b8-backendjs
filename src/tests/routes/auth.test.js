import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import express from "express"

const mocks = vi.hoisted(() => {
  const tx = {
    commit: vi.fn().mockResolvedValue(undefined),
    rollback: vi.fn().mockResolvedValue(undefined),
  }
  class UniqueConstraintError extends Error {}
  class ValidationError extends Error {}
  return {
    tx,
    transaction: vi.fn().mockResolvedValue(tx),
    userCreate: vi.fn(),
    userProfileCreate: vi.fn(),
    userFindOne: vi.fn(),
    argonVerify: vi.fn(),
    jwtSign: vi.fn(),
    UniqueConstraintError,
    ValidationError,
  }
})

vi.mock("argon2", () => ({
  default: { verify: mocks.argonVerify },
}))

vi.mock("../../libs/jwt.js", () => ({
  default: { sign: mocks.jwtSign },
}))

vi.mock("../../models/index.js", () => ({
  default: {
    sequelize: { transaction: mocks.transaction },
    User: { create: mocks.userCreate, findOne: mocks.userFindOne },
    UserProfile: { create: mocks.userProfileCreate },
  },
  Sequelize: {
    UniqueConstraintError: mocks.UniqueConstraintError,
    ValidationError: mocks.ValidationError,
  },
}))

import authRouter from "../../routes/auth.router.js"

const app = express()
app.use(express.json())
app.use("/auth", authRouter)

beforeEach(() => {
  vi.clearAllMocks()
  mocks.transaction.mockResolvedValue(mocks.tx)
})

describe("POST /auth/register", () => {
  it("returns 201 and creates user + profile in one transaction", async () => {
    mocks.userCreate.mockResolvedValue({ id: 1 })
    mocks.userProfileCreate.mockResolvedValue({})

    const res = await request(app).post("/auth/register").send({
      fullname: "John Doe",
      email: "john@example.com",
      password: "password123",
    })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe("User Register John Doe")
    expect(mocks.transaction).toHaveBeenCalled()
    expect(mocks.userCreate).toHaveBeenCalledWith(
      { email: "john@example.com", password: "password123" },
      { transaction: mocks.tx }
    )
    expect(mocks.userProfileCreate).toHaveBeenCalledWith(
      { user_id: 1, fullname: "John Doe" },
      { transaction: mocks.tx }
    )
    expect(mocks.tx.commit).toHaveBeenCalled()
  })

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "john@example.com",
    })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toContain("fullname")
    expect(res.body.message).toContain("password")
    expect(mocks.userCreate).not.toHaveBeenCalled()
  })

  it("returns 409 when email already exists and rolls back", async () => {
    mocks.userCreate.mockRejectedValue(new mocks.UniqueConstraintError("duplicate"))

    const res = await request(app).post("/auth/register").send({
      fullname: "John Doe",
      email: "john@example.com",
      password: "password123",
    })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/email/i)
    expect(mocks.tx.rollback).toHaveBeenCalled()
    expect(mocks.tx.commit).not.toHaveBeenCalled()
  })

  it("returns 500 on unexpected error and rolls back", async () => {
    mocks.userCreate.mockRejectedValue(new Error("boom"))

    const res = await request(app).post("/auth/register").send({
      fullname: "John Doe",
      email: "john@example.com",
      password: "password123",
    })

    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("boom")
    expect(mocks.tx.rollback).toHaveBeenCalled()
  })
})

describe("POST /auth/login", () => {
  it("returns 200 with token on valid credentials", async () => {
    mocks.userFindOne.mockResolvedValue({
      id: 7,
      role: "user",
      password: "hashed-password",
    })
    mocks.argonVerify.mockResolvedValue(true)
    mocks.jwtSign.mockReturnValue("fake-token")

    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "password123",
    })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBe("fake-token")
    expect(mocks.userFindOne).toHaveBeenCalledWith({
      where: { email: "john@example.com" },
    })
    expect(mocks.argonVerify).toHaveBeenCalledWith("hashed-password", "password123")
    expect(mocks.jwtSign).toHaveBeenCalledWith({ userId: 7, role: "user" })
  })

  it("returns 401 when user not found", async () => {
    mocks.userFindOne.mockResolvedValue(null)

    const res = await request(app).post("/auth/login").send({
      email: "ghost@example.com",
      password: "password123",
    })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/wrong/i)
    expect(mocks.argonVerify).not.toHaveBeenCalled()
  })

  it("returns 401 when password is wrong", async () => {
    mocks.userFindOne.mockResolvedValue({
      id: 7,
      role: "user",
      password: "hashed-password",
    })
    mocks.argonVerify.mockResolvedValue(false)

    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "wrong-password",
    })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toMatch(/wrong/i)
    expect(mocks.jwtSign).not.toHaveBeenCalled()
  })

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
    })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toContain("password")
    expect(mocks.userFindOne).not.toHaveBeenCalled()
  })
})
