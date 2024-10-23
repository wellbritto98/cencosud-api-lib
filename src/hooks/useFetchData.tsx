import { useState, useEffect } from 'react';

export const useFetchData = <T,>(fetchData: () => Promise<{ data: T[] }>, entityName: string): [T[], React.Dispatch<React.SetStateAction<T[]>>] => {
  const [rows, setRows] = useState<T[]>([]); // Tipagem genérica para os dados

  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await fetchData();
        setRows(response.data); // Define os dados corretamente
      } catch (error) {
        console.error(`Erro ao buscar ${entityName}:`, error);
      }
    };
    fetchRows();
  }, [fetchData, entityName]);

  return [rows, setRows]; // Retorna os dados e a função para atualizar os dados
};
