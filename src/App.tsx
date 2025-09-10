import { Routes, Route } from "react-router"
import './App.css'
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import MyGear from "./pages/MyGear"
import PageNotFound from "./pages/PageNotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <>
      <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gear" element={<ProtectedRoute><MyGear /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
