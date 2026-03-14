import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { validateListing } from "../services/listing.service";

export default function CreateListingPage() {
  //Permite redirigir a un usuario a otra página
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const addListing = useStore((state) => state.addListing);
  //Mensaje de error para mostrar validaciones
  const [error, setError] = useState("");
  //Estado del formulario para controlar los inputs
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Electronics",
    condition: "Good",
    description: "",
    image: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    const validation = validateListing({
      title: formData.title,
      description: formData.description,
      price: formData.price,
    });
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    const listing = {
      id: `listing-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      status: "available" as const,
      images: formData.image ? [formData.image] : ["https://via.placeholder.com/400"],
      ownerId: user.id,
      isFavorite: false,
    };
    addListing(listing);
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-4">You have to log in to create a listing.</p>
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">Log In</Link>
        </div>
      </div>
    );
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
          {/* COLUMNA IZQUIERDA: Formulario (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-5">
              
              {/* Título */}
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
                {/* Precio */}
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
                  <p className="text-slate-500 text-[10px] mt-1 ml-1">Mín. $0, máx. $999,999</p>
                </div>
                {/* Categoría */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select
                    name="category"
                    onChange={handleChange}
                    className="w-full bg-slate-900/60 border border-slate-700 text-slate-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all appearance-none"
                  >
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Services</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
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

          {/* COLUMNA DERECHA: Imagen y Submit (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Product Image</label>
              
              <div 
                className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                  ${formData.image ? "border-indigo-500" : "border-slate-700 hover:border-slate-500"}`}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setFormData({...formData, image: null})}
                      className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-500 text-sm">Drop your image here or</p>
                    <label className="text-indigo-400 font-bold cursor-pointer hover:text-indigo-300 transition-colors">
                      Browse files
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                Publish Listing
              </button>
              
              <p className="text-[10px] text-slate-500 text-center mt-4 leading-tight">
                By publishing, you agree to our Campus Trading Guidelines.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}