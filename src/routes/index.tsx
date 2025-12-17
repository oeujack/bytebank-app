import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { PrivateRoute, PublicRoute } from '@shared/components';
import { Layout } from '@features/common/pages/Layout';
import { Loading } from '@shared/components/Loading';

// Lazy loading das páginas para melhor performance
const PageDashboard = lazy(() => import('@features/dashboard/pages'));
const PageBoleto = lazy(() => import('@features/boleto/pages'));
const PageDeposito = lazy(() => import('@features/deposito/pages'));
const PageExtrato = lazy(() => import('@features/extrato/pages'));
const PageTransferir = lazy(() => import('@features/transferencia/pages'));
const PageHome = lazy(() => import('@features/home/pages'));
const PageNotFound = lazy(() => import('@features/common/pages/NotFound'));

export default function Rotas() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/boleto"
          element={
            <PrivateRoute>
              <PageBoleto />
            </PrivateRoute>
          }
        />
        <Route
          path="/deposito"
          element={
            <PrivateRoute>
              <PageDeposito />
            </PrivateRoute>
          }
        />
        <Route
          path="/extrato"
          element={
            <PrivateRoute>
              <PageExtrato />
            </PrivateRoute>
          }
        />
        <Route
          path="/transferir"
          element={
            <PrivateRoute>
              <PageTransferir />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route
        path="/home"
        element={
          <PublicRoute>
            <PageHome />
          </PublicRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Suspense>
  );
}
