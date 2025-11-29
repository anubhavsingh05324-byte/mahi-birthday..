// ---------------- SELECT ELEMENTS ----------------
const cake = document.getElementById("cake");
const candle = document.getElementById("candle");
const flame = document.getElementById("flame");
const controls = document.getElementById("controls");
const note = document.getElementById("note");
const showNoteBtn = document.getElementById("showNoteBtn");
const blowBtn = document.getElementById("blowBtn");
const closeNote = document.getElementById("closeNote");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");
const imgBrother = document.getElementById("imgBrother");
const imgSister = document.getElementById("imgSister");

// ---------------- SET FLAME STYLE ----------------
function setFlameStyle() {
  flame.style.background =
    "radial-gradient(circle at 40% 30%, #fff 0%, rgba(255,220,0,0.95) 10%, rgba(255,102,0,0.95) 40%, rgba(200,40,0,0.95) 75%)";
  flame.style.boxShadow = "0 6px 18px rgba(255,110,0,0.35)";
}
setFlameStyle();

// ---------------- DROP ANIMATION ----------------
window.addEventListener("load", () => {
  setTimeout(() => {
    cake.classList.add("drop-animate");
    candle.classList.add("drop-animate");
  }, 500);

  setTimeout(() => {
    controls.classList.remove("hidden");
  }, 1500);
});

// ---------------- NOTE PANEL ----------------
showNoteBtn.addEventListener("click", () => {
  note.classList.remove("hidden");
});

closeNote.addEventListener("click", () => {
  note.classList.add("hidden");
});

// ---------------- BLOW CANDLE ----------------
blowBtn.addEventListener("click", async () => {
  await playPuff();

  flame.style.transition = "transform 600ms ease, opacity 600ms ease";
  flame.style.transform = "translateY(-10px) scale(0.4)";
  flame.style.opacity = "0";

  createSmoke();

  setTimeout(() => {
    screen1.classList.remove("active");
    screen2.classList.add("active");

    imgBrother.classList.add("pop-in");
    imgSister.classList.add("pop-in");

    playHappyBirthday();
  }, 900);
});

// ---------------- SMOKE EFFECT ----------------
function createSmoke() {
  const s = document.createElement("div");
  s.style.position = "absolute";
  s.style.left = "50%";
  s.style.bottom = "58%";
  s.style.width = "14px";
  s.style.height = "14px";
  s.style.borderRadius = "50%";
  s.style.transform = "translateX(-50%)";
  s.style.background =
    "radial-gradient(circle, rgba(200,200,200,0.9) 0%, rgba(200,200,200,0.2) 60%)";
  s.style.opacity = "0.9";
  s.style.pointerEvents = "none";

  document.body.appendChild(s);

  s.animate(
    [
      { transform: "translateY(0) scale(0.6)", opacity: 0.9 },
      { transform: "translateY(-80px) scale(1.6)", opacity: 0 }
    ],
    { duration: 900, easing: "ease-out" }
  ).onfinish = () => s.remove();
}

// ---------------- PUFF SOUND ----------------
async function playPuff() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 300;
    gain.gain.value = 0.15;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 300);
  } catch (e) {
    console.warn("Audio not allowed", e);
  }
}

// ---------------- HAPPY BIRTHDAY MELODY ----------------
function playHappyBirthday() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime;

  const notes = [
    [392, 0.3], [392, 0.3], [440, 0.6], [392, 0.6],
    [523.25, 0.6], [494, 0.9],

    [392, 0.3], [392, 0.3], [440, 0.6], [392, 0.6],
    [587.33, 0.6], [523.25, 0.9],

    [392, 0.3], [392, 0.3], [784, 0.6], [659.25, 0.6],
    [523.25, 0.6], [494, 0.6], [440, 0.9]
  ];

  let t = now + 0.1;

  notes.forEach(([freq, dur]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.value = 0.0001;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    osc.start(t);

    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.stop(t + dur + 0.02);

    t += dur;
  });

  setTimeout(() => ctx.close(), (t - now + 0.5) * 1000);
}
