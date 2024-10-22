
import { Button} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate

function ExampleComponent() {
  const navigate = useNavigate(); // Inicializa o hook useNavigate
  const handleClick = () => {
    navigate('/'); // Navega para a rota /example
  };
    return (
      <div>
        <h2>Example Component Page</h2>
        <p>This is the example component content.</p>
        <Button variant="contained" color="secondary" onClick={handleClick} sx={{ mt: 2 }}>
        Go to main page
      </Button>
      </div>
      
    );
  }
  
  export default ExampleComponent;
  