# Word Masters

A Wordle-style word guessing game built with vanilla HTML, CSS and JavaScript.

## What it does

- Guess the secret 5-letter word in 6 tries.
- Each guess is validated against a public word API before it counts.
- Letters are colored green (right spot), yellow (wrong spot) or gray (not in the word).
- A new random word is fetched every time you load the game.

## Live demo

👉 https://word-masters-beta.vercel.app

## Tech stack

- HTML5
- CSS3
- JavaScript (ES modules, async/await, Fetch API)
- [words.dev-apis.com](https://words.dev-apis.com) for the word of the day and word validation
- Deployed on Vercel

## Run locally

```bash
git clone https://github.com/angel-isasi/word-masters.git
cd word-masters
npx serve .
```

Then open the URL shown in the terminal (usually http://localhost:3000). You can also use the VS Code **Live Server** extension. A local server is needed because `script.js` is loaded as an ES module.
