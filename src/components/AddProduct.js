import React, { useState } from "react";

function AddProduct({ addProduct }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      name,
      description,
      category,
      image,
      rating: 0,
      reviews: []
    };

    addProduct(product);

    setName("");
    setDescription("");
    setCategory("Electronics");
    setImage("");
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="Electronics">Electronics</option>
          <option value="Mobile">Mobile</option>
          <option value="Laptop">Laptop</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>

        <label>Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {image && (
          <img
            src={image}
            alt="Product Preview"
            className="image-preview"
          />
        )}

        <button type="submit">
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;