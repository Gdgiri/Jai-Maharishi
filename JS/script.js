const asanas = [
  {
    name: "Massage Rolling",
    img: "https://github.com/user-attachments/assets/50b534bb-558a-44de-9042-76276cf64c47",
  },
  {
    name: "Massage Rolling left and right",
    img: "https://github.com/user-attachments/assets/0f7e817b-032e-476e-b787-032196138dfc",
  },
  {
    name: "Vajrasana",
    img: "https://github.com/user-attachments/assets/1945d2d1-3be6-4f8e-97ec-cab804709a9a",
  },
  {
    name: "Namaskarasana",
    img: "https://github.com/user-attachments/assets/b9d81c85-250d-43db-880c-68b2aba9d6c2",
  },
  {
    name: "Vajmuthrasanam",
    img: "https://github.com/user-attachments/assets/b0caaeb5-be97-4455-9b95-018bd3059844",
  },
  {
    name: "jaanusiraasanam Left",
    img: "https://github.com/user-attachments/assets/bdedd1d4-2ce8-4916-9235-f6edd1962509",
  },
  {
    name: "jaanusiraasanam Right",
    img: "https://github.com/user-attachments/assets/bdedd1d4-2ce8-4916-9235-f6edd1962509",
  },
  {
    name: "Hartha halasanam",
    img: "https://github.com/user-attachments/assets/7b9e5444-25c0-4ff1-bcfb-26e2c7c96680",
  },
  {
    name: "Hartha sakrasanam",
    img: "https://github.com/user-attachments/assets/462456b3-471f-43a6-b901-43fb9570f56f",
  },
  {
    name: "Navasanam",
    img: "https://github.com/user-attachments/assets/d76ff014-b4c2-4a3b-a68f-6b63b7275117",
  },
  {
    name: "padakaasanam",
    img: "https://github.com/user-attachments/assets/7b005d25-5396-43fb-b48d-c25d9cbe3940",
  },
  {
    name: "Artha machendra left",
    img: "https://github.com/user-attachments/assets/71ca03f6-4a12-4746-9845-5a5e59d1503d",
  },
  {
    name: "Artha machendra Right",
    img: "https://github.com/user-attachments/assets/71ca03f6-4a12-4746-9845-5a5e59d1503d",
  },
  {
    name: "Santhi Aasana",
    img: "https://github.com/user-attachments/assets/ea583a57-2a89-4dda-b1b1-e695cb9784d9",
  },
];

let currentIndex = 0;
let timer = 20; // Starting timer
let isResting = false;
let interval = null;

const asanaNameEl = document.getElementById("asanaName");
const asanaImageEl = document.getElementById("asanaImage");
const timerDisplayEl = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");

let wakeLock = null;
const tickSound = new Audio("timmer.mp3"); // Ensure you have this sound file

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Screen wake lock is active");
  } catch (err) {
    console.error("Failed to acquire wake lock", err);
  }
}

async function releaseWakeLock() {
  if (wakeLock !== null) {
    await wakeLock.release();
    wakeLock = null;
    console.log("Screen wake lock is released");
  }
}

function updateUI() {
  const currentAsana = asanas[currentIndex];
  asanaNameEl.textContent = currentAsana.name;
  asanaImageEl.src = currentAsana.img;
  asanaImageEl.style.display = "block"; // Ensure the image is visible

  // Speak the asana name and instruction
  speakText(`${currentAsana.name}`);
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1; // Speed of speech
  utterance.pitch = 1; // Pitch of speech
  speechSynthesis.speak(utterance);
}

const noRestAsanas = ["jaanusiraasanam Left", "Artha machendra left"]; // Asanas without rest

function startTimer() {
  interval = setInterval(() => {
    timerDisplayEl.textContent = timer;
    timer--;

    if (timer < 0) {
      clearInterval(interval);

      if (isResting) {
        // End rest, move to next asana
        currentIndex++;
        if (currentIndex < asanas.length) {
          timer = 20;
          isResting = false;
          stopTickSound(); // Stop the ticking sound when rest ends
          updateUI();
          startTimer();
        } else {
          endSession();
        }
      } else {
        const currentAsana = asanas[currentIndex];

        // Check if the current asana is in the noRestAsanas array
        if (noRestAsanas.includes(currentAsana.name)) {
          // Skip rest for this asana and go to next asana directly
          currentIndex++;
          if (currentIndex < asanas.length) {
            timer = 20;
            updateUI();
            startTimer();
          } else {
            endSession();
          }
        } else {
          // Rest phase
          speakText("Jai Maharishi. Please rest for 30 seconds.");
          timerDisplayEl.textContent = "Jai Maharishi, please rest!";
          asanaNameEl.textContent = "Rest Phase";
          asanaImageEl.style.display = "none"; // Hide the image during rest
          timer = 30;
          isResting = true;
          startTickSound(); // Start the ticking sound during rest
          startTimer();
        }
      }
    }
  }, 1000);
}

function startTickSound() {
  tickSound.loop = true; // Loop the sound
  tickSound.play();
}

function stopTickSound() {
  tickSound.loop = false; // Stop the loop
  tickSound.pause();
  tickSound.currentTime = 0; // Reset the sound
}

function endSession() {
  releaseWakeLock(); // Release the wake lock
  asanaNameEl.textContent = "Session Complete!";
  timerDisplayEl.textContent = "";
  asanaImageEl.style.display = "none";
  stopTickSound(); // Stop the ticking sound when session ends
  speakText("Session complete. Well done!");
}

startBtn.addEventListener("click", () => {
  startBtn.disabled = true; // Disable button after starting
  updateUI();
  requestWakeLock(); // Prevent screen sleep
  startTimer();
});
