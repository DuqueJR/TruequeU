import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    major: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registrando usuario:", formData);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Efectos de luces de fondo (Blur Orbs) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-[#1e293b]/40 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
              Join the community<span className="text-indigo-500">.</span>
            </h2>
            <p className="text-slate-400 font-medium">
              Start trading items with students from your campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                University Email
              </label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="user@uni.edu"
              />
            </div>

            {/* Major / Career */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Major / Faculty
              </label>
              <input
                name="major"
                type="text"
                required
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="Engineering"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Confirm
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.99]"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Footer del Form */}
          <p className="text-center mt-10 text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:text-indigo-400 transition-colors underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}