import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import styles from './HowItWorks.module.css'

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

function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className="container">
        <div className={styles.contentPanel}>
          <div className={styles.sectionHeader}>
            <h2>How does this work</h2>
          </div>

          <div className={styles.steps}>
            <article className={styles.step}>
              <div className={styles.stepHeading}>
                <span className={styles.stepNumber}>.01</span>
                <h3>User scans the Skin- face</h3>
              </div>
              <div className={styles.imageWrapper}>
                <img
                  src="/images/eczema_spot.jpeg"
                  alt="User scans their face with a phone"
                  className={styles.stepImage}
                  loading="lazy"
                />
              </div>
            </article>

            <article className={styles.step}>
              <div className={styles.stepHeading}>
                <span className={styles.stepNumber}>.02</span>
                <h3>Gets recommendations by categories</h3>
              </div>
              <div className={styles.imageWrapper}>
                <img
                  src="/images/removed-back.jpg"
                  alt="Personalized recommendations shown by category"
                  className={styles.stepImage}
                  loading="lazy"
                />
              </div>
            </article>
          </div>

          <div className={styles.business}>
            <div>
              <span className={styles.kicker}>For clinics and practices</span>
              <h3>Fewer guesswork <br />appointments.</h3>
            </div>
            <div className={styles.results}>
              <p>3 conditions pre-screened</p>
              <p>60s average read time</p>
              <SkinScanLink className={styles.demoButton}>
                <span>Check my skin</span>
                <span aria-hidden="true">↗</span>
              </SkinScanLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks