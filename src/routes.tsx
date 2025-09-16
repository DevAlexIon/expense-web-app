import { BrowserRouter, Routes, Route } from 'react-router'
import { ModalProvider } from '@/context/modalContext'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import PrivateRoute from './components/privateRoute'
import { Settings } from './pages/Settings'
import Reports from './pages/Reports'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route
            index
            path='/'
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/reports'
            element={
              <Layout>
                <Reports />
              </Layout>
            }
          />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
