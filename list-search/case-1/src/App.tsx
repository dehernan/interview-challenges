import type { Product } from "./types";

import { useEffect, useState } from "react";

import api from "./api";

function App() {
  // Using lazy initialization for useState
  const initialQueryStatus = () =>
    localStorage.getItem("query") as keyof Product;
  const initialSortStatus = () => localStorage.getItem("sort") as keyof Product;

  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>(initialQueryStatus);
  const [sortField, setSortField] = useState<string>(initialSortStatus);

  useEffect(() => {
    api.search(query).then(setProducts);
  }, [query]);

  useEffect(() => {
    sortItems(sortField as keyof Product);
  }, [sortField]);

  function sortItems(field: keyof Product) {
    const sortedProducts = [
      ...products.sort((a, b) => (a[field] > b[field] ? 1 : -1)),
    ];
    setProducts(sortedProducts);
    localStorage.setItem("sort", field);
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input
        name="text"
        placeholder="tv"
        type="text"
        value={query}
        onChange={(e) => {
          localStorage.setItem("query", e.target.value);
          setQuery(e.target.value);
        }}
      />
      <label>
        Sort by{" "}
        <select
          id="sort"
          name="sort"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Name</option>
          <option value="price">Price</option>
        </select>
      </label>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(product.price)}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
