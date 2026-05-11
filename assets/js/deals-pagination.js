// Простая система пагинации для карточек предложений
$(document).ready(function() {
  console.log('Система пагинации загружена');
  
  let currentPage = 1;
  
  // Функция переключения на страницу
  function goToPage(pageNumber) {
    console.log('Переход на страницу:', pageNumber);
    
    // Скрываем все контейнеры
    $('.deals-container').hide();
    
    // Показываем нужную страницу
    $('.deals-container[data-page="' + pageNumber + '"]').show();
    
    // Обновляем активную кнопку
    $('.page-numbers li').removeClass('active');
    $('.page-numbers li').each(function() {
      const $this = $(this);
      const text = $this.find('a').text().trim();
      if (text == pageNumber) {
        $this.addClass('active');
      }
    });
    
    currentPage = pageNumber;
  }
  
  // Обработчики событий для кнопок пагинации
  $('.page-numbers li a').on('click', function(e) {
    e.preventDefault();
    
    const $this = $(this);
    const pageText = $this.text().trim();
    const pageNumber = parseInt(pageText);
    
    console.log('Клик по:', pageText, 'Номер страницы:', pageNumber);
    
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
  
  // Инициализация - показываем первую страницу
  goToPage(1);
  
  console.log('Найдено страниц:', $('.deals-container').length);
  console.log('Всего карточек на всех страницах:', $('.deals-container .col-lg-6').length);
});
