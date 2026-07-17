import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./app/page";
import MainPage from "./app/main/page";
import AlertsPage from "./app/main/alerts/page";
import MonitoringPage from "./app/main/monitoring/page";
import PoolsPage from "./app/main/pools/page";
import DosingPage from "./app/main/dosing/page";
import "./app/globals.css";

const routeComponents: Record<string, () => React.JSX.Element> = {
  "/": HomePage,
  "/main": MainPage,
  "/main/alerts": AlertsPage,
  "/main/monitoring": MonitoringPage,
  "/main/pools": PoolsPage,
  "/main/dosing": DosingPage,
};

function currentRoute() {
  const rawRoute = window.location.hash.slice(1).split("?")[0] || "/";
  if (rawRoute === "/enter" || rawRoute === "/product") return "/main";
  return routeComponents[rawRoute] ? rawRoute : "/";
}

function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    const handleInternalLink = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("http")) return;

      if (href.startsWith("#") && !href.startsWith("#/")) {
        const section = document.getElementById(href.slice(1));
        if (section) {
          event.preventDefault();
          section.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      if (href.startsWith("/")) {
        event.preventDefault();
        const destination = href.startsWith("/enter") || href.startsWith("/product")
          ? "/main"
          : href;
        window.location.hash = destination;
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleInternalLink);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleInternalLink);
    };
  }, []);

  const Page = routeComponents[route] ?? HomePage;
  return <Page />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
