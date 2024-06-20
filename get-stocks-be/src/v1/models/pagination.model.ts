export type Pagination = {
  page?: number
  limit?: number
  where?: object
  orderBy?: object
  select?: object
  include?: object
  distinct?: object
  cursor?: object
  sort?: string
  direction?: ['asc', 'desc']
}

export default Pagination
