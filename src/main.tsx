import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { UI } from "./UI";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <>
    <App />
    <UI />
  </>
);
