// app/page.tsx
import { LandingHero } from '@/components/landing/Hero'
import { LandingFeatures } from '@/components/landing/Features'
import { LandingStats } from '@/components/landing/Stats'
import { LandingTestimonials } from '@/components/landing/Testimonials'
import { LandingCTA } from '@/components/landing/CTA'
import { LandingNav } from '@/components/landing/Nav'
import { LandingFooter } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-brand w-[600px] h-[600px] -top-32 -left-32 opacity-60" />
        <div className="orb orb-accent w-[400px] h-[400px] top-1/2 -right-20 opacity-40" />
        <div className="orb orb-brand w-[300px] h-[300px] bottom-0 left-1/3 opacity-30" />
      </div>

      <LandingNav />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
