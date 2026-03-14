import CreateListing from "./pages/create-listing"
import ListingDetail from "./pages/listing-details"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Listings from "./pages/listings"
import Login from "./pages/login"
import Navbar from "./components/layout/Navbar"
import Signup from "./pages/sign-up"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import NotFound from "./pages/not-found"

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
