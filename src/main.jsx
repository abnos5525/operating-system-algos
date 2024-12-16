import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContext } from "./context/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContext>
      <App />
    </AppContext>
  </StrictMode>
);
