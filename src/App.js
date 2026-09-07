import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import AddProduct from "./components/AddProduct";
import ReviewForm from "./components/ReviewForm";
import EditProduct from "./components/EditProduct";
import ProductDetails from "./components/ProductDetails";
import Register from "./components/Register";
import Login from "./components/Login";

import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, []);

  const addProduct = (product) => {
    axios
      .post(
        "http://localhost:5000/api/products",
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then((response) => {
        setProducts((prevProducts) => [
          ...prevProducts,
          response.data
        ]);

        alert("Product added successfully");
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Error adding product"
        );
      });
  };

  const updateProduct = (productId, updatedData) => {
    axios
      .put(
        `http://localhost:5000/api/products/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? response.data
              : product
          )
        );

        setEditingProduct(null);

        alert("Product updated successfully");
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Update failed"
        );
      });
  };

  const deleteProduct = (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    axios
      .delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== productId
          )
        );

        alert("Product deleted successfully");
      })
      .catch((error) => {
        alert(
          error.response?.data?.message ||
            "Error deleting product"
        );
      });
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    if (showRegister) {
      return (
        <Register
          showLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        showRegister={() => setShowRegister(true)}
        onLogin={handleLogin}
      />
    );
  }

  if (selectedProduct) {
    return (
      <div>
        <Navbar />

        <ProductDetails
          product={selectedProduct}
          goBack={() => setSelectedProduct(null)}
        />
      </div>
    );
  }

  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (sortBy === "ratingHigh") {
    filteredProducts.sort(
      (a, b) => b.rating - a.rating
    );
  }

  if (sortBy === "ratingLow") {
    filteredProducts.sort(
      (a, b) => a.rating - b.rating
    );
  }

  if (sortBy === "nameAZ") {
    filteredProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sortBy === "nameZA") {
    filteredProducts.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  const totalReviews = products.reduce(
    (total, product) =>
      total + product.reviews.length,
    0
  );

  const averageRating =
    products.length === 0
      ? 0
      : products.reduce(
          (total, product) =>
            total + product.rating,
          0
        ) / products.length;

  return (
    <div>

      <Navbar />

      <div className="hero">

        <div className="hero-content">

          <h1>
            Discover. Review. Share.
          </h1>

          <p>
            Find products, read honest reviews,
            and share your own experience.
          </p>

          <button
            onClick={() =>
              document
                .getElementById("products-section")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            Explore Products
          </button>

        </div>

      </div>

      <div className="container">

        <div className="welcome">

          <div>
            <h2>
              Welcome, {user.name}! 👋
            </h2>

            <p>
              Manage products and share your reviews.
            </p>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

        <div className="stats">

          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>

          <div className="stat-card">
            <h3>{totalReviews}</h3>
            <p>Total Reviews</p>
          </div>

          <div className="stat-card">
            <h3>
              {averageRating.toFixed(1)}
            </h3>
            <p>Average Rating</p>
          </div>

        </div>

        <AddProduct
          addProduct={addProduct}
        />

        <div
          className="products-section"
          id="products-section"
        >

          <h2>Find Products</h2>

          <div className="search-box">

            <input
              type="text"
              placeholder="🔍 Search by product name or description..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="filters">

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Mobile">
                Mobile
              </option>

              <option value="Laptop">
                Laptop
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Home">
                Home
              </option>

              <option value="Books">
                Books
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="default">
                Sort Products
              </option>

              <option value="ratingHigh">
                Rating: High to Low
              </option>

              <option value="ratingLow">
                Rating: Low to High
              </option>

              <option value="nameAZ">
                Name: A to Z
              </option>

              <option value="nameZA">
                Name: Z to A
              </option>
            </select>

          </div>

          <h2>
            Products ({filteredProducts.length})
          </h2>

          <div className="products">

            {filteredProducts.length === 0 ? (

              <div className="no-products">

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing your search or category.
                </p>

              </div>

            ) : (

              filteredProducts.map((product) => (

                <div
                  className="product-container"
                  key={product._id}
                >

                  {editingProduct === product._id ? (

                    <EditProduct
                      product={product}
                      updateProduct={updateProduct}
                      cancelEdit={() =>
                        setEditingProduct(null)
                      }
                    />

                  ) : (

                    <>

                      <ProductCard
                        product={product}
                        onProductUpdated={(updatedProduct) => {

                          setProducts((prevProducts) =>
                            prevProducts.map((p) =>
                              p._id === updatedProduct._id
                                ? updatedProduct
                                : p
                            )
                          );

                        }}
                      />

                      <button
                        className="details-button"
                        onClick={() =>
                          setSelectedProduct(product)
                        }
                      >
                        View Details
                      </button>

                      {product.ownerId &&
                        product.ownerId.toString() ===
                          user.id.toString() && (

                        <>

                          <button
                            className="edit-button"
                            onClick={() =>
                              setEditingProduct(
                                product._id
                              )
                            }
                          >
                            Edit Product
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                          >
                            Delete Product
                          </button>

                        </>

                      )}

                      <ReviewForm
                        productId={product._id}
                        onReviewAdded={(updatedProduct) => {

                          setProducts((prevProducts) =>
                            prevProducts.map((p) =>
                              p._id === updatedProduct._id
                                ? updatedProduct
                                : p
                            )
                          );

                        }}
                      />

                    </>

                  )}

                </div>

              ))

            )}

          </div>

        </div>

      </div>

      <footer>
        <p>
          © 2026 Product Review Platform
        </p>
      </footer>

    </div>
  );
}

export default App;