const emojiArray = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
  "🙂", "🙃", "🫠", "😉", "😇", "🥰", "😍", "🤩",
  "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😈",
  "💀", "🤠", "💩", "🤡", "👹", "👺", "👻", "👽",
  "👾", "🤖", "🐴", "😸", "🐵", "🐒", "🦍", "🦧",
  "🐶", "🐯", "🦁", "🐩", "🐺", "🦊", "🦝", "👜",
  "🦄", "🦓", "🦌", "🦬", "🐮", "🐂", "🐃", "🐄",
  "🐷", "🎓", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪",
  "🐻", "🐨", "🐼", "🐧", "🐸", "🐊", "🐢", "🐲",
  "🪴", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "🍀",
  "🍁", "🍂", "🍃", "🪹", "🍇", "🍈", "🍉", "🍊",
  "🍋", "🍌", "🍍", "🥭", "🍎", "🎩", "🍐", "🍑",
  "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑",
  "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬",
  "🥦", "🧄", "🧅", "🍄", "🥜", "🫘", "🌰", "🍞",
  "🧀", "🍔", "🍟", "🍕", "🍘", "🍙", "🍚", "🍜",
  "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡",
  "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨",
  "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵",
  "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🪨", "🪵", "🛖",
  "🏘️", "🥤", "🧉", "🥢", "🏢", "🏣", "🏤", "🏥",
  "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯",
  "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍",
  "⛩️", "🕋", "⛲", "⛺", "🌁", "🎃", "🎄", "🎆",
  "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋", "🎍",
  "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️",
  "🎟️", "🎖️", "🏆", "🏅", "⚽", "🥎", "🏀", "🏉",
  "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸",
  "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽",
  "🎿", "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👘",
  "🩱", "🩲", "🩳", "👙", "👚", "👛", "👑", "👝",
  "🪖", "⛑️", "💄", "💎", "🔇", "📣", "📯", "🏁",
];

const emojiBackref: { [key: string]: number } = emojiArray.reduce<{ [key: string]: number }>((pre, cur, idx) => {
  pre[cur] = idx
  return pre
}, {})

const DEFAULT_KEY = "hello, world!"
const SALT_LEN = 16

export async function encrypt(plaintext: string, password: string = DEFAULT_KEY) {
  const salt = generateSalt()
  const key = await generateKey(password, salt)
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    str2ab(plaintext)
  )

  const result = new Uint8Array(SALT_LEN + iv.length + ciphertext.byteLength)
  result.set(salt)
  result.set(iv, SALT_LEN)
  result.set(new Uint8Array(ciphertext), SALT_LEN + iv.length)

  return Array.from(result).map(byte => emojiArray[byte]).join('')
}

export async function decrypt(emojiString: string, password: string = DEFAULT_KEY) {
  const seg = new Intl.Segmenter('en', { granularity: "grapheme" });
  const data = new Uint8Array(
    [...seg.segment(emojiString)].map(grapheme => emojiBackref[grapheme.segment])
  )

  const salt = data.slice(0, SALT_LEN)
  const iv = data.slice(SALT_LEN, SALT_LEN + 12)
  const encryptedData = data.slice(SALT_LEN + 12)

  const key = await generateKey(password, salt)

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encryptedData
  )

  return ab2str(decrypted)
}

async function generateKey(password: string, salt: Uint8Array) {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    str2ab(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  )

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

function generateSalt(length = SALT_LEN) {
  return window.crypto.getRandomValues(new Uint8Array(length))
}

function str2ab(str: string) {
    const encoder = new TextEncoder()
    return encoder.encode(str)
}

function ab2str(buf: ArrayBuffer) {
    const decoder = new TextDecoder()
    return decoder.decode(buf)
}
