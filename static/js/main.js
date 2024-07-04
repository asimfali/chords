import { initializeCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', function() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) {
        console.error('Category list not found');
        return;
    }

    categoryList.addEventListener('click', function(e) {
        const category = e.target.closest('.category');
        if (category) {
            const categoryId = category.dataset.id;
            const carousel = category.querySelector('.product-carousel');

            if (e.target.closest('.swiper-button-next') || e.target.closest('.swiper-button-prev')) {
                return;
            }

            if (carousel.style.display === 'block') {
                carousel.style.display = 'none';
            } else {
                if (typeof Swiper === 'undefined') {
                    console.error('Swiper is not loaded. Trying to load it dynamically.');
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js';
                    script.onload = function() {
                        initializeCarousel(categoryId, carousel);
                    };
                    document.head.appendChild(script);
                } else {
                    initializeCarousel(categoryId, carousel);
                }
            }
        }
    });
});