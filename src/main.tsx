import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 🌟 Welcome, curious one...
console.log('%c✨ SF Secret Menu', 'font-size: 24px; font-weight: bold; color: #f59e0b;');
console.log('%cNourishing body, mind, and soul with organic, chef-crafted meals.', 'font-size: 12px; color: #a1a1aa;');
console.log('%c🔮 Psst... there\'s more to discover. Not everything is visible at first glance.', 'font-size: 11px; color: #71717a; font-style: italic;');
console.log('%c↑↑↓↓←→←→ ... you know the rest 🎮', 'font-size: 10px; color: #52525b;');

createRoot(document.getElementById("root")!).render(<App />);
