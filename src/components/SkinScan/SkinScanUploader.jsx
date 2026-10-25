import React, { useEffect, useState } from 'react'
import { predictSkinCondition } from '../../services/skinscanService'
import styles from './SkinScanUploader.module.css'

const checkOptions = [
  {
    number: '.01',
    title: 'Skin',
    description: 'Acne, eczema, and psoriasis — read from one photo, with a clear next step.',
    image: '/images/Skin.jpg',
    status: 'active',
  },
  {
    number: '.02',
    title: 'Nails',
    description: 'Discolouration, ridges, and nail changes — checked in seconds.',
    image: '/images/Nailts.jpg',
    status: 'coming-soon',
  },
  {
    number: '.03',
    title: 'Hair',
    description: 'Scalp and hairline concerns, assessed from an image instead of a guess.',
    image: '/images/Hair.jpg',
    status: 'coming-soon',
  },
]

function SkinScanUploader() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  async function handleAnalyze() {
    if (!selectedFile) return

    setIsLoading(true)
    setError('')

    try {
      const prediction = await predictSkinCondition(selectedFile)
      setResult(prediction)
    } catch (analysisError) {
      setError(analysisError.message || 'Failed to analyze image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setPreviewUrl('')
    setResult(null)
    setError('')
  }

  return (
    <div className={styles.container}>
      <h2>What do you want to check?</h2>
      <p className={styles.subtitle}>
        Choose an area to explore with AI-powered analysis and recommendations.
      </p>

      <div className={styles.checkOptions}>
        {checkOptions.map((option) => (
          <article className={styles.checkOption} key={option.title}>
            <img src={option.image} alt={`${option.title} analysis`} className={styles.optionImage} loading="lazy" />
            <span className={styles.optionNumber}>{option.number}</span>
            <span className={`${styles.status} ${option.status === 'active' ? styles.activeStatus : styles.comingSoonStatus}`}>
              {option.status === 'active' ? 'Active' : 'Coming soon'}
            </span>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.makeupOption}>
        <div>
          <span className={styles.kicker}>Makeup try-on</span>
          <h3>Find your perfect shade in real time.</h3>
        </div>
        <p>Upload a photo or use your webcam to find the perfect shade of lipstick, eye shadow and blush in real time.<br /><br />Find out what suits you and create your own unique look without breaking the bank. Try it now and find your dream makeup!</p>
        <a href="/partner" className={styles.demoLink}>Request demo <span aria-hidden="true">↗</span></a>
      </div>

      {!previewUrl && (
        <label className={styles.uploadArea}>
          <span className={styles.uploadIcon}>📷</span>
          <span className={styles.uploadContent}>
            <strong>Upload a skin image</strong>
            <span>Choose a clear, well-lit photo to analyze.</span>
            <span className={styles.uploadHint}>JPG, PNG, or WEBP</span>
          </span>
          <input className={styles.fileInput} type="file" accept="image/*" onChange={handleFileChange} />
        </label>
      )}

      {previewUrl && (
        <div className={styles.previewSection}>
          <div className={styles.imageWrapper}>
            <img className={styles.previewImage} src={previewUrl} alt="Selected skin for analysis" />
          </div>
          <div className={styles.imageActions}>
            <button className={styles.analyzeBtn} type="button" onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze image'}
            </button>
            <button className={styles.resetBtn} type="button" onClick={handleReset} disabled={isLoading}>
              Choose another
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingOverlay} role="status">
          <div className={styles.spinner} />
          <p>Reading your image...</p>
          <span className={styles.loadingNote}>This can take a few seconds.</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBox} role="alert">
          <span className={styles.errorIcon}>!</span>
          <p>{error}</p>
          <button className={styles.retryBtn} type="button" onClick={handleAnalyze}>Try again</button>
        </div>
      )}

      {result && (
        <section className={styles.results} aria-live="polite">
          <h3>Analysis result</h3>
          <div className={styles.diagnosisBox}>
            <span className={styles.diagnosisLabel}>Most likely finding</span>
            <span className={styles.diagnosisValue}>{result.diagnosis}</span>
          </div>
          <div className={styles.confidenceSection}>
            <h4>Confidence</h4>
            {result.confidences?.length ? (
              <div className={styles.confidenceList}>
                {result.confidences.map((confidence) => {
                  const value = Number(confidence.confidence ?? confidence.score ?? 0)
                  const percentage = value <= 1 ? value * 100 : value
                  return (
                    <div className={styles.confidenceItem} key={confidence.label}>
                      <span className={styles.confidenceLabel}>{confidence.label}</span>
                      <span className={styles.confidenceBar}>
                        <span className={styles.confidenceFill} style={{ width: `${percentage}%` }} />
                      </span>
                      <span className={styles.confidenceValue}>{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className={styles.noConfidence}>No confidence breakdown was returned.</p>
            )}
          </div>
          <p className={styles.disclaimer}>This tool provides screening support and is not a medical diagnosis.</p>
        </section>
      )}
    </div>
  )
}

export default SkinScanUploader