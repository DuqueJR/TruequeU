import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { validateLogin } from "../services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = validateLogin(email, password);
    if (user) {
      login(user);
      navigate("/");
    } else {
      setError("Email o contraseña incorrectos. Regístrate si no tienes cuenta.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      {/* Tarjeta de Login */}
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Encabezado */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Welcome back<span className="text-indigo-500">.</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your details to access your trades.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>
            )}
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="name@university.edu"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-8 text-center">
            <span className="bg-[#1e293b] px-4 text-slate-500 text-xs uppercase font-bold relative z-10">
              Or continue with
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800"></div>
          </div>

          {/* Botones Sociales (Ejemplo) */}
          <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors">
            <img src="https://www.svgrepo.com/download/452062/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
            University Microsoft Account
          </button>
        </div>

        {/* Link a Registro */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white font-bold hover:text-indigo-400 transition-colors underline underline-offset-4">
            Create one now
          </Link>
        </p>
        <p className="text-center mt-2 text-slate-500 text-xs">
          Ej: juan.perez@eia.edu.co / Juan123!
        </p>
      </div>
    </div>
  );
}