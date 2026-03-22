import { Suspense } from "react"
import { BrowserRouter, useRoutes } from "react-router-dom"
import routes from "~react-pages"

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
