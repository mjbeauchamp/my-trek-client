import { Routes, Route } from "react-router"
import './App.scss'
import RootLayout from "./layouts/RootLayout/RootLayout"
import Home from "./pages/Home/Home"
import MyGear from "./pages/MyGear"
import PageNotFound from "./pages/PageNotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import BackpackingBasics from "./components/BackpackingBasics/BackpackingBasics"
import GearLists from "./components/GearLists/GearLists"
import GearList from "./components/GearList/GearList"

function App() {
  return (
    <>
      <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gear-tips" element={<BackpackingBasics />} />
        <Route path="/my-gear-lists" element={<GearLists />} />
        <Route path="/my-gear-lists/:listId" element={<ProtectedRoute><GearList /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
