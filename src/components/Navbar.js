import React from "react";

function Navbar() {
  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  };

  return (
    <nav>

      <h1>
        ⭐ Product Review Platform
      </h1>

      <div className="nav-links">

        <span
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }
        >
          Home
        </span>

        <span onClick={scrollToProducts}>
          Products
        </span>

      </div>

    </nav>
  );
}

export default Navbar;