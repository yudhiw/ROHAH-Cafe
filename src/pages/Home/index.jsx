import { useEffect } from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Menu from './Menu'
import Promo from './Promo'
import Gallery from './Gallery'
import Testimonial from './Testimonial'
import Contact from './Contact'
import Footer from './Footer'

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach((el) => observer.observe(el))

    return () => {
      revealEls.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Promo />
      <Gallery />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  )
}
