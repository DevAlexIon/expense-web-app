import { BrowserRouter, Routes, Route } from 'react-router'
import { ModalProvider } from '@/context/modalContext'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'

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
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
