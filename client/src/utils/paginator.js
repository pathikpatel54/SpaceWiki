export const Paginator = (items, page, per_page) => {
    per_page = per_page || 10;
    page = page || 1;
    var offset = (page - 1) * per_page,
        paginatedItems = items.slice(offset).slice(0, per_page),
        total_pages = Math.ceil(items.length / per_page);
    return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        data: paginatedItems,
    };
};
