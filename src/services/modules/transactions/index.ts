import { api } from '@/services/api'
import getUserTransactions from './getUserTransactions'
import createNewTransaction from './createNewTransaction'
import editTransaction from './editTransaction'
import deleteTransaction from './deleteTransaction'

export const transactionsApi = api.injectEndpoints({
  endpoints: build => ({
    getUserTransactions: getUserTransactions(build),
    createNewTransaction: createNewTransaction(build),
    editTransaction: editTransaction(build),
    deleteTransaction: deleteTransaction(build),
  }),
  overrideExisting: true,
})

export const {} = transactionsApi
