import { Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from '../pages/login';
import Projetos from '../pages/projetos';
import ProjetoDetalhe from '../pages/projetoDetalhe';
import ProtectedRoute from './protectedRoute'; // Suponho que você tenha rotas protegidas
import { ToastContainer } from 'react-toastify';
import Layout from '../layout/layout';
import Apis from '../pages/Apis';

import Componentes from '../pages/components';

const AppRoutes = () => {
  return (
    <>
      <ToastContainer /> {/* Para exibir notificações em todas as páginas */}
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
          <Route path='componentes' element={<Componentes />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
