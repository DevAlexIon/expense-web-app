import { EndpointBuilder } from '@reduxjs/toolkit/query'

export interface TransactionResponse {
  _id: string
  user: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
  updatedAt: string
}

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<TransactionResponse[], void>({
    query: () => ({
      url: '/transactions',
      method: 'GET',
    }),
    providesTags: ['Transactions'],
  })
