
import { useState } from 'react';
// Home Page Component
export default function Home() {
  const [count, setCount] = useState(0);
  const update = () => {
    setCount((prev) => prev + 1);
  }
  return <>
    <h1> Admin Page </h1>
    <p> Counter: {count} </p>
    <button onClick={() => update()}>Update</button>
  </>;
}
