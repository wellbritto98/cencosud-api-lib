import { Routes, Route } from 'react-router-dom';
import App from '../App';
import ExampleComponent from '../pages/exampleComponent';
import ProtectedRoute from './protectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route 
        path="/example" 
        element={<ProtectedRoute element={<ExampleComponent />} />} 
      />
    </Routes>
  );
};

export default AppRoutes;
