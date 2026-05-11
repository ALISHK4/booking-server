// JavaScript для управления слайдами предложений
$(document).ready(function() {
  console.log('Deals slider script loaded');
  
  // Проверяем, что jQuery загружен
  if (typeof $ === 'undefined') {
    console.error('jQuery не загружен!');
    return;
  }
  let currentSlide = 0;
  let slideInterval;
  let currentPage = 2; // Текущая активная страница
  
  // Данные для дополнительных предложений
  const additionalDeals = [
    // Страница 1 - дополнительные предложения
    {
      image: "assets/images/deals-01.jpg",
      info: "*Специальное предложение",
      title: "Франция: Ницца — Лазурный берег",
      duration: "7 дней",
      places: "Еженедельные вылеты",
      description: "7 ночей на Лазурном берегу, экскурсии в Канны и Монако, трансфер из аэропорта.",
      page: 1
    },
    {
      image: "assets/images/deals-02.jpg", 
      info: "*Раннее бронирование",
      title: "Швейцария: Женева — озёра",
      duration: "6 дней",
      places: "Еженедельные вылеты",
      description: "6 дней в Женеве, круиз по Женевскому озеру, экскурсия в Шильонский замок.",
      page: 1
    },
    {
      image: "assets/images/deals-03.jpg",
      info: "*Семейный пакет",
      title: "Карибы: Ямайка — Монтего-Бей",
      duration: "8 дней", 
      places: "Еженедельные вылеты",
      description: "8 ночей в Монтего-Бей, экскурсии на водопады Даннс-Ривер, трансфер.",
      page: 1
    },
    {
      image: "assets/images/deals-04.jpg",
      info: "*Культурный тур",
      title: "Великобритания: Лондон — классика",
      duration: "5 дней",
      places: "Еженедельные вылеты", 
      description: "5 дней в Лондоне, экскурсии в Тауэр и Вестминстер, билеты в театр.",
      page: 1
    },
    // Страница 3 - дополнительные предложения
    {
      image: "assets/images/deals-01.jpg",
      info: "*Горнолыжный сезон",
      title: "Швейцария: Давос — горы",
      duration: "7 дней",
      places: "Еженедельные вылеты",
      description: "7 дней в Давосе, ски-пасс, инструктор, трансфер до склонов.",
      page: 3
    },
    {
      image: "assets/images/deals-02.jpg",
      info: "*Романтическое путешествие", 
      title: "Франция: Версаль — дворцы",
      duration: "4 дня",
      places: "Еженедельные вылеты",
      description: "4 дня в Париже, экскурсии в Версаль и Лувр, романтический ужин.",
      page: 3
    },
    {
      image: "assets/images/deals-03.jpg",
      info: "*Приключенческий тур",
      title: "Карибы: Барбадос — дайвинг",
      duration: "9 дней",
      places: "Еженедельные вылеты", 
      description: "9 ночей на Барбадосе, дайвинг-курс, экскурсии на плантации сахарного тростника.",
      page: 3
    },
    {
      image: "assets/images/deals-04.jpg",
      info: "*Бизнес-класс",
      title: "Великобритания: Эдинбург — Шотландия",
      duration: "6 дней",
      places: "Еженедельные вылеты",
      description: "6 дней в Эдинбурге, экскурсии в Хайлендс, виски-дегустация, трансфер.",
      page: 3
    }
  ];

  // Функция создания HTML для предложения
  function createDealHTML(deal) {
    return `
      <div class="col-lg-6 col-sm-6">
        <div class="item">
          <div class="row">
            <div class="col-lg-6">
              <div class="image">
                <img src="${deal.image}" alt="">
              </div>
            </div>
            <div class="col-lg-6 align-self-center">
              <div class="content">
                <span class="info">${deal.info}</span>
                <h4>${deal.title}</h4>
                <div class="row">
                  <div class="col-6">
                    <i class="fa fa-clock"></i>
                    <span class="list">${deal.duration}</span>
                  </div>
                  <div class="col-6">
                    <i class="fa fa-map"></i>
                    <span class="list">${deal.places}</span>
                  </div>
                </div>
                <p>${deal.description}</p>
                <div class="main-button">
                  <a href="reservation.html">Сделать бронирование</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Функция показа слайдов для конкретной страницы
  function showSlidesForPage(pageNumber) {
    const dealsForPage = additionalDeals.filter(deal => deal.page === pageNumber);
    const container = $(`.deals-container[data-page="${pageNumber}"]`);
    
    if (container.length === 0) return;
    
    container.empty();
    
    dealsForPage.forEach(deal => {
      container.append(createDealHTML(deal));
    });
  }

  // Функция переключения страниц
  function switchToPage(pageNumber) {
    console.log('Переключение на страницу:', pageNumber);
    
    // Скрываем все контейнеры
    $('.deals-container').hide();
    $('.amazing-deals .col-lg-6:not(.deals-container)').hide();
    
    // Обновляем активную страницу в пагинации
    $('.page-numbers li').removeClass('active');
    $('.page-numbers li').eq(pageNumber).addClass('active');
    
    if (pageNumber === 2) {
      // Показываем статичные предложения для страницы 2
      $('.amazing-deals .col-lg-6:not(.deals-container)').show();
      console.log('Показываем статичные предложения');
    } else {
      // Показываем динамические предложения для страниц 1 и 3
      showSlidesForPage(pageNumber);
      $(`.deals-container[data-page="${pageNumber}"]`).show();
      console.log('Показываем динамические предложения для страницы', pageNumber);
    }
    
    currentPage = pageNumber;
  }

  // Функция автоматической смены слайдов
  function startAutoSlide() {
    slideInterval = setInterval(function() {
      if (currentPage === 2) {
        // Если на странице 2, переключаемся на страницу 1
        switchToPage(1);
      } else if (currentPage === 1) {
        // Если на странице 1, переключаемся на страницу 3
        switchToPage(3);
      } else if (currentPage === 3) {
        // Если на странице 3, переключаемся на страницу 2
        switchToPage(2);
      }
    }, 5000);
  }

  // Остановка автоматической смены
  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Инициализация
  console.log('Количество элементов пагинации:', $('.page-numbers li a').length);
  console.log('Количество контейнеров для страницы 1:', $('.deals-container[data-page="1"]').length);
  console.log('Количество контейнеров для страницы 3:', $('.deals-container[data-page="3"]').length);
  
  showSlidesForPage(1);
  showSlidesForPage(3);
  switchToPage(2); // Начинаем со страницы 2
  startAutoSlide();

  // Обработка кликов по пагинации
  $(document).on('click', '.page-numbers li a', function(e) {
    e.preventDefault();
    stopAutoSlide();
    
    const pageText = $(this).text().trim();
    const pageNumber = parseInt(pageText);
    
    console.log('Клик по странице:', pageNumber);
    
    if (!isNaN(pageNumber) && (pageNumber === 1 || pageNumber === 2 || pageNumber === 3)) {
      switchToPage(pageNumber);
    }
    
    // Перезапуск автоматической смены через 3 секунды
    setTimeout(startAutoSlide, 3000);
  });

  // Обработка наведения мыши (пауза автоматической смены)
  $('.amazing-deals').hover(
    function() { stopAutoSlide(); },
    function() { startAutoSlide(); }
  );
});
