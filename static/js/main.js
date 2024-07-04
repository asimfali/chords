import { initializeCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('category-list');
    const modal = document.getElementById('specs-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal.querySelector('.close');
    let currentCategoryId = null;
    let currentCarousel = null;

    if (!categoryList) {
        console.error('Category list not found');
        return;
    }

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

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            e.stopPropagation();
            const productId = e.target.closest('.product-card').id.split('-')[1];
            console.log('Добавлено в корзину:', productId);
        } else if (e.target.classList.contains('view-specs')) {
            e.stopPropagation();
            const productCard = e.target.closest('.product-card');
            const productId = productCard.id.split('-')[1];
            const productName = productCard.querySelector('h3').textContent;
            showSpecs(productId, productName);
        }
    });

    const showSpecs = (productId, productName) => {
        modalTitle.textContent = `Характеристики: ${productName}`;
        modalBody.innerHTML = `
            <p>Здесь будут отображаться характеристики товара с ID: ${productId}</p>
            <ul>
                <li>Характеристика 1: Значение 1</li>
                <li>Характеристика 2: Значение 2</li>
                <li>Характеристика 3: Значение 3</li>
            </ul>
        `;
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
