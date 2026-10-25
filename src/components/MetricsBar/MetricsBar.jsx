import React from 'react'
import styles from './MetricsBar.module.css'

function MetricsBar() {
  return (
    <section className={styles.metrics}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.panel} ${styles.databasePanel}`}>
            <span className={styles.kicker}>AI powered by one of the world's largest exclusive skin image databases</span>
            <h3>10k+</h3>
            <p className={styles.unit}>Images</p>
            <img src="/images/all-photos.jpg" alt="AI image analysis interface" width="600" height="265" />
            
            <span className={styles.note}>Demonstration testing of skin, face, nails, hair and makeup application</span>
          </div>

        </div>
      </div>
    </section>
  )
}

export default MetricsBar