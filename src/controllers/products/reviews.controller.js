import * as reviewsModel from "../../models/products/reviews.model.js"
import * as productsModel from "../../models/products.model.js"

export async function getAll(req, res) {
  try {
    const product = await productsModel.findOne("id", req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.status(200).json({ success: true, results: await reviewsModel.findAll(req.params.id) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function create(req, res) {
  const { variant_id, rating, comment } = req.body
  const productId = Number(req.params.id)
  const userId = Number(req.user.userId)
  const variantId = Number(variant_id)
  const numericRating = Number(rating)

  if (!Number.isInteger(productId) || !Number.isInteger(userId) || !Number.isInteger(variantId) || !Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: "variant_id and rating between 1 and 5 are required" })
  }

  try {
    const product = await productsModel.findOne("id", productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const review = await reviewsModel.create(productId, userId, {
      variant_id: variantId,
      rating: numericRating,
      comment
    })
    if (!review) {
      return res.status(400).json({ success: false, message: "Variant does not belong to this product" })
    }

    res.status(201).json({ success: true, message: "Review created successfully", result: review })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
