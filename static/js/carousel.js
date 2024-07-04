import { loadProducts } from './api.js';
import { loadingState, resetLoadingState } from './state.js';

export function initializeCarousel(categoryId, carousel) {
    // console.log('Initializing carousel for category:', categoryId);

    resetLoadingState();

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

    let limit = 5;

    loadProducts(categoryId, swiperWrapper).then(() => {
        initSwiper();
    });

    function initSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper is not loaded');
            return;
        }

        new Swiper(swiperContainer, {
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
                    slidesPerView: 6,
                }
            },
            on: {
                slideChange: function () {
                    if (this.isEnd && !loadingState.isLoading && !loadingState.reachedEnd) {
                        loadProducts(categoryId, swiperWrapper, limit);
                    }
                }
            }
        });
    }
}