import { createRoot } from 'react-dom/client'
import AppRoutes from '@/routes'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import '@/index.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Toaster />
      <AppRoutes />
    </PersistGate>
  </Provider>,
)
