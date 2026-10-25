import React, { useState } from 'react'
import skinData from '../../data/skinRecommendations.json'
import styles from './RedFlagCheck.module.css'

function RedFlagCheck({ onComplete, onEmergency }) {
  const { emergency, urgent } = skinData.redFlags
  const allFlags = [...emergency, ...urgent]
  const [answers, setAnswers] = useState({})
  const [showPanel, setShowPanel] = useState(false)

  function handleAnswer(id, value) {
    setAnswers((previous) => ({ ...previous, [id]: value }))
  }

  function handleSubmit() {
    const emergencyHit = emergency.find((flag) => answers[flag.id] === true)
    if (emergencyHit) {
      onEmergency?.(emergencyHit.message)
      return
    }

    const urgentHit = urgent.find((flag) => answers[flag.id] === true)
    onComplete?.({
      hasRedFlag: Boolean(urgentHit),
      redFlagMessage: urgentHit?.message || null,
      redFlagId: urgentHit?.id || null,
    })
  }

  const allAnswered = allFlags.every((flag) => answers[flag.id] !== undefined)

  if (!showPanel) {
    return (
      <div className={styles.promptCard}>
        <h3>Before we show your result</h3>
        <p>A few quick questions help us flag anything that needs urgent care. This takes about 30 seconds.</p>
        <button className={styles.startBtn} type="button" onClick={() => setShowPanel(true)}>
          Answer safety questions <span aria-hidden="true">→</span>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <h3>Safety check</h3>
      <p className={styles.intro}>
        These questions do not affect the AI result. They make sure nothing urgent is missed.
      </p>

      <div className={styles.questions}>
        {allFlags.map((flag) => (
          <div key={flag.id} className={styles.questionRow}>
            <p className={styles.questionText}>{flag.question}</p>
            <div className={styles.answerGroup}>
              <button
                type="button"
                className={`${styles.answerBtn} ${answers[flag.id] === true ? styles.yes : ''}`}
                onClick={() => handleAnswer(flag.id, true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`${styles.answerBtn} ${answers[flag.id] === false ? styles.no : ''}`}
                onClick={() => handleAnswer(flag.id, false)}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} type="button" onClick={handleSubmit} disabled={!allAnswered}>
        {allAnswered ? 'Continue' : 'Answer all questions to continue'}
        {allAnswered && <span aria-hidden="true"> →</span>}
      </button>

      <p className={styles.footnote}>
        If you are unsure about any answer, choose Yes. It is safer to be assessed.
      </p>
    </div>
  )
}

export default RedFlagCheck
