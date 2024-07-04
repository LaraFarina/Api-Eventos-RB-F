import "dotenv/config";

const BASE_URL = process.env.BASE_URL;

export class PaginationDto {
  constructor(limit, offset, nextPage, total) {
    this.limit = limit;
    this.offset = offset;
    this.nextPage = nextPage;
    this.total = total;
  }
}

export class Pagination {
  constructor() {
    this.limitRegex = /limit=\d+/;
    this.offsetRegex = /offset=\d+/;
  }

  parseLimit(limit) {
    return !isNaN(parseInt(limit)) ? parseInt(limit) : 2; 
  }

  parseOffset(offset) {
    return !isNaN(parseInt(offset)) ? parseInt(offset) : 0; 
  }

  buildPaginationDto(limit, currentOffset, total, path, basePath) {
    const nextPage =
      limit !== -1 && limit + currentOffset < total
        ? this.buildNextPage(path, limit, currentOffset, basePath)
        : null;
    return new PaginationDto(limit, currentOffset, nextPage, total);
  }

  buildNextPage(path, limit, currentOffset, basePath) {
    let url = BASE_URL + basePath + path;
    url = this.limitRegex.test(url)
      ? url.replace(this.limitRegex, `limit=${limit}`)
      : `${url}${url.includes("?") ? "&" : "?"}limit=${limit}`;

    url = this.offsetRegex.test(url)
      ? url.replace(this.offsetRegex, `offset=${currentOffset + limit}`)
      : `${url}${url.includes("?") ? "&" : "?"}offset=${currentOffset + limit}`;

    return url;
  }
}