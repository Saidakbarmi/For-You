/**
 * ============================================================
 *  FOR YOU — Question Configuration
 *  Edit your questions and answers right here.
 *  Each question follows the shape:
 *  {
 *    question : string          — the question text
 *    emoji    : string          — decorative emoji shown above the question
 *    options  : [               — answer options array
 *      { label: string, type: "positive" | "negative" | "neutral" }
 *    ]
 *    positiveResponse : string  — shown briefly after a positive pick
 *  }
 * ============================================================
 */

const SITE_CONFIG = {
  /** Title shown in the browser tab */
  pageTitle: "For You 💕",

  /** Hero screen */
  heroHeadline: "Kijim uchun ❤️",
  heroSubtitle: "Senga birnechta savolarim bor ",
  heroButtonText: "Savollarni ko'rish uchun bos ✨",

  /** Final screen */
  finalHeadline: "Seni Judayam Yaxshi Ko'raman ❤️",
  finalMessage:
    "Kijim Savolarimga javob berganing va borligin uchun rahmat 💖",
  finalCtaText: "Chatga Qaytish uchun bos",

  /** URL opened when the final CTA button is clicked.
   *  Change this to your own Telegram chat / channel link. */
  finalCtaUrl: "https://t.me/abdujabborvvvv",

  /** Progress bar label format  e.g. "1 / 4" */
  progressFormat: (current, total) => `${current} / ${total}`,
};

const QUESTIONS = [
  {
    question: "Balki Biror kun Korisharmiz vaqting bormi ?",
    emoji: "🌸",
    options: [
      { label: "Ha", type: "positive" },
      { label: "Yo'q", type: "negative" },
    ],
    positiveResponse: "Vaqting Borligidan Hursandman 😂",
  },
  {
    question: "Vaqtim yoq deb bahona qilmaysan faqat hopmi",
    emoji: "✨",
    options: [
      { label: " Hop mayli 😊 ", type: "positive" },
      { label: "qilaman vaqtim yoq 😠", type: "negative" },
    ],
    positiveResponse: "Vaqting bormi korishamizmi deganimda yo dsen qara lekin 😂",
  },
  {
    question: "Ertaga vaqting bormi telefonda gaplashishga ? (Axir sogindim de 😅)",
    emoji: "🦋",
    options: [
      { label: "Ha albatta bor 😊", type: "positive" },
      { label: "Yo'q 😑", type: "negative" },
    ],
    positiveResponse: "Ertaga tel qlaman unda 😊",
  },
  {
    question: "Savolarim senga yoqdimi 😂",
    emoji: "💖",
    options: [
      { label: "Ha albatta yoqdi 😊", type: "positive" },
      { label: "Yoqmadi 😠", type: "negative" },
    ],
    positiveResponse: "Savolarimga Ha deb javob berganing uchun rahmat 😂",
  },
];
