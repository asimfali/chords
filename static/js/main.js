import { initializeCategoryClick } from './categoryClickHandler.js';
import { initializeModal } from './modalHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('category-list');
    const modal = document.getElementById('specs-modal');

    if (!categoryList) {
        console.error('Category list not found');
        return;
    }

    initializeCategoryClick(categoryList);
    initializeModal(modal);
});
