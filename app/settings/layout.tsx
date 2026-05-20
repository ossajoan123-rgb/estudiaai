// app/academic/layout.tsx

import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth()

  // NO LOGIN
  if (!session?.user) {
    redirect('/auth/login')
  }

  // NO ONBOARDING
  if (
  session.user.onboardingCompleted !== true
) {
  redirect('/onboarding')
}

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: 'var(--surface-bg)',
      }}
    >

      <Sidebar user={session.user} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">

        <TopBar user={session.user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  )
}