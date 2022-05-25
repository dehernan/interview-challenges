import type {Item} from "./types";

import {useEffect, useState} from "react";

import styles from "./App.module.scss";
import api from "./api";

interface Form extends HTMLFormElement {
  text: HTMLInputElement;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleToggle(id: Item["id"]) {
    setItems((items) =>
      items.map((item) => (item.id === id ? {...item, completed: !item.completed} : item)),
    );
  }

  function handleAdd(event: React.ChangeEvent<Form>) {
    event.preventDefault();
    if (event.target.text.value) {
      setItems([...items, {id: +new Date(), text: event.target.text.value, completed: false}]);
      event.target.text.value = "";
    }
  }

  function handleRemove(id: Item["id"]) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={styles.main}>
      <h1>Supermarket list</h1>
      <form onSubmit={handleAdd}>
        <input name="text" type="text" />
        <button>Add</button>
      </form>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={item.completed ? styles.completed : ""}
              onClick={() => handleToggle(item.id)}
            >
              {item.text} <button onClick={() => handleRemove(item.id)}>[X]</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
