const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      rating: 0,
      ownerId: req.user.userId,
      ownerName: req.user.name,
      reviews: []
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (
      product.ownerId.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You can edit only your own product"
      });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.image = req.body.image;
    product.category = req.body.category;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post(
  "/:id/reviews",
  authMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const existingReview = product.reviews.find(
        (review) =>
          review.userId &&
          review.userId.toString() ===
            req.user.userId.toString()
      );

      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this product"
        });
      }

      product.reviews.push({
        userId: req.user.userId,
        userName: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment
      });

      calculateRating(product);

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);

router.put(
  "/:productId/reviews/:reviewId",
  authMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(
        req.params.productId
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const review = product.reviews.id(
        req.params.reviewId
      );

      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      if (
        review.userId.toString() !==
        req.user.userId.toString()
      ) {
        return res.status(403).json({
          message: "You can edit only your own review"
        });
      }

      review.rating = Number(req.body.rating);
      review.comment = req.body.comment;

      calculateRating(product);

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);

router.delete(
  "/:productId/reviews/:reviewId",
  authMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(
        req.params.productId
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const review = product.reviews.id(
        req.params.reviewId
      );

      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      if (
        review.userId.toString() !==
        req.user.userId.toString()
      ) {
        return res.status(403).json({
          message: "You can delete only your own review"
        });
      }

      review.deleteOne();

      calculateRating(product);

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (
      product.ownerId.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You can delete only your own product"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

function calculateRating(product) {
  if (product.reviews.length === 0) {
    product.rating = 0;
    return;
  }

  const total = product.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  product.rating = total / product.reviews.length;
}

module.exports = router;