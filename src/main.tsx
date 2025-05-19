import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, HashRouter } from "react-router";
import AppRoutes from "./routes";

const Router = import.meta.env.DEV ? BrowserRouter : HashRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <AppRoutes />
  </Router>
);
