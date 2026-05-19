import { useState } from "react"
import { apiCreateReport, ApiError } from "../api/client"

interface ReportFormProps {
  reportedUserId: string
  reportedListingId?: string
  onClose: () => void
}

export default function ReportForm({ reportedUserId, reportedListingId, onClose }: ReportFormProps) {
  const [reason, setReason] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim() || !comment.trim()) {
      setError("Both reason and comment are required.")
      return
    }
    setLoading(true)
    setError("")
    try {
      await apiCreateReport({
        reportedUserId,
        reportedListingId,
        reason: reason.trim(),
        comment: comment.trim(),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit report.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-3xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">
            {success ? "Report Submitted" : "Report"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <p className="text-emerald-400 mb-4">Your report has been submitted. Our team will review it.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Reason
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Inappropriate content, Scam, Spam"
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Comment
              </label>
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl border border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
