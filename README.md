# 💕 For You — Romantic Interactive Website

A lovingly crafted romantic surprise website with playful question flow, evasive buttons, and a beautiful celebration finale.

---

## 📁 File Structure

```
Kijim un/
├── index.html        ← HTML entry point (all screens)
├── style.css         ← Full design system & animations
├── app.js            ← Application logic (state, particles, confetti, panel)
└── questions.js      ← ✏️  EDIT YOUR QUESTIONS HERE
```

---

## ✏️ How to Customize

### Change questions & answers
Open **`questions.js`** and edit the `QUESTIONS` array:

```js
const QUESTIONS = [
  {
    question: "Your custom question here?",
    emoji: "🌸",
    options: [
      { label: "Yes! 💕",    type: "positive" },
      { label: "No thanks",  type: "negative" },
    ],
    positiveResponse: "Shown briefly after a positive answer 🥰",
  },
  // … add more questions
];
```

### Change hero / final screen text
Edit the `SITE_CONFIG` object at the top of **`questions.js`**:

```js
const SITE_CONFIG = {
  pageTitle:      "For You 💕",
  heroHeadline:   "Something Special",
  heroSubtitle:   "Just for you …",
  heroButtonText: "Open Your Surprise ✨",
  finalHeadline:  "You made my heart happy 💖",
  finalMessage:   "Every smile of yours is a small miracle.",
  finalCtaText:   "Send a Smile 🌸",
};
```

### Change questions live (in-browser)
Click the **✏️ pencil button** in the bottom-right corner while the site is open to edit all questions without touching any code. Tap **Save** to apply.

### Add a photo
On the hero screen, click **"+ add a photo"** or click the avatar circle to upload a personal photo.

---

## 🎨 Color Palette (to change in `style.css`)

| Variable | Color | Use |
|---|---|---|
| `--clr-primary` | `#e8609a` | Buttons, glows |
| `--clr-accent` | `#c084fc` | Gradients, accents |
| `--clr-gold` | `#f4c542` | Final CTA, celebration |
| `--clr-bg-start` | `#fdf0f7` | Background gradient |

---

## 🚀 How to Run

Simply open `index.html` in any modern browser — no build step needed.

For best results with a local server (avoids browser security restrictions):
```bash
npx serve .
```

---

## ✨ Features

- 🌸 Floating animated hearts background
- 💕 4 customizable romantic questions
- 😈 Evasive "No" button that dodges mouse/touch
- 🎉 Confetti & hearts celebration on completion
- 💌 Personalized final message reveal
- ✏️ In-browser question editor panel
- 📱 Fully mobile-first responsive design
- 🖼️ Photo upload for avatar area
- 🔄 Restart button to replay
