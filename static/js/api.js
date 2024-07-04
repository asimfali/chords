import { loadingState } from './state.js';
import { createProductCard } from './productCard.js';

export function loadProducts(categoryId, container, limit = 10) {
    if (loadingState.isLoading || loadingState.reachedEnd) return Promise.resolve();

    loadingState.isLoading = true;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/products/?category=${categoryId}&page=${loadingState.currentPage}&limit=${limit}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.length === 0) {
                    console.log('No more products to load');
                    loadingState.reachedEnd = true;
                } else {
                    data.forEach(product => {
                        const productCard = createProductCard(product);
                        container.appendChild(productCard);
                    });
                    loadingState.currentPage++;
                }
                loadingState.isLoading = false;
                resolve();
            } else {
                console.error('Error loading products:', xhr.statusText);
                loadingState.isLoading = false;
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = function() {
            console.error('Network error occurred');
            loadingState.isLoading = false;
            reject(new Error('Network error'));
        };
        xhr.send();
    });
}