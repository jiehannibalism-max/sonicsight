import type { Audience, DimensionKey } from '@/types'

// ============================================================
// 目标音素(评估流程 Step 1 的大卡片)
// ============================================================
export interface PhonemeMeta {
  id: string // 不带声调,对齐后端 target_phoneme
  pinyin: string // 带声调的展示拼音
  initial: string
  final: string
  emoji: string
  tip: string // 发音提示
}

export const PHONEMES: PhonemeMeta[] = [
  { id: 'ma', pinyin: 'mā', initial: 'm', final: 'a', emoji: '🐴', tip: '双唇紧闭，气流从鼻腔送出' },
  { id: 'ba', pinyin: 'bā', initial: 'b', final: 'a', emoji: '🍃', tip: '双唇紧闭后突然张开，不送气' },
  { id: 'da', pinyin: 'dā', initial: 'd', final: 'a', emoji: '🥁', tip: '舌尖抵上齿龈，轻爆破不送气' },
  { id: 'ta', pinyin: 'tā', initial: 't', final: 'a', emoji: '💨', tip: '舌尖抵上齿龈，送气爆破' },
  { id: 'ge', pinyin: 'gē', initial: 'g', final: 'e', emoji: '🎵', tip: '舌根抵软腭，不送气' },
]

// ============================================================
// Audience(评估流程 Step 2 的选择卡)
// ============================================================
export interface AudienceMeta {
  id: Audience
  label: string
  emoji: string
  tagline: string
  desc: string
}

export const AUDIENCES: AudienceMeta[] = [
  {
    id: 'parent',
    label: '家长',
    emoji: '👨‍👩‍👧',
    tagline: '温暖陪伴',
    desc: '温暖鼓励的反馈，告诉你孩子练得怎么样、在家怎么帮他练。',
  },
  {
    id: 'teacher',
    label: '老师',
    emoji: '🧑‍🏫',
    tagline: '专业精准',
    desc: '专业详细的诊断报告，量化指标 + 针对性教学建议。',
  },
  {
    id: 'child',
    label: '孩子',
    emoji: '🧒',
    tagline: '趣味闯关',
    desc: '简单有趣的小任务，像玩游戏一样开口练发音。',
  },
]

export const AUDIENCE_MAP: Record<Audience, AudienceMeta> = Object.fromEntries(
  AUDIENCES.map((a) => [a.id, a]),
) as Record<Audience, AudienceMeta>

// ============================================================
// 5 个评估维度(结果页雷达图 + 维度卡)
// lucide 图标名,渲染时按需 import
// ============================================================
export interface DimensionMeta {
  key: DimensionKey
  name: string // 全称
  short: string // 雷达图轴标签
  icon: string // lucide 图标名
  desc: string // 这个维度衡量什么
  method: string // 算法(来自 metadata)
}

export const DIMENSIONS: DimensionMeta[] = [
  { key: 'lip_shape', name: '唇形准确度', short: '唇形', icon: 'Smile', desc: '嘴唇张合幅度与圆扁形状是否贴近标准发音。', method: 'DTW 轨迹比对' },
  { key: 'acoustic', name: '声学相似度', short: '声学', icon: 'AudioLines', desc: '声母、韵母、声调是否与标准发音一致。', method: '拼音匹配' },
  { key: 'duration', name: '时长合规性', short: '时长', icon: 'Timer', desc: '音素发音的长短是否在合理范围内。', method: '时长比' },
  { key: 'airflow', name: '气流强度', short: '气流', icon: 'Wind', desc: '送气力度是否合适,太弱或太强都会扣分。', method: 'RMS 能量比' },
  { key: 'nasalization', name: '鼻音化检测', short: '鼻音', icon: 'Waves', desc: '是否出现不该有的鼻腔共鸣(鼻音化)。', method: '频段能量比' },
]

export const DIMENSION_MAP: Record<DimensionKey, DimensionMeta> =
  Object.fromEntries(DIMENSIONS.map((d) => [d.key, d])) as Record<
    DimensionKey,
    DimensionMeta
  >

export const DIMENSION_ORDER: DimensionKey[] = DIMENSIONS.map((d) => d.key)

// 分数分级(0~1)
export const WEAK_THRESHOLD = 0.6
export const GOOD_THRESHOLD = 0.8

export function scoreLevel(score: number): 'good' | 'mid' | 'weak' {
  if (score >= GOOD_THRESHOLD) return 'good'
  if (score >= WEAK_THRESHOLD) return 'mid'
  return 'weak'
}
