import { createScriptLoader } from "@solid-primitives/script-loader"

export default function Ads() {
  createScriptLoader({
    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4587152222007322",
    async: true,
    crossorigin: "anonymous",
  })

  return <></>
}
