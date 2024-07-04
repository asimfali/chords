import { loadProducts } from './api.js';
import { loadingState, resetLoadingState } from './state.js';

export const initializeCarousel = (categoryId, carousel) => {
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

    loadProducts(categoryId, swiperWrapper).then(() => {
        initSwiper(swiperContainer, categoryId, swiperWrapper, prevButton, nextButton);
    });
};

const initSwiper = (swiperContainer, categoryId, swiperWrapper, prevButton, nextButton) => {
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
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 4,
            },
            1440: {
                slidesPerView: 6,
            }
        },
        on: {
            init() {
                this.update();
                toggleNavigationButtons(this, prevButton, nextButton);
            },
            slideChange() {
                toggleNavigationButtons(this, prevButton, nextButton);
                if (this.isEnd && !loadingState.isLoading && !loadingState.reachedEnd) {
                    loadProducts(categoryId, swiperWrapper);
                }
            }
        }
    });
};

const toggleNavigationButtons = (swiper, prevButton, nextButton) => {
    if (swiper.isBeginning) {
        prevButton.classList.add('swiper-button-disabled');
    } else {
        prevButton.classList.remove('swiper-button-disabled');
    }

    if (swiper.isEnd) {
        nextButton.classList.add('swiper-button-disabled');
    } else {
        nextButton.classList.remove('swiper-button-disabled');
    }
};
