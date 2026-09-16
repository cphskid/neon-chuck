import { WORDS, SENTENCE_TEMPLATES } from './words'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickOtherWords(word, count) {
  const pool = WORDS.filter((w) => w.word !== word.word)
  return shuffle(pool).slice(0, count)
}

const QUESTION_TYPES = ['letter', 'picture', 'fillblank', 'listening']

export function generateQuestion() {
  const type = pick(QUESTION_TYPES)
  const word = pick(WORDS)
  const distractors = pickOtherWords(word, 3)

  if (type === 'letter') {
    const options = shuffle([
      { label: word.letter, correct: true },
      ...distractors.map((w) => ({ label: w.letter, correct: false })),
    ])
    return {
      type,
      title: '這個是哪個字母開頭？',
      promptEmoji: word.emoji,
      options,
    }
  }

  if (type === 'picture') {
    const options = shuffle([
      { label: word.word, correct: true },
      ...distractors.map((w) => ({ label: w.word, correct: false })),
    ])
    return {
      type,
      title: '這是什麼？',
      promptEmoji: word.emoji,
      options,
    }
  }

  if (type === 'fillblank') {
    const sentence = pick(SENTENCE_TEMPLATES)
    const options = shuffle([
      { label: word.word, correct: true },
      ...distractors.map((w) => ({ label: w.word, correct: false })),
    ])
    return {
      type,
      title: sentence,
      promptEmoji: null,
      options,
    }
  }

  // listening
  const options = shuffle([
    { label: word.emoji, correct: true },
    ...distractors.map((w) => ({ label: w.emoji, correct: false })),
  ])
  return {
    type,
    title: '仔細聽，是哪一個？',
    promptEmoji: '🔊',
    speak: word.word,
    options,
  }
}
