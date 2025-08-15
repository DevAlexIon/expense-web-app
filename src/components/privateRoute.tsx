import { selectUser } from '@/store/slices/general'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const userInfo = useSelector(selectUser)

  if (!userInfo?.token) {
    return <Navigate to='/login' replace />
  }

  return <>{children}</>
}

export default PrivateRoute
