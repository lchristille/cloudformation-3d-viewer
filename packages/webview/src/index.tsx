import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InitSettings } from "./settings";
import "../public/styles/tailwind.css";
import App from "./app/App";
import { StoreProvider } from "./app/stores/StoreContext";

const rootElement = document.querySelector("#root");

InitSettings();

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </StrictMode>
  );
}
