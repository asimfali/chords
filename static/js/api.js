export function loadProducts(categoryId, container, limit = 10) {
        if (isLoading || reachedEnd) return Promise.resolve();

        isLoading = true;
        console.log(`Loading products for category ${categoryId}, page ${currentPage}, limit ${limit}`);
        return fetch(`/api/products/?category=${categoryId}&page=${currentPage}&limit=${limit}`)
            .then(response => response.json())
            .then(data => {
                console.log('Received data:', data);
                if (data.length === 0) {
                    console.log('No more products to load');
                    reachedEnd = true;
                } else {
                    data.forEach(product => {
                        const productCard = createProductCard(product);
                        container.appendChild(productCard);
                    });
                    currentPage++;
                }
                isLoading = false;
                if (currentSwiper) {
                    currentSwiper.update();
                    toggleNavigationButtons(currentSwiper, container.closest('.swiper').querySelector('.swiper-button-prev'), container.closest('.swiper').querySelector('.swiper-button-next'));
                }
            })
            .catch(error => {
                console.error('Error loading products:', error);
                isLoading = false;
            });
    }
export function toggleNavigationButtons(swiper, prevButton, nextButton) {
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
    }