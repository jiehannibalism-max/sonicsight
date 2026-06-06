// ============================================================
// SonicSight domain types
// Mirrors the Python contract of evaluate_pronunciation() (Y5)
// and the /api/v1/agent (Coze workflow) response.
// ============================================================

export type Audience = 'parent' | 'teacher' | 'child'

export type DimensionKey =
  | 'lip_shape'
  | 'acoustic'
  | 'duration'
  | 'airflow'
  | 'nasalization'

// --- /api/v1/evaluate  (mirrors evaluate_pronunciation) ---

export interface Scores {
  lip_shape: number // all 0~1
  acoustic: number
  duration: number
  airflow: number
  nasalization: number
  overall: number
}

export interface EvaluationResult {
  target_phoneme: string
  recognized_phoneme: string | null
  scores: Scores | null // null when target not recognized
  weak_dimensions: DimensionKey[]
  diagnosis_raw: string
  metadata: Record<string, string>
}

// --- /api/v1/agent  (Coze workflow output contract) ---

export interface TrainingAction {
  id: string
  title: string
  summary: string
  duration: string
  steps: string[]
}

export interface AgentResult {
  audience: Audience
  summary: string
  diagnosis: {
    title: string
    body: string
    highlights: string[]
  }
  training_plan: {
    title: string
    actions: TrainingAction[]
  }
}

// --- upload ---

export interface UploadResult {
  video_id: string
}
