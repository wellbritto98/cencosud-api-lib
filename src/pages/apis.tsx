import { ApiApi, InsertApiDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import React from "react";
import GenericDataGrid from "../components/GenericDatagrid";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete"; 

const Apis = () => {
  const apiApi = new ApiApi(undefined, '', api);

  const fetchApis = () => apiApi.apiApiGetAllGet();

  const createApi = async (data: InsertApiDto): Promise<void> => {
    await apiApi.apiApiCreatePost(data);
  };

  const deleteApi = async (id: number): Promise<void> => {
    await apiApi.apiApiDeleteDelete(id);
  };

  // Usando hooks genéricos para manipulação
  const handleDetailClick = useHandleDetailClick("/api");
  const [rows, setRows] = React.useState([]); // State para armazenar os dados

  const handleDelete = useHandleDelete(fetchApis, deleteApi, "Api", setRows);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'baseUrl', headerName: 'Base Url', width: 300 },
    { field: 'version', headerName: 'Version', width: 110 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleDetailClick(params.row.id)}>
            <OpenInNewIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Criar um objeto de InsertApiDto como padrão para inicializar os campos
  const initialInsertDto: InsertApiDto = {
    name: '',
    description: '',
    baseUrl: '',
    version: '',
  };

  return (
    <GenericDataGrid
      title="Lista de Apis"
      columns={columns}
      fetchData={fetchApis}
      createData={createApi}
      deleteData={deleteApi}
      detailUrl="/api"
      entityName="api"
      insertDto={initialInsertDto} // Passar um objeto inicial do tipo InsertApiDto
    />
  );
};

export default Apis;
