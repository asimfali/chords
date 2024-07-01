document.addEventListener('DOMContentLoaded', function() {
    const categoryList = document.getElementById('category-list');
    if (!categoryList) {
        console.error('Category list not found');
        return;
    }

    let currentSwiper = null;

    categoryList.addEventListener('click', function(e) {
        const category = e.target.closest('.category');
        if (category) {
            const categoryId = category.dataset.id;
            const carousel = category.querySelector('.product-carousel');

            // Проверяем, не является ли целевой элемент кнопкой навигации
            if (e.target.closest('.swiper-button-next') || e.target.closest('.swiper-button-prev')) {
                // Если это кнопка навигации, прекращаем дальнейшее выполнение функции
                return;
            }

            if (carousel.style.display === 'block') {
                carousel.style.display = 'none';
                if (currentSwiper) {
                    currentSwiper.destroy();
                    currentSwiper = null;
                }
            } else {
                initializeCarousel(categoryId, carousel);
            }
        }
    });

    function initializeCarousel(categoryId, carousel) {
        carousel.innerHTML = `
            <div class="swiper">
                <div class="swiper-wrapper"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;

        const swiperContainer = carousel.querySelector('.swiper');
        const swiperWrapper = carousel.querySelector('.swiper-wrapper');

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
                        }
                    }
                });
            }, 100);
        });
    }

    function loadProducts(categoryId, container) {
        return fetch(`/api/products/?category=${categoryId}&limit=10`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                data.forEach(product => {
                    const productCard = createProductCard(product);
                    container.appendChild(productCard);
                });
            })
            .catch(error => {
                console.error('Error loading products:', error);
            });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'swiper-slide';
        card.innerHTML = `
            <div class="product-card" id="product-${product.id}">
                <img src="${product.image || '/static/images/placeholder.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} руб.</p>
            </div>
        `;
        return card;
    }
});