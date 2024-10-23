import { useNavigate } from "react-router-dom";

// Hook personalizado para navegação
export const useHandleDetailClick = (detailUrl: string) => {
  const navigate = useNavigate(); // O useNavigate deve ser usado dentro do hook

  const handleDetailClick = (id: number) => {
    navigate(`${detailUrl}/${id}`);
  };

  return handleDetailClick;
};
