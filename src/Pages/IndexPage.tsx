import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { asset } from '../backend/data'
import type { GoToPage } from './types'

const slides = [
  {
    title: 'Office Furniture',
    image: asset('onboarding/1.png'),
    text: 'Modern furniture for focused work, calm corners, and clean office style.',
  },
  {
    title: 'Relaxing Furniture',
    image: asset('onboarding/2.png'),
    text: 'Comfortable pieces that make every room softer, warmer, and easier to enjoy.',
  },
  {
    title: 'Home Decor',
    image: asset('onboarding/3.png'),
    text: 'The best furniture store connects your home to comfort, calm, and modern style.',
  },
]

export function IndexPage({
  activeSlide,
  setActiveSlide,
  go,
}: {
  activeSlide: number
  setActiveSlide: Dispatch<SetStateAction<number>>
  go: GoToPage
}) {
  const slide = slides[activeSlide]
  const isLastSlide = activeSlide === slides.length - 1

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((activeSlide + 1) % slides.length)
    }, 3800)

    return () => window.clearInterval(timer)
  }, [activeSlide, setActiveSlide])

  const next = () => {
    if (isLastSlide) {
      go('login')
      return
    }

    setActiveSlide(activeSlide + 1)
  }

  return (
    <main className="onboarding-page dark-page">
      <img className="brand-logo" src={asset('logo/logo.png')} alt="Fuzzy" />
      <div className="hero-stage">
        <img className="orbit" src={asset('onboarding/design1.png')} alt="" />
        <span className="orbit-ring orbit-ring-one" />
        <span className="orbit-ring orbit-ring-two" />
        <img className="hero-product" key={slide.title} src={slide.image} alt={slide.title} />
        <img className="floating floating-one" src={asset('onboarding/vector1.png')} alt="" />
        <img className="floating floating-two" src={asset('onboarding/vector2.png')} alt="" />
        <img className="floating floating-three" src={asset('onboarding/vector3.png')} alt="" />
      </div>
      <section className="intro-panel">
        <div className="slider-dots">
          {slides.map((item, index) => (
            <button
              className={index === activeSlide ? 'active' : ''}
              key={item.title}
              aria-label={item.title}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
        <h1>{slide.title}</h1>
        <p>{slide.text}</p>
        <button className="circle-next" onClick={next} aria-label="Next">
          -&gt;
        </button>
      </section>
    </main>
  )
}
