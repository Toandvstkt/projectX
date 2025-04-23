
export const calculateTotalPages = (totalItems, rowsPerPage) => {
    return Math.ceil(totalItems / rowsPerPage);
};


export const getPageItems = (items, currentPage, rowsPerPage) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return items?.slice(startIndex, startIndex + rowsPerPage);
};


export const nextPage = (currentPage, totalPages) => {
    return currentPage < totalPages ? currentPage + 1 : currentPage;
};


export const previousPage = (currentPage) => {
    return currentPage > 1 ? currentPage - 1 : currentPage;
};
