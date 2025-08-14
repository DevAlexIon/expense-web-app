import { combineReducers } from 'redux'
import { configureStore, isRejected, Middleware } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import storage from 'redux-persist/lib/storage'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import { bigIntSerializer, showToast } from '@/helpers/utils'
import general from '@/store/slices/general'

const persistConfig = {
  key: 'root-v1.0.0',
  storage,
  whitelist: ['auth', 'deviceRegistration'],
  serialize: true,
  transforms: [
    {
      in: (state: any) => {
        return JSON.parse(
          JSON.stringify(state, (_, value) =>
            bigIntSerializer.serialize(value),
          ),
        )
      },
      out: (state: any) => {
        const parseValue = (obj: any): any => {
          if (typeof obj !== 'object' || obj === null) return obj

          if (obj._type === 'BigInt') {
            return bigIntSerializer.deserialize(obj)
          }

          for (const key in obj) {
            obj[key] = parseValue(obj[key])
          }
          return obj
        }

        return parseValue(state)
      },
    },
  ],
}

const reducers = combineReducers({
  general,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const enhancers = [] as any[]

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        isSerializable: (value: unknown) => {
          if (typeof value === 'bigint') {
            return true
          }
          return true
        },
        serialize: bigIntSerializer.serialize,
        deserialize: bigIntSerializer.deserialize,
      },
    }).concat(api.middleware as Middleware)

    return middlewares
  },
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers({
      autoBatch: false,
    }).concat(enhancers),
})

const persistor = persistStore(store)

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export { store, persistor }
