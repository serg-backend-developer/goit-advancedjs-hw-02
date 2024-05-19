const startDate = document.querySelector('[data-start]');
const stopDate = document.querySelector('[data-stop]');
const body = document.body;

let intervalId;

startDate.addEventListener('click', colorSwitch);
stopDate.addEventListener('click', stopSwitchColor);

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function colorSwitch() {
  startDate.disabled = true;
  stopDate.disabled = false;

  intervalId = setInterval(() => {
    body.style.backgroundColor = getRandomColor();
  }, 1000);
}

function stopSwitchColor() {
  startDate.disabled = false;
  stopDate.disabled = true;
  clearInterval(intervalId);
}