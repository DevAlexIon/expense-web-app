import { EndpointBuilder } from '@reduxjs/toolkit/query'

export interface DeleteTransactionPayload {
  id: string
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<void, DeleteTransactionPayload>({
    query: ({ id }) => ({
      url: `/transactions/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['Transactions'],
  })
