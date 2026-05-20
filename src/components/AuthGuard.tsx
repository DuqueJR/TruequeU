import { Link } from "react-router-dom"

interface AuthGuardProps {
  heading: string
  description: string
  showSignUp?: boolean
}

export default function AuthGuard({ heading, description, showSignUp = true }: AuthGuardProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-black text-brand-header mb-4">
          {heading}
        </h2>
        <p className="text-brand-text mb-6">
          {description}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl transition-all"
          >
            Sign In
          </Link>
          {showSignUp && (
            <Link
              to="/signup"
              className="px-6 py-3 bg-brand-surface-secondary hover:bg-brand-surface-secondary/80 text-brand-header/80 font-bold rounded-xl border border-brand-input-border transition-all"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
