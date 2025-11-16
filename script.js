// Калькулятор ремонта
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

function calculatePrice() {
  const quantity = parseInt(document.getElementById('field1').value) || 1;
  const serviceTypeElement = document.querySelector('input[name="serviceType"]:checked');
  
  if (!serviceTypeElement) {
    document.getElementById('result').textContent = 'Выберите тип услуги';
    return;
  }
  
  const serviceType = serviceTypeElement.value;
  const brand = document.getElementById('brand').value;
  const urgent = document.getElementById('urgent').checked;
  const warranty = document.getElementById('warranty').checked;
  const delivery = document.getElementById('delivery').checked;

  let basePrice = servicePrices[serviceType];
  basePrice *= brandM[brand];
  
  if (urgent) basePrice *= 1.2;
  if (warranty) basePrice *= 1.15;
  if (delivery) basePrice += 500;
  
  const totalPrice = Math.round(basePrice * quantity);
  
  document.getElementById('result').textContent = `Общая стоимость: ${totalPrice} руб.`;
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('field1').addEventListener('input', calculatePrice);
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', calculatePrice);
    });
    document.getElementById('brand').addEventListener('change', calculatePrice);
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    calculatePrice();
});

// Галерея
$(document).ready(function() {
    // Элементы DOM
    const $track = $('.gallery-track');
    const $slides = $('.gallery-slide');
    const $prevBtn = $('.gallery-nav.prev');
    const $nextBtn = $('.gallery-nav.next');
    const $currentPage = $('.current-page');
    const $totalPages = $('.total-pages');
    const $pagerDots = $('.pager-dots');
    
    let currentSlide = 0;
    let slidesToShow = 3;
    let totalPages = 0;

    // Инициализация
    function initGallery() {
        updateSlidesToShow();
        createPagerDots();
        updateSlider();
        updateNavigation();
        
        // Обработчики событий
        $prevBtn.on('click', prevSlide);
        $nextBtn.on('click', nextSlide);
        $(window).on('resize', onResize);
    }

    // Обновление количества отображаемых слайдов
    function updateSlidesToShow() {
        const width = $(window).width();
        
        if (width <= 480) {
            slidesToShow = 1;
        } else if (width <= 768) {
            slidesToShow = 2;
        } else {
            slidesToShow = 3;
        }
        
        // Обновляем ширину слайдов
        const slideWidth = 100 / slidesToShow;
        $slides.css('flex', `0 0 ${slideWidth}%`);
        
        // Пересчитываем общее количество страниц
        totalPages = Math.ceil($slides.length / slidesToShow);
        
        // Обновляем информацию о страницах
        updatePageInfo();
    }

    // Создание точек пейджера
    function createPagerDots() {
        $pagerDots.empty();
        
        for (let i = 0; i < totalPages; i++) {
            const $dot = $('<button>')
                .addClass('pager-dot')
                .attr('data-page', i)
                .on('click', function() {
                    goToPage(i);
                });
            
            if (i === currentSlide) {
                $dot.addClass('active');
            }
            
            $pagerDots.append($dot);
        }
    }

    // Переход к предыдущему слайду
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }

    // Переход к следующему слайду
    function nextSlide() {
        if (currentSlide < totalPages - 1) {
            currentSlide++;
            updateSlider();
        }
    }

    // Переход к конкретной странице
    function goToPage(pageIndex) {
        currentSlide = pageIndex;
        updateSlider();
    }

    // Обновление позиции слайдера
    function updateSlider() {
        const translateX = -currentSlide * 100;
        $track.css('transform', `translateX(${translateX}%)`);
        
        updatePagerDots();
        updateNavigation();
        updatePageInfo();
    }

    // Обновление состояния точек пейджера
    function updatePagerDots() {
        $('.pager-dot').removeClass('active');
        $(`.pager-dot[data-page="${currentSlide}"]`).addClass('active');
    }

    // Обновление состояния кнопок навигации
    function updateNavigation() {
        $prevBtn.prop('disabled', currentSlide === 0);
        $nextBtn.prop('disabled', currentSlide === totalPages - 1);
    }

    // Обновление информации о страницах
    function updatePageInfo() {
        $currentPage.text(currentSlide + 1);
        $totalPages.text(totalPages);
    }

    // Обработчик изменения размера окна
    function onResize() {
        const oldCurrentSlide = currentSlide;
        
        updateSlidesToShow();
        createPagerDots();
        
        // Корректируем текущий слайд
        currentSlide = Math.min(oldCurrentSlide, totalPages - 1);
        
        updateSlider();
    }

    // Запуск инициализации галереи
    initGallery();
});