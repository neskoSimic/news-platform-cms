import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          richColors
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#13131a",
              border: "1px solid #2e303a",
              color: "#ededf0",
              fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
