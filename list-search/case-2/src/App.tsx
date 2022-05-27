import React, { useEffect, useState } from "react";

import type { Product } from "./types";
import api from "./api";
import { useDebounce } from "./hooks/useDebounce";

const MemoizedRecommended = React.memo(function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then((data) => {
      setProducts(data.map((item) => ({ ...item, fav: false })));
    });
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {[...products]
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .slice(0, 2)
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
});

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favouriteProducts, setFavouriteProducts] = useState<Product["id"][]>(
    () => JSON.parse(localStorage.getItem("favouriteProducts") || "[]")
  );
  const [query, setQuery] = useState<string>("");

  const debouncedValue = useDebounce(query, 800);

  useEffect(() => {
    api.search(debouncedValue).then((data) => {
      setProducts(
        data.map((item) =>
          favouriteProducts?.includes(item.id) ? { ...item, fav: true } : item
        )
      );
    });
  }, [debouncedValue]);

  useEffect(() => {
    console.log(typeof favouriteProducts);
    localStorage.setItem(
      "favouriteProducts",
      JSON.stringify(favouriteProducts)
    );
  }, [favouriteProducts]);

  const handleSetFavouriteItem = (id: Product["id"]) => {
    const updatedProducts = products.map((item) =>
      item.id === id ? { ...item, fav: !item.fav } : item
    );
    setProducts(updatedProducts);
    setFavouriteProducts(
      updatedProducts
        .filter((product) => product.fav)
        ?.map((product) => product.id)
    );
  };

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input
        name="text"
        placeholder="tv"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            onClick={() => handleSetFavouriteItem(product.id)}
            className={product.fav ? "fav" : ""}
          >
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <MemoizedRecommended />
    </main>
  );
}

export default App;
