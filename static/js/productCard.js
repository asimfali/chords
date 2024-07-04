export const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'swiper-slide';
    card.innerHTML = `
        <div class="product-card" id="product-${product.id}">
            <img src="${product.image || '/static/images/placeholder.jpg'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} руб.</p>
            <div class="product-buttons">
                <button class="add-to-cart">В корзину</button>
                <button class="view-specs">Технические характеристики</button>
            </div>
        </div>
    `;
    return card;
};
