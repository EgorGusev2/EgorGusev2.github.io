const servicePrices = {
  screen: 3000,
  battery: 500,
  port: 800
};

const brandM = {
  apple: 1.3,
  samsung: 1.2,
  xiaomi: 1.0
};

function calculatePrice() { // Исправлено название функции (было calculatePrices)
  const quantity = parseInt(document.getElementById('field1').value) || 1;
  const serviceTypeElement = document.querySelector('input[name="serviceType"]:checked');
  
  // Проверка, выбран ли тип услуги
  if (!serviceTypeElement) {
    document.getElementById('result').textContent = 'Выберите тип услуги';
    return;
  }
  
  const serviceType = serviceTypeElement.value;
  const brand = document.getElementById('brand').value;
  const urgent = document.getElementById('urgent').checked;
  const warranty = document.getElementById('warranty').checked;
  const delivery = document.getElementById('delivery').checked;

  // Рассчитываем базовую стоимость
  let basePrice = servicePrices[serviceType];
  
  // Применяем коэффициент бренда
  basePrice *= brandM[brand];
  
  // Применяем дополнительные опции
  if (urgent) basePrice *= 1.2;
  if (warranty) basePrice *= 1.15;
  if (delivery) basePrice += 500;
  
  // Умножаем на количество
  const totalPrice = Math.round(basePrice * quantity);
  
  document.getElementById('result').textContent = 
    `Общая стоимость: ${totalPrice} руб.`;
}

// Исправлены обработчики событий
document.getElementById('field1').addEventListener('input', calculatePrice); // Исправлен id
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', calculatePrice);
});
document.getElementById('brand').addEventListener('change', calculatePrice);
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', calculatePrice);
});

// Первоначальный расчет
calculatePrice();

$(document).ready(function() {
    // Конфигурация слайдера
    const config = {
        totalSlides: 8,
        slidesToShow: 3,
        currentSlide: 0,
        slideWidth: 100 / 3 // 33.333%
    };

    // Элементы DOM
    const $track = $('.gallery-track');
    const $slides = $('.gallery-slide');
    const $prevBtn = $('.gallery-nav.prev');
    const $nextBtn = $('.gallery-nav.next');
    const $currentPage = $('.current-page');
    const $totalPages = $('.total-pages');
    const $pagerDots = $('.pager-dots');

    // Инициализация
    function init() {
        updateSlidesToShow();
        createPagerDots();
        updateSlider();
        updateNavigation();
        
        // Обработчики событий
        $prevBtn.on('click', prevSlide);
        $nextBtn.on('click', nextSlide);
        $(window).on('resize', onResize);
    }

    // Обновление количества отображаемых слайдов в зависимости от ширины экрана
    function updateSlidesToShow() {
        const width = $(window).width();
        
        if (width <= 480) {
            config.slidesToShow = 1;
            config.slideWidth = 100;
        } else if (width <= 768) {
            config.slidesToShow = 2;
            config.slideWidth = 50;
        } else {
            config.slidesToShow = 3;
            config.slideWidth = 100 / 3;
        }
        
        // Обновляем ширину слайдов
        $slides.css('flex', `0 0 ${config.slideWidth}%`);
        
        // Пересчитываем общее количество страниц
        config.totalPages = Math.ceil(config.totalSlides / config.slidesToShow);
        
        // Обновляем информацию о страницах
        updatePageInfo();
    }

    // Создание точек пейджера
    function createPagerDots() {
        $pagerDots.empty();
        
        for (let i = 0; i < config.totalPages; i++) {
            const $dot = $('<button>')
                .addClass('pager-dot')
                .attr('data-page', i)
                .on('click', function() {
                    goToPage(i);
                });
            
            $pagerDots.append($dot);
        }
    }

    // Переход к предыдущему слайду
    function prevSlide() {
        if (config.currentSlide > 0) {
            config.currentSlide--;
            updateSlider();
        }
    }

    // Переход к следующему слайду
    function nextSlide() {
        if (config.currentSlide < config.totalPages - 1) {
            config.currentSlide++;
            updateSlider();
        }
    }

    // Переход к конкретной странице
    function goToPage(pageIndex) {
        config.currentSlide = pageIndex;
        updateSlider();
    }

    // Обновление позиции слайдера
    function updateSlider() {
        const translateX = -config.currentSlide * 100;
        $track.css('transform', `translateX(${translateX}%)`);
        
        updatePagerDots();
        updateNavigation();
        updatePageInfo();
    }

    // Обновление состояния точек пейджера
    function updatePagerDots() {
        $('.pager-dot').removeClass('active');
        $(`.pager-dot[data-page="${config.currentSlide}"]`).addClass('active');
    }

    // Обновление состояния кнопок навигации
    function updateNavigation() {
        $prevBtn.prop('disabled', config.currentSlide === 0);
        $nextBtn.prop('disabled', config.currentSlide === config.totalPages - 1);
    }

    // Обновление информации о страницах
    function updatePageInfo() {
        $currentPage.text(config.currentSlide + 1);
        $totalPages.text(config.totalPages);
    }

    // Обработчик изменения размера окна
    function onResize() {
        const oldCurrentSlide = config.currentSlide;
        
        updateSlidesToShow();
        createPagerDots();
        
        // Корректируем текущий слайд после изменения количества слайдов на странице
        config.currentSlide = Math.min(oldCurrentSlide, config.totalPages - 1);
        
        updateSlider();
    }

    // Запуск инициализации
    init();
    });