export const loadingState = {
    isLoading: false,
    reachedEnd: false,
    currentPage: 1
};

export const resetLoadingState = () => {
    loadingState.isLoading = false;
    loadingState.reachedEnd = false;
    loadingState.currentPage = 1;
};
