import React, { useState } from "react";
import axios from "axios";

function ProductCard({ product, onProductUpdated }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const fullStars = Math.round(product.rating);

  const startEdit = (review) => {
    setEditingReview(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const updateReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://product-review-platform-a9iq.onrender.com/api/products/${product._id}/reviews/${reviewId}`,
        {
          rating: editRating,
          comment: editComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onProductUpdated(response.data);
      setEditingReview(null);

      alert("Review updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error updating review"
      );
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://product-review-platform-a9iq.onrender.com//api/products/${product._id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onProductUpdated(response.data);

      alert("Review deleted successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error deleting review"
      );
    }
  };

  return (
    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      {/* Product Category */}
      <p className="product-category">
        Category: <strong>{product.category || "Other"}</strong>
      </p>

      <div className="product-rating">

        <span className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= fullStars ? "★" : "☆"}
            </span>
          ))}
        </span>

        <span className="rating-number">
          {product.rating.toFixed(1)}
        </span>

      </div>

      <h4>
        Reviews ({product.reviews.length})
      </h4>

      {product.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="reviews">

          {product.reviews.map((review) => (

            <div
              className="review"
              key={review._id}
            >

              <strong>
                Reviewed by:{" "}
                {review.userName || "Anonymous"}
              </strong>

              {editingReview === review._id ? (

                <div>

                  <div className="star-rating">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <span
                        key={star}
                        className={
                          star <= editRating
                            ? "star selected"
                            : "star"
                        }
                        onClick={() =>
                          setEditRating(star)
                        }
                      >
                        ★
                      </span>

                    ))}

                  </div>

                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) =>
                      setEditComment(e.target.value)
                    }
                  />

                  <button
                    onClick={() =>
                      updateReview(review._id)
                    }
                  >
                    Save
                  </button>

                  <button
                    onClick={() =>
                      setEditingReview(null)
                    }
                  >
                    Cancel
                  </button>

                </div>

              ) : (

                <>

                  <div className="review-stars">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <span key={star}>
                        {star <= review.rating
                          ? "★"
                          : "☆"}
                      </span>

                    ))}

                  </div>

                  <p>{review.comment}</p>

                  {user &&
                    review.userId &&
                    review.userId.toString() ===
                      user.id.toString() && (

                      <div>

                        <button
                          onClick={() =>
                            startEdit(review)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteReview(review._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )}

                </>

              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default ProductCard;