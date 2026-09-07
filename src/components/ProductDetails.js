import React from "react";

function ProductDetails({ product, goBack }) {
  return (
    <div className="details-container">

      <button
        className="back-button"
        onClick={goBack}
      >
        ← Back to Products
      </button>

      <div className="details-card">

        <img
          src={product.image}
          alt={product.name}
          className="details-image"
        />

        <div className="details-content">

          <h1>{product.name}</h1>

          <p className="details-category">
            Category: <strong>
              {product.category || "Other"}
            </strong>
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-rating">

            <span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(product.rating)
                    ? "★"
                    : "☆"}
                </span>
              ))}
            </span>

            <strong>
              {product.rating.toFixed(1)} / 5
            </strong>

          </div>

          <p>
            <strong>
              Added by:
            </strong>{" "}
            {product.ownerName || "Unknown"}
          </p>

          <h2>
            Reviews ({product.reviews.length})
          </h2>

          {product.reviews.length === 0 ? (

            <p>No reviews yet.</p>

          ) : (

            <div className="details-reviews">

              {product.reviews.map((review) => (

                <div
                  className="details-review"
                  key={review._id}
                >

                  <strong>
                    {review.userName || "Anonymous"}
                  </strong>

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

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;