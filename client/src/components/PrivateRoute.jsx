import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

function PrivateRoute({ children, roles = [] }) {
  const { user } = useAuthStore()

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role if roles specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
