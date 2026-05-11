// JavaScript для страницы бронирования
$(document).ready(function() {
  // Автоматический выбор направления из URL параметров
  function selectDestinationFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');

    if (!destination) return;

    // Выбираем направление сразу в select, если ссылка содержит ?destination=...
    const selectElement = document.getElementById('chooseCategory');
    if (!selectElement) return;

    for (const option of selectElement.options) {
      if (option.value === destination) {
        selectElement.value = option.value;
        break;
      }
    }
  }

  // Вызываем функцию при загрузке страницы
  selectDestinationFromURL();

  // Обработка кликов по опциям
  $(".option").click(function(){
    $(".option").removeClass("active");
    $(this).addClass("active"); 
  });

  // Маска и валидация телефона по выбранной стране СНГ
  (function () {
    const countryInput = document.getElementById('phoneCountry');
    const countryWrap = document.querySelector('.phone-country-wrap');
    const countryToggle = document.getElementById('countryToggle');
    const countryMenu = document.getElementById('countryMenu');
    const countryLabel = document.getElementById('countryLabel');
    const countryFlag = document.getElementById('countryFlag');
    const phoneCodePrefix = document.getElementById('phoneCodePrefix');
    const phoneHint = document.getElementById('phoneHint');
    const phoneInput = document.getElementById('phoneInput');
    if (!phoneInput || !countryInput || !countryToggle || !countryMenu) return;

    let currentMeta = {
      value: 'RU',
      code: '+7',
      country: 'Россия',
      flag: 'assets/images/flags/ru.png',
      nationalLen: 10
    };

    function digitsOnly(value) {
      return value.replace(/\D/g, '');
    }

    function formatPhoneByCountry(raw, countryMeta) {
      const digits = digitsOnly(raw).slice(0, countryMeta.nationalLen);
      const p1 = digits.slice(0, 3);
      const p2 = digits.slice(3, 6);
      const p3 = digits.slice(6, 8);
      const p4 = digits.slice(8, countryMeta.nationalLen);
      let result = '';

      if (p1) result += `(${p1}`;
      if (p1.length === 3) result += ')';
      if (p2) result += ` ${p2}`;
      if (p3) result += `-${p3}`;
      if (p4) result += `-${p4}`;

      return result;
    }

    function validatePhone() {
      const meta = currentMeta;
      const nationalDigits = digitsOnly(phoneInput.value).slice(0, meta.nationalLen);

      if (nationalDigits.length !== meta.nationalLen) {
        phoneInput.setCustomValidity(`Для страны ${meta.country} введите ${meta.nationalLen} цифр после кода ${meta.code}`);
        return false;
      }
      phoneInput.setCustomValidity('');
      return true;
    }

    function applyCountry(meta) {
      currentMeta = meta;
      countryInput.value = meta.value;
      if (countryLabel) {
        countryLabel.textContent = `${meta.country} (${meta.code})`;
      }
      if (phoneCodePrefix) {
        phoneCodePrefix.textContent = meta.code;
      }
      if (countryFlag) {
        countryFlag.src = meta.flag;
        countryFlag.alt = `Флаг: ${meta.country}`;
      }
      if (phoneHint) {
        phoneHint.textContent = `${meta.country}: после кода ${meta.code} введите ${meta.nationalLen} цифр`;
      }
      phoneInput.value = formatPhoneByCountry(phoneInput.value, meta);
      validatePhone();
    }

    phoneInput.addEventListener('input', function () {
      const meta = currentMeta;
      phoneInput.value = formatPhoneByCountry(phoneInput.value, meta);
      validatePhone();
    });

    countryToggle.addEventListener('click', function () {
      const isOpen = countryWrap.classList.toggle('open');
      countryToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    countryMenu.addEventListener('click', function (event) {
      const option = event.target.closest('.country-option');
      if (!option) return;
      const meta = {
        value: option.dataset.value || 'RU',
        code: option.dataset.code || '+7',
        country: option.dataset.country || 'Россия',
        flag: option.dataset.flag || 'assets/images/flags/ru.png',
        nationalLen: Number(option.dataset.len || 10)
      };
      applyCountry(meta);
      countryWrap.classList.remove('open');
      countryToggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function (event) {
      if (!countryWrap.contains(event.target)) {
        countryWrap.classList.remove('open');
        countryToggle.setAttribute('aria-expanded', 'false');
      }
    });

    phoneInput.addEventListener('blur', validatePhone);
    applyCountry(currentMeta);
  })();

  // Обработка отправки формы бронирования
  (function(){
    const form = document.getElementById('reservation-form');
    if(!form) return;
    form.addEventListener('submit', async function(ev){
      ev.preventDefault();
      const phoneInput = document.getElementById('phoneInput');
      if (phoneInput && !phoneInput.checkValidity()) {
        phoneInput.reportValidity();
        return;
      }
      const url = 'https://booking-api-irt8.onrender.com/api/reservations';
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      if (phoneInput) {
        const countryOption = document.querySelector(`#countryMenu .country-option[data-value="${payload.PhoneCountry || 'RU'}"]`);
        const code = countryOption ? (countryOption.dataset.code || '+7') : '+7';
        const national = phoneInput.value.replace(/\D/g, '');
        payload.Number = code + national;
      }
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await resp.json();
        if (resp.ok && data.ok) {
          alert('Бронирование отправлено!');
          form.reset();
        } else {
          alert('Ошибка: ' + (data.error || 'Не удалось отправить'));
        }
      } catch (e) {
        alert('Сетевая ошибка: ' + e);
      }
    });
  })();
});
