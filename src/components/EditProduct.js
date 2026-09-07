import React, { useState } from "react";

function EditProduct({ product, updateProduct, cancelEdit }) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(
    product.category || "Other"
  );
  const [image, setImage] = useState(product.image);

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

    updateProduct(product._id, {
      name,
      description,
      category,
      image
    });
  };

  return (
    <div className="edit-product">

      <h3>Edit Product</h3>

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

        <label>Change Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="image-preview"
          />
        )}

        <button type="submit">
          Save Changes
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={cancelEdit}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default EditProduct;