import { RouterProvider } from "react-router-dom"
import { useMemo } from "react"
import { createAppRouter } from "./router/router"

function App() {
  const router = useMemo(createAppRouter, [])
  return <RouterProvider router={router}/>
}

export default App
