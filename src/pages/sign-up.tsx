import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../store/useStore"
import { apiRegister, apiGetCurrentUser, ApiError } from "../api/client"
import { validatePassword } from "../services/auth.service"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useStore((state) => state.login)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const passwordCheck = validatePassword(formData.password)
    if (!passwordCheck.valid) {
      setError(passwordCheck.message)
      return
    }

    setLoading(true)
    try {
      await apiRegister({
        userName: formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      })
      const fullUser = await apiGetCurrentUser()
      login(fullUser)
      navigate("/")
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("This email is already registered.")
        } else if (err.status === 403) {
          setError("Registration is currently unavailable.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Connection error. Try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-brand-surface/40 backdrop-blur-2xl border border-brand-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-brand-header tracking-tighter mb-3">
              Join the community<span className="text-brand-accent">.</span>
            </h2>
            <p className="text-brand-text font-medium">
              Start trading items with students from your campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="md:col-span-2">
                <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                University Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="user@uni.edu"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="Min. 8 chars, uppercase, number and symbol"
              />
              <p className="text-brand-text/70 text-[10px] mt-1 ml-1">
                Min. 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol
              </p>
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-brand-text/70 uppercase tracking-widest mb-2 ml-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-brand-accent/20 active:scale-[0.99]"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-center mt-10 text-brand-text text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-header font-bold hover:text-brand-accent transition-colors underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
