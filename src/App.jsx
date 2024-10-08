
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import login from './pages/login';
import projetos from './pages/projetos';
import Login from './pages/login';
const App = () => {

  return (
    <Login/>
  );
};

export default App;
