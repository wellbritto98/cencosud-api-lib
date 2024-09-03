
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
const App = () => {
  const exampleData = useSelector((state) => state.example);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  const handleAction = () => {
    dispatch({ type: 'ACTION_TYPE', payload: { key: 'value' } });
  };

  const handleClick = () => {
    navigate('/example'); // Navega para a rota /example
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Redux Example
      </Typography>
      <Typography variant="body1">
        {JSON.stringify(exampleData)}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAction} sx={{ mt: 2 }}>
        Dispatch Action
      </Button>
      {/* Botão para navegar para /example */}
      <Button variant="contained" color="secondary" onClick={handleClick} sx={{ mt: 2 }}>
        Go to example page
      </Button>
    </Box>
  );
};

export default App;
