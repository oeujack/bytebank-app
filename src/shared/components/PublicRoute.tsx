import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { JSX } from 'react';
import type { RootState } from '@app/providers/store';

interface PublicRouteProps {
  children: JSX.Element;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
