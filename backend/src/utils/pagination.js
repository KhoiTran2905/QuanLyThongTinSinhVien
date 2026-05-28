// src/utils/pagination.js

const getPagination = (page = 1, limit = 10) => {
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (currentPage - 1) * pageSize;

  return { currentPage, pageSize, offset };
};

const getPagingData = (totalItems, currentPage, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

module.exports = { getPagination, getPagingData };