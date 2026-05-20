import { useEffect } from "react"
import { useStore } from "../store/useStore"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const apply = () => {
        if (mq.matches) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      }
      apply()
      mq.addEventListener("change", apply)
      return () => mq.removeEventListener("change", apply)
    }

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return <>{children}</>
}
