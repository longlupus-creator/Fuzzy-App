import { asset } from '../backend/data'
import type { GoToPage } from './types'

const slides = [
  { title: 'Office Furniture', image: asset('onboarding/1.png') },
  { title: 'Relaxing Furniture', image: asset('onboarding/2.png') },
  { title: 'Home Decor', image: asset('onboarding/3.png') },
]

export function IndexPage({
  activeSlide,
  setActiveSlide,
  go,
}: {
  activeSlide: number
  setActiveSlide: (index: number) => void
  go: GoToPage
}) {
  const slide = slides[activeSlide]

  return (
    <main className="onboarding-page dark-page">
      <img className="brand-logo" src={asset('logo/logo.png')} alt="Fuzzy" />
      <div className="hero-stage">
        <img className="orbit" src={asset('onboarding/design1.png')} alt="" />
        <img className="hero-product" src={slide.image} alt={slide.title} />
        <img className="floating floating-one" src={asset('onboarding/vector1.png')} alt="" />
        <img className="floating floating-two" src={asset('onboarding/vector2.png')} alt="" />
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
        <p>The best furniture store connects your home to comfort, calm, and modern style.</p>
        <button className="circle-next" onClick={() => go('login')} aria-label="Next">
          -&gt;
        </button>
      </section>
    </main>
  )
}
