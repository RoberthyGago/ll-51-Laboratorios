import React from "react";
import ReactDOM from "react-dom/client";
import Greeting from "./app.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Greeting name="Roberth" />
  </React.StrictMode>
);