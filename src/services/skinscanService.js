// SkinScan API Service - Using @gradio/client
import { Client } from '@gradio/client'
import skinData from '../data/skinRecommendations.json'

const SPACE_NAME = 'Vernard/scin-skin-classifier'

let client = null

// Initialize the client (singleton pattern)
async function getClient() {
  if (!client) {
    try {
      client = await Client.connect(SPACE_NAME)
    } catch (error) {
      console.error('Failed to connect to SkinScan API:', error)
      throw new Error('Could not connect to SkinScan API. Please try again later.')
    }
  }
  return client
}

// Predict skin condition from an image File
export async function predictSkinCondition(imageFile) {
  try {
    const client = await getClient()
    
    // The API expects the image as a File object
    const result = await client.predict('/predict', {
      image: imageFile
    })
    
    // Parse the response - the structure might be nested
    let predictionData = result.data
    
    // Sometimes the result is nested differently
    if (result.data && Array.isArray(result.data)) {
      predictionData = result.data[0]
    }
    
    return {
      diagnosis: predictionData.label || predictionData,
      confidences: predictionData.confidences || [],
      timestamp: new Date().toISOString(),
      raw: result
    }
  } catch (error) {
    console.error('SkinScan API error:', error)
    throw new Error(error.message || 'Failed to analyze image. Please try again.')
  }
}

function getConfidenceValue(confidence) {
  const value = Number(confidence?.confidence ?? confidence?.score ?? 0)
  return value > 1 ? value / 100 : value
}

function findCondition(diagnosis) {
  const diagnosisText = String(diagnosis || '').trim().toLowerCase()
  const conditionKey = Object.keys(skinData.conditions).find(
    (key) => key.toLowerCase() === diagnosisText,
  )
  return conditionKey ? skinData.conditions[conditionKey] : null
}

export function enrichSkinPrediction(prediction, redFlagResult) {
  const { diagnosis, confidences = [] } = prediction
  const topConfidence = getConfidenceValue(confidences[0])

  if (redFlagResult?.hasRedFlag) {
    return {
      ...prediction,
      topConfidence,
      recommendation: null,
      gated: true,
      gateReason: 'red-flag',
      gateMessage: redFlagResult.redFlagMessage,
      nextStep: 'urgent',
      nextStepLabel: skinData.nextStepLabels.urgent,
    }
  }

  if (topConfidence > 0 && topConfidence < 0.5) {
    return {
      ...prediction,
      topConfidence,
      recommendation: null,
      gated: true,
      gateReason: 'low-confidence',
      gateMessage: 'The model is not confident about this result. Try a clearer, well-lit close-up photo, or see a clinician if you are concerned.',
      nextStep: 'see-clinic',
      nextStepLabel: skinData.nextStepLabels['see-clinic'],
    }
  }

  const condition = findCondition(diagnosis)
  if (!condition) {
    return {
      ...prediction,
      topConfidence,
      recommendation: null,
      gated: true,
      gateReason: 'unknown-condition',
      gateMessage: 'We could not match this image to a condition SkinScan currently recognises. Please see a clinician if you are concerned.',
      nextStep: 'see-clinic',
      nextStepLabel: skinData.nextStepLabels['see-clinic'],
    }
  }

  const nextStep = typeof condition.nextStep === 'string'
    ? condition.nextStep
    : condition.nextStep.moderate

  return {
    ...prediction,
    topConfidence,
    recommendation: condition,
    gated: false,
    gateReason: null,
    gateMessage: null,
    nextStep,
    nextStepLabel: skinData.nextStepLabels[nextStep] || 'See a clinician',
    skinToneNote: skinData._meta.skinToneNote,
  }
}

// Get health status
export async function getHealthStatus() {
  try {
    await getClient()
    return { status: 'healthy', space: SPACE_NAME }
  } catch (error) {
    return { status: 'unhealthy', error: error.message }
  }
}
