import { Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from '../pages/login';
import Projetos from '../pages/projetos';
import ProjetoDetalhe from '../pages/projetoDetalhe';
import ProtectedRoute from './protectedRoute'; // Suponho que você tenha rotas protegidas
import { ToastContainer } from 'react-toastify';
import Layout from '../layout/layout';

import Componentes from '../pages/components';
import ApiDetalhe from '../pages/apiDetalhe';
import Apis from '../pages/apis';
import EndpointDetalhe from '../pages/endpointDetalhe';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="projetos" element={<Projetos />} />
          <Route path="projeto" element={<ProjetoDetalhe />} />
          <Route path='apis' element={<Apis />} />
          <Route path='api' element={<ApiDetalhe />} />
          <Route path='endpoint' element={<EndpointDetalhe />} />
          <Route path='componentes' element={<Componentes />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
