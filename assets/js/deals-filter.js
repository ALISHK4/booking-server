// Упрощенная система фильтрации предложений (без пагинации)
$(document).ready(function() {
  console.log('Упрощенная система фильтрации загружена');
  
  // Функция фильтрации карточек
  function filterDeals() {
    const selectedLocation = $('#chooseLocation').val();
    const selectedPrice = $('#choosePrice').val();
    
    console.log('Фильтр по направлению:', selectedLocation);
    console.log('Фильтр по цене:', selectedPrice);
    
    let visibleCards = 0;
    
    // Проходим по всем карточкам
    $('.deal-card').each(function() {
      const $card = $(this);
      const cardLocation = $card.data('location');
      const cardPrice = parseInt($card.data('price'));
      
      let showCard = true;
      
      // Фильтр по направлению
      if (selectedLocation && selectedLocation !== '') {
        if (cardLocation !== selectedLocation) {
          showCard = false;
        }
      }
      
      // Фильтр по цене
      if (selectedPrice && selectedPrice !== '') {
        let priceMatch = false;
        
        if (selectedPrice === '0-1000') {
          priceMatch = cardPrice <= 1000;
        } else if (selectedPrice === '1000-1500') {
          priceMatch = cardPrice >= 1000 && cardPrice <= 1500;
        } else if (selectedPrice === '1500-2000') {
          priceMatch = cardPrice >= 1500 && cardPrice <= 2000;
        } else if (selectedPrice === '2000-2500') {
          priceMatch = cardPrice >= 2000 && cardPrice <= 2500;
        } else if (selectedPrice === '2500+') {
          priceMatch = cardPrice >= 2500;
        }
        
        if (!priceMatch) {
          showCard = false;
        }
      }
      
      // Показываем или скрываем карточку
      if (showCard) {
        $card.show();
        visibleCards++;
      } else {
        $card.hide();
      }
    });
    
    // Переключаем режим показа страниц: если есть фильтры — показываем все страницы
    const wrapper = $('.static-deals-wrapper');
    if ((selectedLocation && selectedLocation !== '') || (selectedPrice && selectedPrice !== '')) {
      wrapper.addClass('show-all');
    } else {
      wrapper.removeClass('show-all');
    }
    
    // Показываем сообщение если ничего не найдено
    if (visibleCards === 0) {
      showNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }
    
    console.log('Найдено карточек:', visibleCards);
  }
  
  // Функция показа сообщения "ничего не найдено"
  function showNoResultsMessage() {
    if ($('#no-results-message').length === 0) {
      const message = `
        <div id="no-results-message" class="col-lg-12">
          <div class="text-center" style="padding: 40px;">
            <h4>Предложения не найдены</h4>
            <p>Попробуйте изменить параметры фильтра</p>
            <button type="button" class="border-button" id="resetFilters">Сбросить фильтры</button>
          </div>
        </div>
      `;
      $('.amazing-deals .row').append(message);
    }
  }
  
  // Функция скрытия сообщения "ничего не найдено"
  function hideNoResultsMessage() {
    $('#no-results-message').remove();
  }
  
  // Функция сброса фильтров
  function resetFilters() {
    $('#chooseLocation').val('');
    $('#choosePrice').val('');
    
    // Показываем все карточки и контейнеры
    $('.deal-card').show();
    $('.deals-container').show();
    
    hideNoResultsMessage();
    
    console.log('Фильтры сброшены, показаны все карточки');
  }
  
  // Функция обновления пагинации
  function updatePagination() {
    const selectedLocation = $('#chooseLocation').val();
    const selectedPrice = $('#choosePrice').val();
    
    // Если применены фильтры, скрываем пагинацию (показываем все результаты)
    if (selectedLocation || selectedPrice) {
      $('.page-numbers').hide();
    } else {
      // Если фильтры не применены, показываем пагинацию
      $('.page-numbers').show();
    }
  }
  
  // Обработчики событий - автоматическая фильтрация при изменении
  $('#chooseLocation, #choosePrice').on('change', function() {
    filterDeals();
  });
  
  // Сброс фильтров
  $(document).on('click', '#resetFilters, #resetFiltersBtn', function() {
    resetFilters();
  });
  
  // Инициализация
  $('.deal-card').show();
  $('#chooseLocation').val('');
  $('#choosePrice').val('');
  hideNoResultsMessage();
  console.log('Всего карточек на странице:', $('.deal-card').length);
  
  // Добавляем кнопку "Показать все" в пагинацию
  if ($('.page-numbers .show-all-btn').length === 0) {
    $('.page-numbers').append('<li><a href="#" class="show-all-btn">Показать все</a></li>');
  }
  
  // Добавляем кнопку возврата к пагинации после заголовка
  if ($('#return-pagination-btn').length === 0) {
    $('.amazing-deals .section-heading').after('<div id="pagination-control" class="text-center" style="display:none; margin-bottom: 30px;"><button type="button" class="border-button" id="return-pagination-btn">Вернуться к страницам</button></div>');
  }
  
  // Обработчик для кнопки "Показать все"
  $(document).on('click', '.show-all-btn', function(e) {
    e.preventDefault();
    showAllCardsMode();
    $('#pagination-control').show();
  });
  
  // Обработчик для кнопки возврата к пагинации
  $(document).on('click', '#return-pagination-btn', function(e) {
    e.preventDefault();
    resetFilters();
    $('#pagination-control').hide();
  });
  
  // Инициализация - показываем все карточки
  console.log('Всего карточек на странице:', $('.deal-card').length);
});
