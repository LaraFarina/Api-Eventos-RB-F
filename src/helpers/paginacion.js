// function generarLimitOffset(pageSize, page) {
//     if (!pageSize || !page || pageSize <= 0 || page <= 0) {
//         throw new Error('El tamaño de página y el número de página son obligatorios y deben ser mayores que cero.');
//     }
//     const offset = (page - 1) * pageSize;
//     const limitOffsetClause = `LIMIT ${pageSize} OFFSET ${offset}`;
//     return limitOffsetClause;
// }

// export default generarLimitOffset;

export class PaginationDto{
    limit;
    offset;
    nextPage;
    total;
}

export class Pagination{
    parseLimit(limit){
        return !isNaN(parseInt(limit)) ? parseInt(limit) : 15;
    }
    parseOffset(offset){
        return !isNaN(parseInt(offset)) ? parseInt(offset) : 0;
    }
    buildPaginationDto(limit,currentOffset,total, path){
        const response = new PaginationDto();
        response.limit = limit;
        response.offset = currentOffset;
        response.total = total;
        if(limit !== -1){
            response.nextPage = limit + currentOffset < total ? this.buildNextPage(path,limit,currentOffset,total) : null;
        }
        return response;
    }

}

// const response = {
// collection: events,
// pagination: {
//     limit: parsedLimit ,
//     offset: parsedOffset,
//     nextPage:((parsedOffset + 1) * parsedLimit <= totalCount) ? `${ process.env.BASE_URL} / ${ path } ?limit= ${ parsedLimit } &offset= ${ parsedOffset + 1 }${ ( eventName ) ? `&eventName= ${ eventName } ` : null}${ ( eventCategory ) ? `&eventCategory= ${ eventCategory } ` : null} ${ ( eventDate ) ? `&eventDate= ${ eventDate } ` : null}${ ( eventTag ) ? `&eventTag= ${ eventTag } ` : null} ` : null , 
//     total: totalCount
//     }
// }



