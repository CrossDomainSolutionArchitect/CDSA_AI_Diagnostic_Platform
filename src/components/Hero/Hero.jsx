import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import styles from './Hero.module.css'

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function AuthenticatedSkinScanLink({ className, children }) {
  const { isSignedIn } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()

  function handleClick(event) {
    if (isSignedIn) {
      event.preventDefault()
      navigate('/skinscan')
      return
    }

    event.preventDefault()
    openSignIn({ afterSignInUrl: '/skinscan', afterSignUpUrl: '/skinscan' })
  }

  return <a href="/skinscan" className={className} onClick={handleClick}>{children}</a>
}

function SkinScanLink({ className, children }) {
  if (!clerkEnabled) {
    return <a href="/skinscan" className={className}>{children}</a>
  }

  return <AuthenticatedSkinScanLink className={className}>{children}</AuthenticatedSkinScanLink>
}

function Hero() {
  const slides = [
    {
      title: 'Skin',
      image: '/images/face_breakout.jpeg',
      description: 'Acne, eczema, and psoriasis — read from one photo, with a clear next step.',
      status: 'active',
    },
  ]

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.copy}>
          
          <h1>AI Clinical Diagnostic<br />Studio</h1>
          <p className={styles.subtitle}>
           Upload one photo and get an instant, plain-English read on acne,
    eczema, or psoriasis — plus a clear next step.
          </p>
          <div className={styles.ctaGroup}>
            <SkinScanLink className={styles.primaryBtn}>Check my skin<span aria-hidden="true">↗</span></SkinScanLink>
            
          </div>
         
        </div>

        <div className={styles.visual} aria-label="AI diagnostic sectors">
          <div className={styles.slides}>
            {slides.map((slide, index) => (
              <div
                className={`${styles.slide} ${styles.activeSlide}`}
                key={slide.title}
              >
                <img src={slide.image} alt={`${slide.title} AI diagnostics`} />
                <div className={styles.slideShade} />
                <div className={styles.slideContent}>
                  
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default Hero