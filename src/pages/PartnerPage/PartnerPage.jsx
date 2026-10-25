import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './PartnerPage.module.css'

function PartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    focus: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('https://formspree.io/f/xeewnede', {
        method: 'POST',
        body: new FormData(e.target),
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setStatus({
          type: 'success',
          message: '✓ Thank you for partnering with us! We\'ll respond within 48 hours at hello@cdsa.tech',
        })
        setFormData({
          name: '',
          email: '',
          organization: '',
          role: '',
          focus: '',
          message: '',
        })
        // Optionally redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      } else {
        setStatus({
          type: 'error',
          message: '⚠️ Something went wrong. Please try again or email us directly at hello@cdsa.tech',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: '⚠️ Network error. Please check your connection and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/" className={styles.backLink}>← Back to Home</Link>

        <div className={styles.header}>
          <span className={styles.kicker}>SkinScan partner programme</span>
          <h1>Request a pilot</h1>
          <p>Help us validate SkinScan for Southern African skin.</p>
        </div>

        <div className={styles.formWrapper}>
          {status.type === 'success' && (
            <div className={styles.successMessage}>{status.message}</div>
          )}
          {status.type === 'error' && (
            <div className={styles.errorMessage}>{status.message}</div>
          )}

          <form id="partner-form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="organization">Clinic / organisation / institution</label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Your Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="clinic_doctor_gp">Clinic doctor / GP</option>
                <option value="nurse_clinic_staff">Nurse / clinic staff</option>
                <option value="community_health_worker">Community health worker</option>
                <option value="public_health_ngo">Public health / NGO</option>
                <option value="researcher_academic">Researcher / academic</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="focus">Which skin conditions do you see most often?</label>
              <input
                type="text"
                id="focus"
                name="focus"
                placeholder="e.g., acne, eczema, psoriasis, fungal infections"
                value={formData.focus}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">How would you like to contribute?</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="e.g., share clinical images, review model outputs, connect us with clinics or patient groups..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Formspree honeypot */}
            <input type="text" name="_gotcha" style={{ display: 'none' }} />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Request a pilot →'}
            </button>
            <p className={styles.formNote}>
              We'll respond within 48 hours from <strong>hello@cdsa.tech</strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PartnerPage