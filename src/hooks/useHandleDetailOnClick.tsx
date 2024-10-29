import { useNavigate } from 'react-router-dom';

export const useHandleDetailClick = (url: string) => {
  const navigate = useNavigate();
  return (data) => {
    navigate(url, { state: data }); // Envia os dados da linha como `state`
  };
};
