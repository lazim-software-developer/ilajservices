import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import TagManager from 'react-gtm-module';

// Initialize GTM with your GTM ID
const tagManagerArgs = {
  gtmId: 'G-BCY6K47PLY', // Replace this with your actual GTM ID
};
TagManager.initialize(tagManagerArgs);
createRoot(document.getElementById("root")!).render(<App />);
