import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("Initializing app...");
const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  console.error("Failed to find root element!");
} else {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  console.log("Rendering app...");
  root.render(<App />);
  console.log("App rendered!");
}
