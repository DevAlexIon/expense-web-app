import { createRoot } from 'react-dom/client'
import AppRoutes from '@/routes'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store'
import '@/index.css'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </PersistGate>
  </Provider>,
)
