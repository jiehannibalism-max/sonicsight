import { Nav } from '@/components/site/Nav'
import { Hero } from '@/components/site/Hero'
import { SectionPerception } from '@/components/site/SectionPerception'
import { SectionAlignment } from '@/components/site/SectionAlignment'
import { SectionDiagnosis } from '@/components/site/SectionDiagnosis'
import { SectionTraining } from '@/components/site/SectionTraining'
import { Footer } from '@/components/site/Footer'

export function Landing() {
  return (
    <div className="min-h-svh bg-background">
      <Nav />
      <main>
        <Hero />
        <SectionPerception />
        <SectionAlignment />
        <SectionDiagnosis />
        <SectionTraining />
      </main>
      <Footer />
    </div>
  )
}
