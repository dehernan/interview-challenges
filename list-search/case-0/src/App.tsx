import type { Product } from "./types";

import { useEffect, useState } from "react";

import api from "./api";

function App() {
  const onSaleMaxPrice = 100;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    api
      .search(query)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [query]);

  const isOnSale = (price: Product["price"]) => {
    return price <= onSaleMaxPrice;
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
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
            className={isOnSale(product.price) ? "sale" : ""}
          >
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
