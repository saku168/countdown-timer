const display = document.querySelector("#display");
const minutesInput = document.querySelector("#minutes");
const status = document.querySelector("#status");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");

let remainingMs = 5 * 60 * 1000;
let endTime = null;
let intervalId = null;

function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function render() {
  if (display) display.textContent = formatTime(remainingMs);
}

function stopTimer() {
  if (intervalId !== null) clearInterval(intervalId);
  intervalId = null;
  endTime = null;
}

function tick() {
  remainingMs = Math.max(0, endTime - Date.now());
  render();
  if (remainingMs === 0) {
    stopTimer();
    if (status) status.textContent = "Time is up!";
  }
}

function getDuration() {
  const value = Number(minutesInput?.value);
  return Math.min(180, Math.max(1, Number.isFinite(value) ? value : 5)) * 60 * 1000;
}

startButton?.addEventListener("click", () => {
  if (intervalId !== null) return;
  if (remainingMs <= 0) remainingMs = getDuration();
  endTime = Date.now() + remainingMs;
  if (status) status.textContent = "Running…";
  tick();
  intervalId = setInterval(tick, 250);
});

pauseButton?.addEventListener("click", () => {
  if (intervalId !== null) {
    remainingMs = Math.max(0, endTime - Date.now());
    stopTimer();
    render();
  }
  if (status) status.textContent = remainingMs === 0 ? "Time is up!" : "Paused";
});

resetButton?.addEventListener("click", () => {
  stopTimer();
  remainingMs = getDuration();
  render();
  if (status) status.textContent = "Ready to start";
});

minutesInput?.addEventListener("change", () => {
  stopTimer();
  remainingMs = getDuration();
  render();
  if (status) status.textContent = "Duration updated";
});

render();