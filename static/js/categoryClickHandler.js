import { initializeCarousel } from './carousel.js';

let currentCategoryId = null;
let currentCarousel = null;

export const initializeCategoryClick = (categoryList) => {
    categoryList.addEventListener('click', (e) => {
        const categoryBtn = e.target.closest('.category-btn');
        if (categoryBtn) {
            const categoryId = categoryBtn.dataset.id;

            if (currentCategoryId === categoryId) {
                if (currentCarousel) {
                    currentCarousel.remove();
                    currentCarousel = null;
                    currentCategoryId = null;
                    categoryBtn.classList.remove('active');
                }
                return;
            }

            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');

            if (currentCarousel) {
                currentCarousel.remove();
            }

            currentCarousel = document.createElement('div');
            currentCarousel.className = 'product-carousel';
            currentCarousel.setAttribute('data-category', categoryId);

            categoryBtn.insertAdjacentElement('afterend', currentCarousel);

            initializeCarousel(categoryId, currentCarousel);
            currentCategoryId = categoryId;
        }
    });
};
