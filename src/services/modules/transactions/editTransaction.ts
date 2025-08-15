import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { TransactionResponse } from './getUserTransactions'

export interface UpdateTransactionPayload {
  id: string
  body: {
    type: 'income' | 'expense'
    amount: number
    category: string
    description: string
    date: string
  }
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<TransactionResponse, UpdateTransactionPayload>({
    query: ({ id, body }) => ({
      url: `/transactions/${id}`,
      method: 'PATCH',
      body,
    }),
  })
