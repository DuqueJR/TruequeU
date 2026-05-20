import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiCreateListing } from "../api/client"
import { categories, conditions, validateListing } from "../services/listing.service"

export default function CreateListingPage() {
  const user = useStore((state) => state.user)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    campusLocation: "",
    imageUrls: [""],
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleImageChange = (index: number, value: string) => {
    const newUrls = [...formData.imageUrls]
    newUrls[index] = value
    setFormData({ ...formData, imageUrls: newUrls })
  }

  const addImageField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] })
  }

  const removeImageField = (index: number) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index)
    setFormData({ ...formData, imageUrls: newUrls.length ? newUrls : [""] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError("")

    const filteredUrls = formData.imageUrls.filter((u) => u.trim() !== "")
    const validation = validateListing({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      condition: formData.condition,
      campusLocation: formData.campusLocation,
      imageUrls: filteredUrls,
    })
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    setLoading(true)
    try {
      await apiCreateListing({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: categories.indexOf(formData.category),
        condition: conditions.indexOf(formData.condition),
        campusLocation: formData.campusLocation.trim(),
        imageUrls: filteredUrls,
      })
      navigate("/listings")
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError("Error creating listing")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-brand-text mb-4">You have to log in to create a listing.</p>
          <Link to="/login" className="text-brand-accent font-bold hover:text-brand-accent/80">Log In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-brand-header tracking-tighter">
            New Listing<span className="text-brand-accent">.</span>
          </h1>
          <p className="text-brand-text mt-2 text-sm">
            Post an item for the campus community to discover.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Title
              </label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="e.g. Calculus textbook 5th edition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all resize-none"
                placeholder="Describe the item — condition, usage, and why someone would want it."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Condition
              </label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
              >
                <option value="">Select condition</option>
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Campus Location
              </label>
              <input
                name="campusLocation"
                type="text"
                required
                value={formData.campusLocation}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="e.g. Main Campus — Building A"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-brand-text/70 uppercase tracking-widest ml-1">
                Images
              </label>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-brand-accent hover:text-brand-accent/80 font-bold"
              >
                + Add image URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className="flex-1 bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="shrink-0 px-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl active:scale-[0.99]"
            >
              {loading ? "Creating..." : "Publish Listing"}
            </button>
            <Link
              to="/listings"
              className="px-6 flex items-center justify-center bg-brand-surface-secondary hover:bg-brand-surface-secondary/80 text-brand-header/80 font-bold rounded-2xl border border-brand-input-border transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
