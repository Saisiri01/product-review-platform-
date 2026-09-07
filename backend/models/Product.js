const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userName: {
    type: String,
    default: "Anonymous"
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    default: 0
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ownerName: {
    type: String,
    required: true
  },

  reviews: [reviewSchema]
});

module.exports = mongoose.model("Product", productSchema);