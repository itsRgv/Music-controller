import App from "./components/App";
import React from "react";
import ReactDom from "react-dom/client";

const appDiv = document.getElementById("app");
const root = ReactDom.createRoot(appDiv);
root.render(<App />);
