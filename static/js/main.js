import { initializeCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', function() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) {
        console.error('Category list not found');
        return;
    }

    let currentSwiper = null;
    let currentPage = 1;
    let isLoading = false;
    let reachedEnd = false;

    categoryList.addEventListener('click', function(e) {
        const category = e.target.closest('.category');
        if (category) {
            const categoryId = category.dataset.id;
            const carousel = category.querySelector('.product-carousel');

            // Проверяем, не является ли целевой элемент кнопкой навигации
            if (e.target.closest('.swiper-button-next') || e.target.closest('.swiper-button-prev')) {
                return;
            }

            if (carousel.style.display === 'block') {
                carousel.style.display = 'none';
                if (currentSwiper) {
                    currentSwiper.destroy();
                    currentSwiper = null;
                }
            } else {
                if (currentSwiper) {
                    currentSwiper.destroy();
                    currentSwiper = null;
                }

                // Сброс параметров
                currentPage = 1;
                isLoading = false;
                reachedEnd = false;

                initializeCarousel(categoryId, carousel);
            }
        }
    });

});
