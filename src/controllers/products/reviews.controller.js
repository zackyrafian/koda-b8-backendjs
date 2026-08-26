import sq from "../../models/index.js"

function serializeReview(review) {
  return {
    id: review.id,
    product_id: review.product_id,
    variant_id: review.variant_id,
    variant_name: review.variant ? review.variant.name : null,
    user_id: review.user_id,
    user_name: review.user && review.user.profile ? review.user.profile.fullname : null,
    rating: Number(review.rating),
    comment: review.comment,
    created_at: review.createdAt,
    updated_at: review.updatedAt
  }
}

const REVIEW_INCLUDES = [
  {
    model: sq.User,
    as: "user",
    attributes: ["id", "email"],
    include: [{ model: sq.UserProfile, as: "profile", attributes: ["fullname"] }]
  },
  { model: sq.ProductVariants, as: "variant", attributes: ["name"] }
]

async function findProduct(productId) {
  return sq.Products.findByPk(productId, { attributes: ["id"] })
}

export async function getAll(req, res) {
  try {
    const productId = Number(req.params.id)

    const product = await findProduct(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const reviews = await sq.ProductReviews.findAll({
      where: { product_id: productId },
      include: REVIEW_INCLUDES,
      order: [["createdAt", "DESC"]]
    })

    res.status(200).json({ success: true, results: reviews.map(serializeReview) })
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
    const product = await findProduct(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    const variant = await sq.ProductVariants.findOne({
      where: { id: variantId, product_id: productId }
    })
    if (!variant) {
      return res.status(400).json({ success: false, message: "Variant does not belong to this product" })
    }

    const review = await sq.ProductReviews.create({
      product_id: productId,
      variant_id: variantId,
      user_id: userId,
      rating: numericRating,
      comment: comment ?? null
    })

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      result: serializeReview(review)
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
