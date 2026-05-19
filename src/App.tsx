import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useStore } from "./store/useStore"
import { apiGetCurrentUser } from "./api/client"
import CreateListing from "./pages/create-listing"
import ListingDetail from "./pages/listing-details"
import Home from "./pages/home"
import Listings from "./pages/listings"
import Favorites from "./pages/favorites"
import Login from "./pages/login"
import Navbar from "./components/layout/Navbar"
import Signup from "./pages/sign-up"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import AdminDashboard from "./pages/admin-dashboard"
import NotFound from "./pages/not-found"

function App() {
  const login = useStore((state) => state.login)
  const logout = useStore((state) => state.logout)

  useEffect(() => {
    apiGetCurrentUser()
      .then((user) => login(user))
      .catch(() => logout())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
