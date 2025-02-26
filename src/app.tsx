import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { createScriptLoader } from "@solid-primitives/script-loader"
import "./app.css";

export default function App() {
  createScriptLoader({
    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4587152222007322",
    async: true,
    crossorigin: "anonymous",
  })

  return (
    <Router
      root={props => (
        <Suspense>{props.children}</Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
