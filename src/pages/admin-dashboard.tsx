import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/useStore"
import {
  apiGetReports,
  apiResolveReport,
  apiGetModerationHistory,
  apiHideListing,
  apiUnhideListing,
  apiSuspendUser,
  apiUnsuspendUser,
  ApiError,
} from "../api/client"

type Tab = "reports" | "moderation"

export default function AdminDashboardPage() {
  const user = useStore((state) => state.user)
  const [tab, setTab] = useState<Tab>("reports")

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <p className="text-brand-text mb-4">You must be logged in to access this page.</p>
          <Link to="/login" className="text-brand-accent font-bold hover:text-brand-accent/80">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-brand-header tracking-tight">
            Admin Dashboard<span className="text-brand-accent">.</span>
          </h1>
          <p className="text-brand-text text-sm mt-1">Moderation and reports management.</p>
        </header>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("reports")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "reports"
                ? "bg-brand-accent text-white"
                : "bg-brand-surface-secondary text-brand-header/80 hover:bg-brand-surface-secondary/80 border border-brand-input-border"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setTab("moderation")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "moderation"
                ? "bg-brand-accent text-white"
                : "bg-brand-surface-secondary text-brand-header/80 hover:bg-brand-surface-secondary/80 border border-brand-input-border"
            }`}
          >
            Moderation
          </button>
        </div>

        <div className="bg-brand-surface/40 border border-brand-border rounded-3xl p-6">
          {tab === "reports" && <ReportsTab />}
          {tab === "moderation" && <ModerationTab />}
        </div>
      </div>
    </div>
  )
}

function ReportsTab() {
  const [reports, setReports] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<Record<string, unknown> | null>(null)
  const [resolutionNote, setResolutionNote] = useState("")
  const [resolving, setResolving] = useState(false)

  const fetchReports = () => {
    setLoading(true)
    setError(null)
    apiGetReports()
      .then(setReports)
      .catch((err) => setError(err instanceof Error ? err.message : "Error loading reports"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [])

  const handleResolve = async (reportId: string) => {
    if (!resolutionNote.trim()) return
    setResolving(true)
    try {
      await apiResolveReport(reportId, resolutionNote.trim())
      setResolutionNote("")
      setSelectedReport(null)
      fetchReports()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resolve")
    } finally {
      setResolving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" /></div>
  }

  if (error) {
    return <p className="text-red-400 text-center py-8">{error}</p>
  }

  return (
    <div>
      {selectedReport ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedReport(null)} className="text-brand-accent hover:text-brand-accent/80 text-sm font-bold">
            ← Back to reports
          </button>
          <div className="space-y-3">
            <p className="text-brand-header"><span className="text-brand-text/70">Reason:</span> {String(selectedReport.Reason ?? "")}</p>
            <p className="text-brand-header"><span className="text-brand-text/70">Comment:</span> {String(selectedReport.Comment ?? "")}</p>
            <p className="text-brand-header"><span className="text-brand-text/70">Status:</span> {String(selectedReport.Status ?? "")}</p>
          </div>
          <div className="flex gap-3 mt-6">
            <input
              type="text"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Resolution note..."
              className="flex-1 bg-brand-input/60 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
            <button
              onClick={() => handleResolve(String(selectedReport.Id ?? ""))}
              disabled={resolving || !resolutionNote.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
            >
              {resolving ? "Resolving..." : "Resolve"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {reports.length === 0 ? (
            <p className="text-brand-text/70 text-center py-8">No reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r: Record<string, unknown>, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedReport(r)}
                  className="w-full text-left p-4 rounded-2xl bg-brand-surface-secondary/50 hover:bg-brand-surface-secondary border border-brand-input-border transition-colors"
                >
                  <p className="text-brand-header font-bold text-sm">{String(r.Reason ?? "Report")}</p>
                  <p className="text-brand-text text-xs mt-1 truncate">{String(r.Comment ?? "")}</p>
                  <span className={`text-[10px] font-bold uppercase mt-2 inline-block ${
                    String(r.Status ?? "") === "Resolved" ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {String(r.Status ?? "")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ModerationTab() {
  const [listingId, setListingId] = useState("")
  const [userId, setUserId] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [history, setHistory] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    apiGetModerationHistory(1, 20)
      .then((res) => setHistory(res.actions as Record<string, unknown>[] ?? []))
      .catch(() => {})
  }, [])

  const handleHide = async () => {
    if (!listingId || !reason) return
    setLoading(true)
    setMessage("")
    try {
      await apiHideListing(listingId, reason)
      setMessage("Listing hidden successfully.")
      setListingId("")
      setReason("")
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  const handleUnhide = async () => {
    if (!listingId || !reason) return
    setLoading(true)
    setMessage("")
    try {
      await apiUnhideListing(listingId, reason)
      setMessage("Listing unhidden successfully.")
      setListingId("")
      setReason("")
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    if (!userId || !reason) return
    setLoading(true)
    setMessage("")
    try {
      await apiSuspendUser(userId, reason)
      setMessage("User suspended successfully.")
      setUserId("")
      setReason("")
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  const handleUnsuspend = async () => {
    if (!userId || !reason) return
    setLoading(true)
    setMessage("")
    try {
      await apiUnsuspendUser(userId, reason)
      setMessage("User unsuspended successfully.")
      setUserId("")
      setReason("")
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <p className={`text-sm px-4 py-2 rounded-xl ${message.includes("successfully") ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-brand-header font-bold text-sm">Listing Actions</h3>
          <input
            type="text"
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            placeholder="Listing ID (GUID)"
            className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={handleHide} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all">
              Hide Listing
            </button>
            <button onClick={handleUnhide} disabled={loading} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all">
              Unhide Listing
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-brand-header font-bold text-sm">User Actions</h3>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID (GUID)"
            className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full bg-brand-input/60 border border-brand-input-border text-brand-header rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={handleSuspend} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all">
              Suspend User
            </button>
            <button onClick={handleUnsuspend} disabled={loading} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all">
              Unsuspend User
            </button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <h3 className="text-brand-header font-bold text-sm mb-3">Recent Actions</h3>
          <div className="space-y-2">
            {history.map((action: Record<string, unknown>, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-brand-surface/30 border border-brand-input-border text-sm">
                <span className="text-brand-text">{String(action.Action ?? "")}</span>
                <span className="text-brand-text/70 ml-2">{String(action.Reason ?? "")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
