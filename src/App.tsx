import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/site/Layout'
import { Home } from '@/pages/Home'
import { Perception } from '@/pages/Perception'
import { Alignment } from '@/pages/Alignment'
import { Diagnosis } from '@/pages/Diagnosis'
import { Studio } from '@/pages/Studio'
import { Courses } from '@/pages/Courses'
import { About } from '@/pages/About'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perception" element={<Perception />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
