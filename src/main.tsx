import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import "@fontsource-variable/inter"

document.addEventListener("focusin", (e) => {
  if (e.target instanceof HTMLInputElement) e.target.select()
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
