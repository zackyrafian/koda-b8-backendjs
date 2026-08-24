export function parsePagination(query) { 
  const { page, limit } = query; 
  const pageNum = page !== undefined ? (parseInt(page) || 1) : null; 
  const limitNum = limit !== undefined ? parseInt(limit || 10) : null 
  const paginate = pageNum !== null || limitNum !== null 
  return { pageNum, limitNum, paginate } 
}

export function paginationOptions(pageNum, limitNum, paginate) { 
  if (!paginate) return { }
  return { 
    limit: limitNum ?? 10, 
    offset: ((pageNum ?? 1) -1) * (limitNum ?? 10)
  }
}

export function paginationMeta(count, pageNum, limitNum, paginate) { 
  if (!paginate) return null;
  const totalPages = Math.ceil(count / (limitNum ?? 10)); 
  const currentPage = pageNum ?? 1;
  return { 
    total: count, 
    page: currentPage, 
    limit: limitNum, 
    totalPages, 
    nextPage: currentPage < totalPages ? currentPage + 1 : null, 
    prevPage: currentPage > 1 ? currentPage - 1: null,
  }
}