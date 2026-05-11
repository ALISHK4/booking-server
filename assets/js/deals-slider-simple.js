// Упрощенная версия слайдера предложений - теперь работает со статичным HTML
$(document).ready(function() {
  console.log('Простой слайдер загружен - статичная версия');
  
  let currentPage = 1;
  
  // Функция переключения на страницу - теперь работает со статичными контейнерами
  function goToPage(pageNumber) {
    console.log('Переход на страницу:', pageNumber);
    
    // Скрываем все контейнеры с предложениями
    $('.deals-container').hide();
    
    // Обновляем активную кнопку
    $('.page-numbers li').removeClass('active');
    $('.page-numbers li').eq(pageNumber).addClass('active');
    
    // Показываем нужный контейнер с предложениями
    $('.deals-container[data-page="' + pageNumber + '"]').show();
    
    currentPage = pageNumber;
  }
  
  // Инициализация
  console.log('Количество контейнеров для страницы 1:', $('.deals-container[data-page="1"]').length);
  console.log('Количество контейнеров для страницы 2:', $('.deals-container[data-page="2"]').length);
  console.log('Количество контейнеров для страницы 3:', $('.deals-container[data-page="3"]').length);
  
  // Начинаем со страницы 1
  goToPage(1);
  
  // Обработка кликов по кнопкам (только ручное переключение)
  $('.page-numbers li a').click(function(e) {
    e.preventDefault();
    
    const $this = $(this);
    const pageText = $this.text().trim();
    const pageNumber = parseInt(pageText);
    
    console.log('Клик по странице:', pageNumber);
    
    // Обработка стрелок
    if ($this.find('i.fa-arrow-left').length > 0) {
      // Стрелка влево
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    } else if ($this.find('i.fa-arrow-right').length > 0) {
      // Стрелка вправо
      if (currentPage < 3) {
        goToPage(currentPage + 1);
      }
    } else if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= 3) {
      // Клик по номеру страницы
      goToPage(pageNumber);
    }
  });
});
