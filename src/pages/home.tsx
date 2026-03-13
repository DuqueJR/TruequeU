import type { User } from "../types";

export default function HomePage({user}: {user: User}) {
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