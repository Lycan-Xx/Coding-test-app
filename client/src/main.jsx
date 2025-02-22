import { createRoot } from "react-dom/client";
import App from "./App.jsx";  // Update extension to .jsx explicitly
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);