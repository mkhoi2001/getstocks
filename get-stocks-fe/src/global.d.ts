import { Pagination } from 'swiper';
declare global {
    type Pagination = {
        page?: number;
        limit?: number;
        sort?: string | null;
        direction?: string | null;
    };
}

export { Pagination };
