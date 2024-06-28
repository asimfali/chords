document.addEventListener('DOMContentLoaded', function() {
    const categoryList = document.getElementById('category-list');
    let currentPage = 1;
    let currentCategory = null;

    categoryList.addEventListener('click', function(e) {
        const category = e.target.closest('.category');
        if (category) {
            const categoryId = category.dataset.id;
            const carousel = category.querySelector('.product-carousel');

            if (carousel.style.display === 'grid') {
                carousel.style.display = 'none';
                currentCategory = null;
            } else {
                if (currentCategory) {
                    currentCategory.querySelector('.product-carousel').style.display = 'none';
                }
                carousel.style.display = 'grid';
                currentCategory = category;
                currentPage = 1;
                loadProducts(categoryId, carousel);
            }
        }
    });

    function loadProducts(categoryId, carousel) {
        fetch(`/api/products/?category=${categoryId}&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(product => {
                    const productCard = createProductCard(product);
                    carousel.appendChild(productCard);
                });
                currentPage++;

                // Добавляем наблюдатель для бесконечной загрузки
                if (currentPage === 2) {  // Только для первой загрузки
                    observeLastProduct(carousel, categoryId);
                }
            });
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} руб.</p>
        `;
        return card;
    }

    function observeLastProduct(carousel, categoryId) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadProducts(categoryId, carousel);
            }
        }, { threshold: 0.1 });

        observer.observe(carousel.lastElementChild);
    }
});