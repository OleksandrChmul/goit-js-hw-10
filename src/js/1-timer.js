import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timeDifference; // Визначено тут, щоб було доступно всередині функцій
const startButton = document.getElementById('startButton');

// Додано рядок, щоб кнопка була неактивною з початку
startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
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

function updateTimerDisplay(ms) {
  if (ms <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(ms);

  document.getElementById('days').textContent = addLeadingZero(days);
  document.getElementById('hours').textContent = addLeadingZero(hours);
  document.getElementById('minutes').textContent = addLeadingZero(minutes);
  document.getElementById('seconds').textContent = addLeadingZero(seconds);
}

startButton.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  timeDifference = userSelectedDate.getTime() - currentTime;

  if (timeDifference <= 0) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
    startButton.disabled = true;
  } else {
    startButton.disabled = true;
    updateTimerDisplay(timeDifference);

    const timerInterval = setInterval(() => {
      if (timeDifference > 0) {
        timeDifference -= 1000;
        updateTimerDisplay(timeDifference);
      } else {
        clearInterval(timerInterval);
        startButton.disabled = false;
        iziToast.success({
          title: 'Countdown Finished',
          message: 'The countdown has reached zero!',
        });
      }
    }, 1000);
  }
});
