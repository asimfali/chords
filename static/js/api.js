import { loadingState } from './state.js';
import { createProductCard } from './productCard.js';

export const loadProducts = async (categoryId, container, limit = 10) => {
    if (loadingState.isLoading || loadingState.reachedEnd) return Promise.resolve();

    loadingState.isLoading = true;

    try {
        const response = await axios.get(`/api/products/`, {
            params: {
                category: categoryId,
                page: loadingState.currentPage,
                limit: limit
            }
        });

        const data = response.data;
        if (data.length === 0) {
            loadingState.reachedEnd = true;
        } else {
            data.forEach(product => {
                const productCard = createProductCard(product);
                container.appendChild(productCard);
            });
            loadingState.currentPage++;
        }
        loadingState.isLoading = false;
    } catch (error) {
        console.error('Error loading products:', error);
        loadingState.isLoading = false;
    }
};
