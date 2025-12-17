import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { JSX } from 'react';
import type { RootState } from '@app/providers/store';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuth ? children : <Navigate to="/home" replace />;
}
