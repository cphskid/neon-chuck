export const CLASSES = [
  {
    id: 'knight',
    name: '勇敢的騎士',
    emoji: '🛡️',
    hp: 12,
    str: 4,
    wis: 2,
    agi: 3,
    desc: '力大無窮，勇氣十足！',
  },
  {
    id: 'mage',
    name: '聰明的法師',
    emoji: '🔮',
    hp: 9,
    str: 2,
    wis: 4,
    agi: 3,
    desc: '知識淵博，善於解謎！',
  },
  {
    id: 'ranger',
    name: '敏捷的精靈',
    emoji: '🏹',
    hp: 10,
    str: 2,
    wis: 3,
    agi: 4,
    desc: '身手矯健，行動飛快！',
  },
  {
    id: 'healer',
    name: '溫柔的治癒師',
    emoji: '💖',
    hp: 11,
    str: 2,
    wis: 4,
    agi: 2,
    desc: '心地善良，人見人愛！',
  },
]

export function getClass(id) {
  return CLASSES.find((c) => c.id === id) || CLASSES[0]
}

export function rollD6() {
  return Math.floor(Math.random() * 6) + 1
}

export const STORY = {
  intro: {
    emoji: '🐲',
    text:
      '你在森林深處的莓果叢裡，聽到一陣嗚咽聲。撥開樹葉一看，是一隻迷路的小龍，牠正抱著尾巴輕輕發抖，看起來離家很遠了。',
    choices: [
      {
        label: '🤗 溫柔地靠近安慰牠',
        type: 'check',
        stat: 'wis',
        difficulty: 5,
        successText: '你輕聲細語地安撫，小龍漸漸停止了哭泣，靠在你身邊蹭了蹭。',
        failText: '小龍被嚇了一跳，往後跳開了幾步，不過還是好奇地看著你。',
        next: 'meet_owl',
      },
      {
        label: '🍓 遞給牠一顆莓果',
        type: 'auto',
        text: '小龍聞了聞莓果，開心地一口吃掉，尾巴也搖了起來！牠似乎把你當成了朋友。',
        score: 1,
        next: 'meet_owl',
      },
    ],
  },
  meet_owl: {
    emoji: '🦉',
    text:
      '你和小龍一起往森林深處走，一隻戴著眼鏡的貓頭鷹落在樹枝上擋住去路：「想過去嗎？先回答我的謎語：什麼東西越洗越髒？」',
    choices: [
      {
        label: '💭 回答「水」',
        type: 'check',
        stat: 'wis',
        difficulty: 6,
        successText: '「答對了！」貓頭鷹眨眨眼，指了一條近路給你，「往小溪那邊走，能省不少時間。」',
        failText: '貓頭鷹笑著搖搖頭：「答錯囉，不過看你這麼認真，還是告訴你近路吧！」',
        next: 'cross_stream',
      },
      {
        label: '😄 請貓頭鷹講個笑話放鬆一下',
        type: 'auto',
        text: '貓頭鷹被逗樂了，講了一個關於松鼠的冷笑話，大家都笑了，小龍也開心地拍著翅膀。',
        score: 1,
        next: 'cross_stream',
      },
    ],
  },
  cross_stream: {
    emoji: '💧',
    text: '前方有一條清澈的小溪擋住去路，水流不算急，但需要一點技巧才能過去。',
    choices: [
      {
        label: '🦘 一鼓作氣跳過去',
        type: 'check',
        stat: 'agi',
        difficulty: 5,
        successText: '你輕巧一跳，穩穩落在對岸，小龍也跟著撲騰著翅膀飛了過來！',
        failText: '你腳下一滑，鞋子沾濕了一點，不過還是順利爬上了對岸。',
        failHp: 1,
        next: 'hungry_squirrel',
      },
      {
        label: '🪨 搬石頭搭一座小橋',
        type: 'check',
        stat: 'str',
        difficulty: 5,
        successText: '你搬來幾塊大石頭，很快搭出一座堅固的小橋，大家安全地走了過去。',
        failText: '石頭有點滑，你搭的橋歪歪扭扭，但總算撐著走了過去。',
        failHp: 1,
        next: 'hungry_squirrel',
      },
    ],
  },
  hungry_squirrel: {
    emoji: '🐿️',
    text: '一隻餓壞了的小松鼠蹲在路邊，眼巴巴地看著你的背包，肚子發出咕嚕咕嚕的聲音。',
    choices: [
      {
        label: '🥜 分一些食物給牠',
        type: 'auto',
        text: '小松鼠開心地捧著堅果啃了起來，還跳到你的肩膀上，說要跟你們一起走一段路。',
        flag: 'squirrelFriend',
        score: 1,
        next: 'troll_bridge',
      },
      {
        label: '🚶 跟牠揮揮手，繼續趕路',
        type: 'auto',
        text: '你摸摸小龍的頭，決定盡快趕路。小松鼠有點失望地看著你們遠去。',
        next: 'troll_bridge',
      },
    ],
  },
  troll_bridge: {
    emoji: '🌉',
    text:
      '終於來到通往山谷的木橋前，橋頭坐著一位巨大但眼神溫和的巨魔，他說：「想過橋嗎？唱首歌給我聽聽吧，我最喜歡音樂了！」',
    choices: [
      {
        label: '🎵 大聲唱一首歡樂的歌',
        type: 'check',
        stat: 'wis',
        difficulty: 6,
        bonusFlag: 'squirrelFriend',
        successText: '巨魔聽得笑呵呵，還跟著打起拍子：「太棒了！歡迎通過！」',
        failText: '你唱得有點跑調，巨魔還是被逗笑了：「雖然跑調，但很有心意，過去吧！」',
        next: 'ending',
      },
      {
        label: '💃 跳一支滑稽的舞',
        type: 'check',
        stat: 'agi',
        difficulty: 6,
        bonusFlag: 'squirrelFriend',
        successText: '你的舞步又酷又逗趣，巨魔拍手叫好，笑著讓開了路。',
        failText: '你跳得東倒西歪，巨魔笑得肚子都疼了，揮手讓你們快點過去。',
        next: 'ending',
      },
    ],
  },
}

export function computeEndingTier(score) {
  if (score >= 5) {
    return { title: '傳奇小冒險家', stars: '🌟🌟🌟' }
  }
  if (score >= 3) {
    return { title: '勇敢的好夥伴', stars: '🌟🌟' }
  }
  return { title: '善良的小幫手', stars: '🌟' }
}
