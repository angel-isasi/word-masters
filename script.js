// Estos son los valores fijos del juego, las mayusculas se presentan por convención para indicar que son constantes 
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


// APIs, una ENVÍA una palabra para validarla (POST), y la otra PIDE la palabra secreta (GET). Ambas devuelven un JSON con la respuesta.
const VALIDATE_URL = "https://words.dev-apis.com/validate-word";
const WORD_URL = "https://words.dev-apis.com/word-of-the-day?random=1";



// Elementos del HTML que se usará. 
const scoreboard = document.querySelector(".scoreboard");
const loadingDiv = document.querySelector(".info-bar");


// Acá es donde se crean las 30 casillas 5x6 y las agrega en el tablero.
for (let i = 0; i < ANSWER_LENGTH * ROUNDS; i++) {
  const div = document.createElement("div");
  div.classList.add("scoreboard-letter");
  scoreboard.appendChild(div);
}


// Acá se guardan las casillas en un array para poder manipularlas más facilmente
const letters = document.querySelectorAll(".scoreboard-letter");


// Variables de estado del juego
let currentGuess = "";
let currentRow = 0;
let word = "";
let isLoading = true;
let done = false;


// Función que activa y desactiva el modo "cargando" del juego, mostrando u ocultando el div de carga.
function setLoading(value) {
  isLoading = value;
  loadingDiv.classList.toggle("hidden", !value);
}


// Pide la palabra secreta a la API y la guarda en MASYÚSCULA
async function getWord() {
  try {
    const res = await fetch(WORD_URL);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);


    // La API respondera el word y un puzzleNumber, pero en este caso solo sacamos el word.
    const { word: wordRes } = await res.json();
    word = wordRes.toUpperCase();
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la palabra 😢");
  } finally {
    setLoading(false);
  }
}


// TRUE si es una letra, FALSE si no lo es. Se usa para validar la entrada del usuario.
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}


// Agrega una letra a la fila actual y la muestra en su casilla.
function addLetter(letter) {
  if (currentGuess.length < ANSWER_LENGTH) {
    currentGuess += letter;  // Verifica si hay espacio y agrega.
  } else {
    currentGuess = currentGuess.slice(0, -1) + letter; // Fila llena, reemplaza la última letra.
  }

  // Convierte "fila + posición" ewn el número de casilla (0 a 29)
  const index = currentRow * ANSWER_LENGTH + currentGuess.length - 1;
  letters[index].textContent = letter;
}


// Borra la ultima letra de la fila actual.
function backspace() {
  if (currentGuess.length === 0) return;

  const index = currentRow * ANSWER_LENGTH + currentGuess.length - 1;
  letters[index].textContent = "";
  currentGuess = currentGuess.slice(0, -1);
}


// Cuenta cuantas veces aparece cada letra.
function makeMap(array) {
  const obj = {};
  for (const letter of array) {
    obj[letter] = (obj[letter] || 0) + 1;
  }
  return obj;
}


// Hace parpadear en rojo la fila actual, para indicar que la palabra ingresada no es válida.
function markInvalidWord() {
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    const box = letters[currentRow * ANSWER_LENGTH + i];
    box.classList.remove("invalid");
    setTimeout(() => box.classList.add("invalid"), 10);
  }
}


async function commit() {
  if (currentGuess.length !== ANSWER_LENGTH) return;

  setLoading(true);
  const res = await fetch(VALIDATE_URL, {
    method: "POST",
    body: JSON.stringify({ word: currentGuess }),
  });
  const { validWord } = await res.json();
  setLoading(false);

  if (!validWord) {
    markInvalidWord();
    return;
  }


  // Pintar colores
  const guessParts = currentGuess.split("");
  const wordParts = word.split("");
  const map = makeMap(wordParts);

  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (guessParts[i] === wordParts[i]) {
      letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
      map[guessParts[i]]--;
    }
  }

  for (let i = 0; i < ANSWER_LENGTH; i++) {
    const box = letters[currentRow * ANSWER_LENGTH + i];

    if (guessParts[i] === wordParts[i]) {
      continue; // ya es verde
    } else if (map[guessParts[i]] > 0) {
      box.classList.add("close");
      map[guessParts[i]]--;
    } else {
      box.classList.add("wrong");
    }
  }


  // Pasar a la siguiente fila y revisa si terminó.
  currentRow++;

  if (currentGuess === word) {
  document.querySelector(".brand").classList.add("winner");
  done = true;
  return; // Título arcoíris.
  }

  if (currentRow === ROUNDS) {
    alert(`Perdiste 😢 La palabra era ${word}`);
    done = true;
    return;
  }

  currentGuess = ""; // Fila nueva, empieza vacía.
}


// Cada tecla decide qué hacer
document.addEventListener("keydown", (e) => {
  if (isLoading || done) return;

  const key = e.key;

  if (key === "Enter") {
    commit();
  } else if (key === "Backspace") {
    backspace();
  } else if (isLetter(key)) {
    addLetter(key.toUpperCase());
  }

  // Cualquier otra tecla se ignora, no hace nada.
});


// Arranca el juego pidiendo la palabra
getWord();