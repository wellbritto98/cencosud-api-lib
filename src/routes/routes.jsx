import { Routes, Route } from 'react-router-dom';
import App from '../App';
import ExampleComponent from '../pages/exampleComponent';
import ProtectedRoute from './protectedRoute';
import Login from '../pages/login';
import Projetos from '../pages/projetos';
import ProjetoDetalhe from '../pages/projetoDetalhe';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route 
        path="/projetos" 
        element={<Projetos/>}
      />
      <Route path="/projeto/:id" element={<ProjetoDetalhe/>} />
    </Routes>
  );
};

export default AppRoutes;
