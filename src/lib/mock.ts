import type { Audience, AgentResult, EvaluationResult } from '@/types'

// ============================================================
// Mock 评分结果 —— 严格对齐 evaluate_pronunciation() 输出
// 设计成"一个明显薄弱轴(气流)+ 其余良好",让雷达图形状有看点、
// 诊断有重点。所有分数 0~1。
// ============================================================
export const MOCK_EVALUATION: EvaluationResult = {
  target_phoneme: 'ma',
  recognized_phoneme: 'ma',
  scores: {
    lip_shape: 0.82,
    acoustic: 0.8,
    duration: 0.65,
    airflow: 0.45,
    nasalization: 0.88,
    overall: 0.72,
  },
  weak_dimensions: ['airflow'],
  diagnosis_raw: '气流偏弱或异常',
  metadata: {
    lip_shape_method: 'DTW',
    acoustic_method: 'initial+final+tone match',
    duration_method: 'duration_ratio',
    airflow_method: 'RMS_ratio_simplified',
    nasalization_method: 'freq_band_ratio_simplified',
  },
}

// ============================================================
// Mock Agent 输出 —— 三种 audience 三种语气
// (对齐 /api/v1/agent 契约;Step 5 接真 Coze 后端做适配层)
// ============================================================
export const MOCK_AGENTS: Record<Audience, AgentResult> = {
  parent: {
    audience: 'parent',
    summary:
      '孩子的「ma」发音整体不错，72 分！嘴型和声音都挺准，主要是送气的力度还差一点。在家陪他练几天，很快就能上来。',
    diagnosis: {
      title: '给家长的发音诊断',
      body: '孩子念「ma」时，嘴唇的开合和形状控制得很好，声音也清晰、能准确听出是「ma」。目前唯一需要重点关注的是“送气力度”——发音时从嘴里呼出的气流偏弱了一些。这个在家用一些小游戏就能练，不用紧张。',
      highlights: ['嘴型到位，控制得很好', '声音清晰，发音准确', '送气偏弱 —— 这是接下来主要练的地方'],
    },
    training_plan: {
      title: '在家陪练计划',
      actions: [
        {
          id: 'p1',
          title: '吹纸条小游戏',
          summary: '用一张纸条，让孩子在发音时把气“吹”出来',
          duration: '每天 5 分钟',
          steps: ['把一张细纸条放在孩子嘴前约 10 厘米', '让他发「ma」，同时让纸条明显飘动', '飘得越久越好，每天玩 10 次'],
        },
        {
          id: 'p2',
          title: '吹蜡烛 / 吹泡泡',
          summary: '用孩子喜欢的方式练习呼气控制',
          duration: '每天 3 分钟',
          steps: ['准备蜡烛或泡泡水', '深吸一口气，缓慢均匀地吹', '配合发「ma」的口型一起做'],
        },
        {
          id: 'p3',
          title: '亲子跟读',
          summary: '和孩子一起对着镜子念，互相鼓励',
          duration: '每天 5 分钟',
          steps: ['和孩子并排坐在镜子前', '一起念「mā—」，把音拉长', '念对了就击掌鼓励一下'],
        },
      ],
    },
  },
  teacher: {
    audience: 'teacher',
    summary:
      '学生「ma」综合得分 0.72。唇形(0.82)与声学(0.80)表现良好，时长(0.65)处于合格区间，气流强度(0.45)显著偏弱，建议安排送气专项训练。',
    diagnosis: {
      title: '发音诊断报告',
      body: '基于视觉通道(唇形几何 DTW)与听觉通道(拼音匹配 + 音频能量)的多维评估：学生唇部开合与圆扁度轨迹与标准基线高度吻合，声母/韵母识别正确、声调存在轻微偏差。气流强度维度 RMS 能量比仅 0.45，提示送气不足，是当前主要短板。建议以送气控制为核心开展 1–2 周专项干预后复测。',
      highlights: ['唇形准确度 0.82 — 口型控制达标', '声学相似度 0.80 — 声调略有偏差', '气流强度 0.45 — 显著偏弱,优先干预', '鼻音化 0.88 — 无异常鼻腔共鸣'],
    },
    training_plan: {
      title: '专项训练方案',
      actions: [
        {
          id: 't1',
          title: '送气强度训练',
          summary: '通过纸条位移量化送气力度反馈',
          duration: '每次 10 分钟 / 每日 1 次',
          steps: ['学生口前 10cm 悬挂标准纸条', '发音时记录纸条偏移角度作为反馈', '逐日提高目标偏移量,建立送气强度梯度'],
        },
        {
          id: 't2',
          title: '声调矫正',
          summary: '针对声调偏差进行听辨与模仿',
          duration: '每次 8 分钟 / 每日 1 次',
          steps: ['播放标准「mā」一声示范音', '学生听辨并模仿,教师标注音高曲线', '对比可视化音高,逐步收敛偏差'],
        },
        {
          id: 't3',
          title: '复测与记录',
          summary: '建立纵向训练档案',
          duration: '每周 1 次',
          steps: ['每周用本系统复测同一音素', '记录五维分数趋势', '依据气流维度变化调整训练强度'],
        },
      ],
    },
  },
  child: {
    audience: 'child',
    summary: '太棒啦！你的「ma」已经 72 分啦 🎉 嘴巴张得超好看！我们再来练一个“吹气小魔法”，很快就能拿满分！',
    diagnosis: {
      title: '你的发音小报告',
      body: '哇，你念「ma」的时候嘴巴张得又圆又好看，声音也很清楚！只有一个小秘密要告诉你——发音的时候，要记得把气“呼”出来一点点，像吹小风一样。我们一起来练这个魔法好不好？',
      highlights: ['👄 嘴型超棒！', '🔊 声音很清楚！', '💨 再多吹一点点气就完美啦！'],
    },
    training_plan: {
      title: '发音闯关小任务',
      actions: [
        {
          id: 'c1',
          title: '🎐 吹纸条大挑战',
          summary: '让小纸条飞起来！',
          duration: '玩 5 分钟',
          steps: ['拿一张小纸条放在嘴巴前面', '大声念「ma」，把纸条吹得飘起来', '看看能飘多久,挑战 10 次！'],
        },
        {
          id: 'c2',
          title: '🫧 吹泡泡魔法',
          summary: '用呼吸吹出大泡泡',
          duration: '玩 3 分钟',
          steps: ['深深吸一口气', '慢慢地、稳稳地吹出泡泡', '一边吹一边做「ma」的嘴型'],
        },
        {
          id: 'c3',
          title: '🪞 镜子模仿秀',
          summary: '对着镜子和爸爸妈妈一起念',
          duration: '玩 5 分钟',
          steps: ['坐在镜子前面', '一起念长长的「mā——」', '念对啦就和爸爸妈妈击个掌！'],
        },
      ],
    },
  },
}

export function getMockAgent(audience: Audience): AgentResult {
  return MOCK_AGENTS[audience]
}
