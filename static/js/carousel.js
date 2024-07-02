import { loadProducts } from './api.js';

export function initializeCarousel(categoryId, carousel) {
        console.log('Initializing carousel for category:', categoryId);

        carousel.innerHTML = `
            <div class="swiper">
                <div class="swiper-wrapper"></div>
                <div class="swiper-button-prev swiper-button-disabled"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;

        const swiperContainer = carousel.querySelector('.swiper');
        const swiperWrapper = carousel.querySelector('.swiper-wrapper');
        const prevButton = carousel.querySelector('.swiper-button-prev');
        const nextButton = carousel.querySelector('.swiper-button-next');

        carousel.style.display = 'block';

        loadProducts(categoryId, swiperWrapper).then(() => {
            setTimeout(() => {
                currentSwiper = new Swiper(swiperContainer, {
                    slidesPerView: 'auto',
                    spaceBetween: 10,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    },
                    on: {
                        init: function () {
                            this.update();
                            toggleNavigationButtons(this, prevButton, nextButton);
                        },
                        slideChange: function () {
                            toggleNavigationButtons(this, prevButton, nextButton);
                            if (this.isEnd && !isLoading && !reachedEnd) {
                                loadProducts(categoryId, swiperWrapper, 5);  // Load 5 more products
                            }
                        }
                    }
                });
            }, 100);
        });
    }