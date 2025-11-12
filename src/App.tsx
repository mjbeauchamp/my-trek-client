import { Routes, Route } from "react-router"
import './App.scss'
import RootLayout from "./layouts/RootLayout/RootLayout"
import HomePage from "./pages/HomePage/HomePage"
import PageNotFound from "./pages/PageNotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Backpacking101Page from "./pages/Backpacking101Page/Backpacking101Page"
import BackpackingArticlePage from "./pages/BackpackingArticlePage/BackpackingArticlePage"
import GearListsPage from "./pages/MyGearListsPage/MyGearListsPage"
import GearListPage from "./pages/GearListPage/GearListPage"

function App() {
  return (
    <>
      <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/backpacking-101" element={<Backpacking101Page />} />
        <Route path="/backpacking-101/:articleId" element={<BackpackingArticlePage />} />
        <Route path="/my-gear-lists" element={<GearListsPage />} />
        <Route path="/my-gear-lists/:listId" element={<ProtectedRoute><GearListPage /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
