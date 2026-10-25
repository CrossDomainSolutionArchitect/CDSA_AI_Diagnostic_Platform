import React, { useEffect, useState } from 'react'
import RedFlagCheck from './RedFlagCheck'
import { enrichSkinPrediction, predictSkinCondition } from '../../services/skinscanService'
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
  const [, setRedFlagResult] = useState(null)
  const [showRedFlags, setShowRedFlags] = useState(false)
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
    setRedFlagResult(null)
    setShowRedFlags(false)
    setError('')
  }

  function handleAnalyze() {
    if (!selectedFile) return
    setError('')
    setShowRedFlags(true)
  }

  async function handleRedFlagComplete(redFlagData) {
    setShowRedFlags(false)
    setRedFlagResult(redFlagData)
    setIsLoading(true)
    setError('')

    try {
      const prediction = await predictSkinCondition(selectedFile)
      setResult(enrichSkinPrediction(prediction, redFlagData))
    } catch (analysisError) {
      setError(analysisError.message || 'Failed to analyze image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleEmergency(message) {
    setShowRedFlags(false)
    setRedFlagResult(null)
    setResult({
      gated: true,
      gateReason: 'emergency',
      gateMessage: message,
      nextStep: 'emergency',
      nextStepLabel: 'Emergency - call an ambulance',
    })
  }

  function handleReset() {
    setSelectedFile(null)
    setPreviewUrl('')
    setResult(null)
    setRedFlagResult(null)
    setShowRedFlags(false)
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

      {showRedFlags && (
        <RedFlagCheck onComplete={handleRedFlagComplete} onEmergency={handleEmergency} />
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

          {result.gateReason === 'emergency' && (
            <div className={styles.emergencyBox}>
              <span className={styles.emergencyIcon}>🚨</span>
              <h3>Seek emergency care</h3>
              <p>{result.gateMessage}</p>
            </div>
          )}

          {result.gateReason === 'red-flag' && (
            <div className={styles.gateMessage}>
              <span className={styles.gateIcon}>⚠️</span>
              <p>{result.gateMessage}</p>
              <p className={styles.nextStepInline}><strong>Next step:</strong> {result.nextStepLabel}</p>
            </div>
          )}

          {(result.gateReason === 'low-confidence' || result.gateReason === 'unknown-condition') && (
            <div className={styles.gateMessage}>
              <span className={styles.gateIcon}>⚠️</span>
              <p>{result.gateMessage}</p>
              <p className={styles.nextStepInline}><strong>Next step:</strong> {result.nextStepLabel}</p>
            </div>
          )}

          {!result.gated && result.recommendation && (
            <>
              <div className={styles.diagnosisBox}>
                <span className={styles.diagnosisLabel}>Likely condition:</span>
                <span className={styles.diagnosisValue}>{result.diagnosis}</span>
                <span className={styles.confidencePill}>{(result.topConfidence * 100).toFixed(1)}% confidence</span>
              </div>

              <div className={styles.recommendation}>
                <div className={styles.recommendationHeader}>
                  <h4>What this means</h4>
                  <span className={`${styles.urgency} ${styles[result.recommendation.urgency]}`}>
                    {result.recommendation.urgency.toUpperCase()} URGENCY
                  </span>
                </div>
                <p className={styles.summary}>{result.recommendation.summary}</p>

                <div className={styles.actionsBox}>
                  <strong>What to look for</strong>
                  <p>{result.recommendation.symptoms}</p>
                </div>
                <div className={styles.actionsBox}>
                  <strong>What you can do</strong>
                  <ul className={styles.actions}>
                    {result.recommendation.selfCare.map((action) => <li key={action}>{action}</li>)}
                  </ul>
                </div>
                <div className={styles.actionsBox}>
                  <strong>When to see someone</strong>
                  <ul className={styles.actions}>
                    {result.recommendation.seeClinicIf.map((action) => <li key={action}>{action}</li>)}
                  </ul>
                </div>
                <div className={styles.nextStepBox}>
                  <span className={styles.nextStepLabel}>Recommended next step</span>
                  <span className={styles.nextStepValue}>{result.nextStepLabel}</span>
                </div>
                <p className={styles.skinToneNote}>Skin tone note: {result.skinToneNote}</p>
              </div>
            </>
          )}

          {result.confidences?.length > 0 && (
            <div className={styles.confidenceSection}>
              <h4>Confidence scores</h4>
              <div className={styles.confidenceList}>
                {result.confidences.map((confidence, index) => {
                  const rawValue = Number(confidence.confidence ?? confidence.score ?? 0)
                  const percentage = rawValue > 1 ? rawValue : rawValue * 100
                  return (
                    <div className={styles.confidenceItem} key={confidence.label || index}>
                      <span className={styles.confidenceLabel}>{confidence.label || 'Result'}</span>
                      <span className={styles.confidenceBar}>
                        <span className={styles.confidenceFill} style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </span>
                      <span className={styles.confidenceValue}>{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <p className={styles.disclaimer}>
            SkinScan provides general information only. It is not a medical diagnosis and does not replace a clinician. Do not delay seeking care because of this result.
          </p>
        </section>
      )}
    </div>
  )
}

export default SkinScanUploader