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
    
    // Показываем все контейнеры с видимыми карточками
    $('.deals-container').each(function() {
      const $container = $(this);
      const visibleCardsInContainer = $container.find('.deal-card:visible').length;
      
      if (visibleCardsInContainer > 0) {
        $container.show();
      } else {
        $container.hide();
      }
    });
    
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
            <button type="button" class="border-button" id="resetFiltersFromMessage">Сбросить фильтры</button>
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
    console.log('Сброс фильтров начат...');
    
    $('#chooseLocation').val('');
    $('#choosePrice').val('');
    
    // Показываем все карточки и контейнеры
    $('.deal-card').show();
    $('.deals-container').show();
    
    hideNoResultsMessage();
    
    console.log('Фильтры сброшены, показаны все карточки');
  }
  
  // Обработчики событий - автоматическая фильтрация при изменении
  $('#chooseLocation, #choosePrice').on('change', function() {
    console.log('Изменение в фильтрах обнаружено');
    filterDeals();
  });
  
  // Сброс фильтров - несколько вариантов кнопок
  $(document).on('click', '#resetFiltersBtn, #resetFiltersFromMessage', function(e) {
    e.preventDefault();
    console.log('Кнопка сброса нажата');
    resetFilters();
  });
  
  // Инициализация - показываем все карточки сразу
  $('.deal-card').show();
  $('.deals-container').show();
  
  console.log('Всего карточек на странице:', $('.deal-card').length);
  console.log('Контейнеров страниц:', $('.deals-container').length);
  
  // Отладочная информация о карточках
  $('.deal-card').each(function(index) {
    const $card = $(this);
    console.log('Карточка', index + 1, '- Направление:', $card.data('location'), 'Цена:', $card.data('price'));
  });
});
