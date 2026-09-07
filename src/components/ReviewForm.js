import React, { useState } from "react";
import axios from "axios";

function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `https://product-review-platform-a9iq.onrender.com/api/products/${productId}/reviews`,
        {
          rating: Number(rating),
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onReviewAdded(response.data);

      setRating(5);
      setComment("");

      alert("Review added successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error adding review"
      );
    }
  };

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
    >
      <label>Your Rating</label>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= rating
                ? "star selected"
                : "star"
            }
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <p className="rating-text">
        {rating} out of 5
      </p>

      <input
        type="text"
        placeholder="Write your review"
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        required
      />

      <button type="submit">
        Add Review
      </button>
    </form>
  );
}

export default ReviewForm;