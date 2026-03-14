import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { Routes, Route } from "react-router-dom"

import Home from "./pages/home"
import ListingDetail from "./pages/listing_details"
import CreateListing from "./pages/create_listing"
import Login from "./pages/login"

function App() {
  

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/listing/:id" element={<ListingDetail />} />

      <Route path="/create" element={<CreateListing />} />

      <Route path="/login" element={<Login />} />

    </Routes>
  )
}

export default App
