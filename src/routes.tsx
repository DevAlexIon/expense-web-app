import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ModalProvider } from '@/context/modalContext'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route
            index
            path='/'
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
