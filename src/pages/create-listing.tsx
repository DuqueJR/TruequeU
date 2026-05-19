import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import { validateListing } from "../services/listing.service"
import { apiCreateListing, ApiError } from "../api/client"
import { categoryToEnum, conditionToEnum } from "../api/mappers"

const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Other"] as const
const CONDITIONS = ["New", "LikeNew", "UsedGood", "UsedFair"] as const

export default function CreateListingPage() {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Electronics",
    condition: "UsedGood",
    description: "",
    campusLocation: "",
    imageUrls: [""],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const urls = [...formData.imageUrls]
    urls[index] = value
    setFormData({ ...formData, imageUrls: urls })
  }

  const addImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] })
  }

  const removeImageUrl = (index: number) => {
    const urls = formData.imageUrls.filter((_, i) => i !== index)
    setFormData({ ...formData, imageUrls: urls.length > 0 ? urls : [""] })
  }

  const validImageUrls = formData.imageUrls.filter((url) => url.trim().length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError("")

    const validation = validateListing({
      title: formData.title,
      description: formData.description,
      price: formData.price,
    })
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    if (!formData.campusLocation.trim()) {
      setError("Campus location is required.")
      return
    }

    if (validImageUrls.length < 3) {
      setError("At least 3 image URLs are required.")
      return
    }

    setLoading(true)
    try {
      const listing = await apiCreateListing({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: categoryToEnum(formData.category),
        condition: conditionToEnum(formData.condition),
        campusLocation: formData.campusLocation,
        imageUrls: validImageUrls,
      })
      navigate(`/listing/${listing.id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Connection error. Try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-4">You have to log in to create a listing.</p>
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">Log In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Create New Listing<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-slate-400 mt-2">Share what you have with the university community.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {error && (
            <div className="lg:col-span-5">
              <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>
            </div>
          )}

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Item Title</label>
                <input
                  name="title"
                  required
                  minLength={3}
                  maxLength={100}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                  placeholder="Example: Calculus Stewart 8th Edition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    min={0}
                    max={999999}
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 text-slate-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 text-slate-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all appearance-none"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Campus Location</label>
                  <input
                    name="campusLocation"
                    type="text"
                    required
                    value={formData.campusLocation}
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                    placeholder="Main Campus Building A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1000}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all resize-none"
                  placeholder="Describe the condition, reasons for trading, etc."
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">
                Product Images ({validImageUrls.length} / min 3)
              </label>

              <div className="space-y-3">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder={`https://example.com/image${index + 1}.jpg`}
                        className="w-full bg-slate-900/60 border border-slate-700 text-white text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                      />
                      {url.trim() && url.startsWith("http") && (
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="mt-2 w-full h-24 object-cover rounded-xl bg-slate-800"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      )}
                    </div>
                    {formData.imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="mt-1 p-2 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageUrl}
                className="mt-3 w-full py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 text-sm hover:border-indigo-500 hover:text-indigo-400 transition-all"
              >
                + Add another image
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                {loading ? "Publishing..." : "Publish Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
