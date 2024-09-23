export const PAGING: {
  DEFAULT_LIMIT: number;
  DEFAULT_PAGE: number;
  MIN_LIMIT: number;
  MAX_LIMIT: number;
  MIN_PAGE: number;
  MAX_PAGE: number;
} = {
  DEFAULT_LIMIT: 20,
  DEFAULT_PAGE: 0,
  MIN_LIMIT: 1,
  MAX_LIMIT: 200,
  MIN_PAGE: 1,
  MAX_PAGE: 100000,
};

export interface PagingRequest {
  readonly limit: number;
  readonly offset: number;
}

export interface PagingResponse<T> {
  readonly rows: T[];
  readonly count: number;
}

export class RequestUtil {
  public static getPagingRequest(page: number, limit: number): PagingRequest {
    if (!page || !limit) {
      return {
        limit: undefined,
        offset: undefined,
      };
    }
    return {
      limit: Number(limit),
      offset: page && page > 0 ? (page - 1) * Number(limit) : 0,
    };
  }

  public static getSortingRequest(sort: string): string[][] {
    const sorts = sort.split(',');
    return sorts.map((item) => {
      return item.split(':');
    });
  }

  public static getSortOrder(sort: string): number {
    return sort.toUpperCase() === 'ASC' ? 1 : -1;
  }

  public static getRequest(
    page: number,
    limit: number,
    sort: string,
  ): [PagingRequest, string[][]] {
    page = page ?? PAGING.DEFAULT_PAGE;
    limit = limit ?? PAGING.DEFAULT_LIMIT;

    const paging = RequestUtil.getPagingRequest(page, limit);
    const requestSort = sort ? RequestUtil.getSortingRequest(sort) : null;
    return [paging, requestSort];
  }
}
