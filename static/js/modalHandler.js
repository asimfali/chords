export const initializeModal = (modal) => {
    const modalTitle = modal.querySelector('#modal-title');
    const modalBody = modal.querySelector('#modal-body');
    const closeBtn = modal.querySelector('.close');

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
        } else if (e.target.classList.contains('view-docs')) {
            e.stopPropagation();
            const url = e.target.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
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
};