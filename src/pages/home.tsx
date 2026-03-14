import { useStore } from "../store/useStore"

export default function HomePage() {

  const user = useStore((state) => state.user)!

  

  return (
    <main className='mx-auto max-w-6xl px-6 py-6'>
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-2xl font-semibold">
          Welcome back, {user.name}!
        </h1>
      </div>
    </main>
  )
}