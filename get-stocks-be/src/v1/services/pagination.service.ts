import HttpException from '../errors/httpException'
import Pagination from '../models/pagination.model'

const LIMIT_SIZE = 3

export const getResultPaginate = async (Model: any, { page = 0, limit = LIMIT_SIZE, ...query }: Pagination) => {
  if (query.sort && query.direction) {
    query.orderBy = {
      [query.sort]: query.direction
    }
    delete query.direction
    delete query.sort
  }

  const totalItems = Model.count()

  if (typeof page !== 'number') page = +page
  if (typeof limit !== 'number') limit = +limit
  if (isNaN(page) && isNaN(limit)) {
    throw new HttpException(422, 'Tham số không hợp lệ!!!')
  }

  const contentPromise = Model.findMany({
    skip: page * limit,
    take: limit,
    ...query
  })

  const [total, content] = await Promise.all([totalItems, contentPromise])
  const totalPages: number = Math.ceil(total / limit)
  return {
    content,
    total,
    page,
    totalPages,
    first: page === 0,
    last: page === totalPages - 1,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
    nextPage: page + 1 <= totalPages ? page + 1 : totalPages,
    prevPage: page - 1 >= 0 ? page - 1 : 0
  }
}

export default { getResultPaginate }
