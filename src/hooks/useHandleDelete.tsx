import { toast } from 'react-toastify';

export const useHandleDelete = (fetchData, deleteData, entityName, setRows) => {
  const handleDelete = async (id) => {
    if (window.confirm(`Você tem certeza que deseja deletar este ${entityName}?`)) {
      try {
        await deleteData(id);
        const response = await fetchData();
        setRows(response.data);
        toast.success(`${entityName} deletado com sucesso!`);
      } catch (error) {
        toast.error(`Erro ao deletar ${entityName}, tente novamente!`);
      }
    }
  };

  return handleDelete;
};
