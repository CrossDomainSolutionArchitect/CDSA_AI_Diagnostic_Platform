import React from 'react'
import { Link } from 'react-router-dom'
import styles from './PartnerSection.module.css'

function PartnerSection() {
  return (
    <section className={styles.partner}>
      <div className="container">
        <h2>Let's build
something together!</h2>
        <p>
          Validating AI for Southern African skin.
          <br /><br />
          We're building SkinScan for local skin tones and conditions — and looking for dermatologists, clinic partners, and community health workers to help validate it.
        </p>
        <Link to="/partner" className={styles.btn}>
          Get in Touch <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </section>
  )
}

export default PartnerSection