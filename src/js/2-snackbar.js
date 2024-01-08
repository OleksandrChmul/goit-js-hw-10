import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const delayInput = form.querySelector('[name="delay"]');
    const stateRadio = form.querySelector('[name="state"]:checked');

    const delay = parseInt(delayInput.value);

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (stateRadio.value === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });

    promise
      .then(delay => {
        iziToast.success({
          title: 'Fulfilled promise',
          message: `✅ Fulfilled promise in ${delay}ms`,
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Rejected promise',
          message: `❌ Rejected promise in ${delay}ms`,
        });
      });
  });
});
