import { RouterProvider } from "react-router-dom"
import { useMemo } from "react"
import { createAppRouter } from "./router/router"
import { Loading } from "./ui"

function App() {
  const router = useMemo(createAppRouter, [])
  // The fallback shows while a lazily loaded page is fetched on first load (e.g. a deep link to a case).
  return <RouterProvider router={router} fallbackElement={<Loading />}/>
}

export default App
