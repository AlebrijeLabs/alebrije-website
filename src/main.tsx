import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WalletContextProvider } from "./WalletContext"; // 👈 Replaces your old WalletConnectionProvider
import "./index.css";

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
});

try {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </React.StrictMode>
  );
  console.log("React rendering completed");
} catch (error) {
  console.error("Error during React initialization:", error);
}
