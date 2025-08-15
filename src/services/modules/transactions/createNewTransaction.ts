import { EndpointBuilder } from '@reduxjs/toolkit/query'
import { TransactionResponse } from './getUserTransactions'

export interface CreateTransactionPayload {
  body: {
    type: 'income' | 'expense'
    amount: number
    category: string
    description: string
    date: string
  }
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<TransactionResponse, CreateTransactionPayload>({
    query: payload => ({
      url: '/transactions',
      method: 'POST',
      body: payload.body,
    }),
    invalidatesTags: ['Transactions'],
  })
