import { createParamDecorator } from '@nestjs/common';

export const Pagination = createParamDecorator((data, req) => {
    return {
        page: req.query.page || 1,
        limit: Math.min(
            req.query.limit || parseInt(process.env.RESPONSE_PAGE_SIZE, 10) || 10,
            parseInt(process.env.MAX_RESPONSE_PAGE_SIZE, 10) || 100),
        offset: (this.page - 1) * this.limit,
    };
});

export const PaginationApiDescription = {
    page: {name: 'page', type: Number, required: false, description: 'Page number' },
    limit: {name: 'limit', type: Number, required: false, description: 'Results on page' },
};
