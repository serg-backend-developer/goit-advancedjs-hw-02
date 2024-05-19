import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const END_DATE = 'time';

function initDateTimePicker() {
  const element = document.querySelector('#datetime-picker');

  if (!element) {
    return;
  }

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose([selectedDate]) {
      const endTime = selectedDate.getTime();
      element.dataset[END_DATE] = endTime;
      validateEndTime(endTime);
    },
  };

  return flatpickr(element, options);
}

function validateEndTime(endTime) {
  const startDate = document.querySelector('[data-start]');

  if (Date.now() >= endTime) {
    iziToast.show({
      message: 'Please choose a date in the future',
      color: 'red',
      position: 'topRight',
    });
    return false;
  }

  if (startDate) {
    startDate.disabled = false;
  }

  return true;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function bindEvents() {
  initDateTimePicker();

  const startDate = document.querySelector('[data-start]');
  const datetimeInput = document.querySelector('#datetime-picker');

  if (!startDate || !datetimeInput) {
    return;
  }

  startDate.disabled = true;

  startDate.addEventListener('click', () => {
    startDate.disabled = true;

    const endTime = Number(datetimeInput.dataset[END_DATE]);
    startCountDown(endTime);
  });
}

function startCountDown(endTime) {
  const daysField = document.querySelector('[data-days]');
  const hoursField = document.querySelector('[data-hours]');
  const minutesField = document.querySelector('[data-minutes]');
  const secondsField = document.querySelector('[data-seconds]');
  const element = document.querySelector('#datetime-picker');

  if (
    ![daysField, hoursField, minutesField, secondsField, element].every(Boolean)
  ) {
    return;
  }

  element.disabled = true;

  const run = () => {
    const diff = endTime - Date.now();
    const { days, hours, minutes, seconds } = convertMs(diff);

    if ([days, hours, minutes, seconds].every(item => item === 0)) {
      clearInterval(interval);
    }

    daysField.textContent = addLeadingZero(days);
    hoursField.textContent = addLeadingZero(hours);
    minutesField.textContent = addLeadingZero(minutes);
    secondsField.textContent = addLeadingZero(seconds);
  };

  run();

  const interval = setInterval(run, 1000);
}

bindEvents();
