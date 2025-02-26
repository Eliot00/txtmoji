import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";
import "./app.css";

const ClientAds = clientOnly(() => import("./components/Ads"))

export default function App() {

  return (
    <Router
      root={props => (
        <Suspense>{props.children}</Suspense>
      )}
    >
      <ClientAds />
      <FileRoutes />
    </Router>
  );
}
