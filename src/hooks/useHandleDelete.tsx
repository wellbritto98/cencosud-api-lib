import { toast } from 'react-toastify';

export const useHandleDelete = (fetchData, deleteData, entityName, setRows) => {
  const handleDelete = async (id1, id2 = null) => {
    if (window.confirm(`Você tem certeza que deseja deletar este ${entityName}?`)) {
      try {
        await deleteData(id1, id2);
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
