import { isDesktop } from "react-device-detect";
import { createRoot } from "react-dom/client";
import App from "./App";
import { MobilePage } from "./MobilePage";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(isDesktop ? <App /> : <MobilePage />);
