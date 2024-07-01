document.addEventListener('DOMContentLoaded', function() {
    const categoryList = document.getElementById('category-list');
    let currentCategory = null;

    categoryList.addEventListener('click', function(e) {
        const category = e.target.closest('.category');
        if (category) {
            const categoryId = category.dataset.id;
            const carousel = category.querySelector('.product-carousel');

            console.log('Clicked category:', categoryId);

            if (carousel.style.display === 'block') {
                carousel.style.display = 'none';
                currentCategory = null;
            } else {
                if (currentCategory) {
                    currentCategory.querySelector('.product-carousel').style.display = 'none';
                }
                if (!carousel.hasChildNodes()) {
                    console.log('Initializing carousel for category:', categoryId);
                    initializeCarousel(categoryId, carousel);
                }
                carousel.style.display = 'block';
                currentCategory = category;
            }
        }
    });

    function initializeCarousel(categoryId, carousel) {
        carousel.innerHTML = `
            <button class="prev">&#10094;</button>
            <div class="carousel-container"></div>
            <button class="next">&#10095;</button>
        `;

        const container = carousel.querySelector('.carousel-container');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');

        let currentPage = 1;
        let isLoading = false;
        let reachedEnd = false;

        loadProducts(categoryId, container);

        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollCarousel(-1);
        });
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollCarousel(1);
        });

        // Предотвращаем всплытие клика с карусели на категорию
        carousel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        function scrollCarousel(direction) {
            const scrollAmount = container.clientWidth;
            container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

            if (direction > 0 && !isLoading && !reachedEnd) {
                const scrollPercentage = (container.scrollLeft + container.clientWidth) / container.scrollWidth;
                if (scrollPercentage > 0.7) {
                    loadProducts(categoryId, container);
                }
            }
        }

        function loadProducts(categoryId, container) {
            if (isLoading || reachedEnd) return;

            isLoading = true;
            console.log('Loading products for category:', categoryId);
            fetch(`/api/products/?category=${categoryId}&page=${currentPage}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Received data:', data);
                    if (data.length === 0) {
                        console.log('No more products to load');
                        reachedEnd = true;
                        isLoading = false;
                        return;
                    }

                    data.forEach(product => {
                        if (!document.getElementById(`product-${product.id}`)) {
                            const productCard = createProductCard(product);
                            container.appendChild(productCard);
                            console.log('Added product to carousel:', product.id);
                        }
                    });

                    currentPage++;
                    isLoading = false;
                })
                .catch(error => {
                    console.error('Error loading products:', error);
                    isLoading = false;
                });
        }
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.id = `product-${product.id}`;
        card.innerHTML = `
            <img src="${product.image || '/static/images/placeholder.jpg'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} руб.</p>
        `;
        return card;
    }
});