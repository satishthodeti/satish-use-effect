import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const url = "https://dummyjson.com/products";

  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState({ status: false, message: "" });

  const fetchData = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, message: "" });
    try {
      const response = await Axios.get(url);
      const result = await response.data;
      const isArrayData = result.products || [result];
      console.log(isArrayData);
      setProducts(isArrayData);
      setIsLoading(false);
      setIsError({ status: false, message: "" });
      if(isArrayData[0].message){
        throw new Error("No Records Found");
      }
    } catch (error) {
      console.error("Error fetching data:", error.response.data.message);
      setIsLoading(false);
      setIsError({
        status: true,
        message: error.message || "Something went wrong...",
      });
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const filterParam =
        !isNaN(filterProduct) && filterProduct !== ""
          ? `${url}/${filterProduct}`
          : url;
      await fetchData(filterParam);
    };

    fetchDataAsync();
  }, [filterProduct]);

  function name(e) {
    setFilterProduct(e.target.value);
  }

  return (
    <div className="App">
      <h1>Total Products : {products && products.length}</h1>
      <form>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Need to filter products (numeric)"
          value={filterProduct}
          onChange={(e) => name(e)}
        />
      </form>
      <hr />
      {isLoading && !isError.status && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isError?.status && <h3 style={{ color: "red" }}>{isError.message}</h3>}
      <ul className="product-list">
        {!isLoading &&
          !isError.status &&
          products.map((eachProduct) => {
            const {
              id,
              title,
              description,
              price,
              discountPercentage,
              rating,
              stock,
              brand,
              category,
              thumbnail,
            } = eachProduct;
            return (
              <li key={id} className="product-item">
                <img
                  className="thumbnail"
                  src={thumbnail}
                  alt={`Thumbnail for ${title}`}
                />
                <h1 className="title">{title}</h1>
                <p className="description">{description}</p>
                <p className="price">Price: ${price}</p>
                <p className="discount">Discount: {discountPercentage}%</p>
                <p className="rating">Rating: {rating}</p>
                <p className="stock">Stock: {stock}</p>
                <p className="brand">Brand: {brand}</p>
                <p className="category">Category: {category}</p>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default App;
