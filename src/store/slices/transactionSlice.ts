import { transactionsApi } from '@/services/modules/transactions'
import { TransactionResponse } from '@/services/modules/transactions/getUserTransactions'
import { RootState } from '@/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type GeneralInitialState = {
  transactions: TransactionResponse[]
  loading: boolean
}

const initialState: GeneralInitialState = {
  transactions: [],
  loading: false,
}

export const getUserTransactions = createAsyncThunk(
  'transaction/getUserTransactions',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        transactionsApi.endpoints.getUserTransactions.initiate(),
      ).unwrap()
      dispatch(setTransactions(result))
      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

export const createNewTransaction = createAsyncThunk(
  'transaction/createNewTransaction',
  async (
    payload: {
      type: 'income' | 'expense'
      amount: number
      category: string
      description: string
      date: string
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const result = await dispatch(
        transactionsApi.endpoints.createNewTransaction.initiate({
          body: payload,
        }),
      ).unwrap()

      dispatch(addTransactionToState(result))

      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

export const editTransaction = createAsyncThunk(
  'transaction/editTransaction',
  async (
    payload: {
      id: string
      type: 'income' | 'expense'
      amount: number
      category: string
      description: string
      date: string
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const result = await dispatch(
        transactionsApi.endpoints.editTransaction.initiate({
          id: payload.id,
          body: {
            type: payload.type,
            amount: payload.amount,
            category: payload.category,
            description: payload.description,
            date: payload.date,
          },
        }),
      ).unwrap()
      dispatch(updateTrasactionInState(result))

      return result
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(
        transactionsApi.endpoints.deleteTransaction.initiate({ id }),
      ).unwrap()
      dispatch(removeTransactionFromState(id))
    } catch (err: any) {
      return rejectWithValue(err.data || err.message)
    }
  },
)

const transaction = createSlice({
  name: 'transaction',
  initialState: initialState,
  reducers: {
    setTransactions: (
      state,
      { payload }: PayloadAction<TransactionResponse[]>,
    ) => {
      state.transactions = payload
    },
    removeTransactionFromState: (
      state,
      { payload: id }: PayloadAction<string>,
    ) => {
      state.transactions = state.transactions.filter(t => t._id !== id)
    },
    updateTrasactionInState: (
      state,
      { payload }: PayloadAction<TransactionResponse>,
    ) => {
      const index = state.transactions.findIndex(t => t._id === payload._id)
      if (index !== -1) {
        state.transactions[index] = payload
      }
    },
    addTransactionToState: (
      state,
      { payload }: PayloadAction<TransactionResponse>,
    ) => {
      state.transactions.push(payload)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserTransactions.pending, state => {
        state.loading = true
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
      })
      .addCase(getUserTransactions.rejected, state => {
        state.loading = false
      })
  },

  // },
})

export const selectTransactions = (state: RootState) =>
  state.transaction.transactions

export const {
  setTransactions,
  removeTransactionFromState,
  updateTrasactionInState,
  addTransactionToState,
} = transaction.actions

export default transaction.reducer
