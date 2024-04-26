function generarLimitOffset(pageSize, page) {
    if (!pageSize || !page || pageSize <= 0 || page <= 0) {
        throw new Error('El tamaño de página y el número de página son obligatorios y deben ser mayores que cero.');
    }
    const offset = (page - 1) * pageSize;
    const limitOffsetClause = `LIMIT ${pageSize} OFFSET ${offset}`;
    return limitOffsetClause;
}

export default generarLimitOffset;