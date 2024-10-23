import { ComponentApi, InsertComponentDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import React from "react";
import GenericDataGrid from "../components/GenericDatagrid";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete"; 

const Componentes = () => {
  const componentApi = new ComponentApi(undefined, '', api);

  const fetchComponents = () => componentApi.apiComponentGetAllGet();

  const createComponent = async (data: InsertComponentDto): Promise<void> => {
    await componentApi.apiComponentCreatePost(data);
  };

  const deleteComponent = async (id: number): Promise<void> => {
    await componentApi.apiComponentDeleteDelete(id);
  };

  // Usando hooks genéricos para manipulação
  const handleDetailClick = useHandleDetailClick("/api");
  const [rows, setRows] = React.useState([]); // State para armazenar os dados

  const handleDelete = useHandleDelete(fetchComponents, deleteComponent, "Component", setRows);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'type', headerName: 'Type', width: 300 },
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

  // Criar um objeto de InsertComponentDto como padrão para inicializar os campos
  const initialInsertDto: InsertComponentDto = {
    type: 0,
    description: '',
  };

  return (
    <GenericDataGrid
      title="Lista de Components"
      columns={columns}
      fetchData={fetchComponents}
      createData={createComponent}
      deleteData={deleteComponent}
      detailUrl="/component"
      entityName="component"
      insertDto={initialInsertDto} // Passar um objeto inicial do tipo InsertComponentDto
    />
  );
};

export default Componentes;
