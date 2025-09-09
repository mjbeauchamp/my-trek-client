import { Routes, Route, Link } from "react-router"
import './App.css'
import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import MyGear from "./pages/MyGear"
import PageNotFound from "./pages/PageNotFound"

function App() {
  return (
    <>
      <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gear" element={<MyGear />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
