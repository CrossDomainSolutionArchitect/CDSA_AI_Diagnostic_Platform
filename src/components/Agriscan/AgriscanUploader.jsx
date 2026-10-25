import React from 'react'
import styles from './AgriscanUploader.module.css'

const crops = [
  { number: '.01', title: 'Maize', image: '/images/Maizee.jpg' },
  { number: '.02', title: 'Tomato', image: '/images/Tomatos.jpg' },
  { number: '.03', title: 'Citrus', image: '/images/Citrus.jpg' },
  { number: '.04', title: 'Potato', image: '/images/Potato.jpg' },
]

function AgriscanUploader() {
  return (
    <div className={styles.container}>
      <h2>What do you want to check?</h2>
      <p className={styles.subtitle}>
        Choose an area to explore with AI-powered analysis and recommendations.
      </p>

      <div className={styles.cropOptions}>
        {crops.map((crop) => (
          <article className={styles.cropOption} key={crop.title}>
            <img src={crop.image} alt={`${crop.title} crop`} loading="lazy" />
            <div className={styles.cropContent}>
              <span className={styles.cropNumber}>{crop.number}</span>
              <h3>{crop.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.requestOption}>
        <div>
          <span className={styles.kicker}>Bring Agriscan to your farm</span>
          <h3>Smarter crop health starts here.</h3>
        </div>
        <p>Get AI-powered crop disease analysis and recommendations tailored to your operation. Request a demo to explore Agriscan with your team.</p>
        <a href="/partner" className={styles.demoLink}>Request demo <span aria-hidden="true">↗</span></a>
      </div>

      <div className={styles.uploadUnavailable} role="status">
        <span className={styles.uploadIcon}>🌿</span>
        <p>Image upload is currently unavailable.</p>
      </div>
    </div>
  )
}

export default AgriscanUploader