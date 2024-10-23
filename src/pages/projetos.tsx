import { ProjectApi, InsertProjectDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import React from "react";
import GenericDataGrid from "../components/GenericDatagrid";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete"; 

const Projetos = () => {
  const projectApi = new ProjectApi(undefined, '', api);

  const fetchProjects = () => projectApi.apiProjectGetAllGet();

  const createProject = async (data: InsertProjectDto): Promise<void> => {
    await projectApi.apiProjectCreatePost(data);
  };

  const deleteProject = async (id: number): Promise<void> => {
    await projectApi.apiProjectDeleteDelete(id);
  };

  // Usando hooks genéricos para manipulação
  const handleDetailClick = useHandleDetailClick("/projeto");
  const [rows, setRows] = React.useState([]); // State para armazenar os dados

  const handleDelete = useHandleDelete(fetchProjects, deleteProject, "Projeto", setRows);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'description', headerName: 'Descrição', width: 300 },
    { field: 'status', headerName: 'Status', width: 110 },
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

  // Criar um objeto de InsertProjectDto como padrão para inicializar os campos
  const initialInsertDto: InsertProjectDto = {
    name: '',
    description: '',
    status: '',
  };

  return (
    <GenericDataGrid
      title="Lista de Projetos"
      columns={columns}
      fetchData={fetchProjects}
      createData={createProject}
      deleteData={deleteProject}
      detailUrl="/projeto"
      entityName="Projeto"
      insertDto={initialInsertDto} // Passar um objeto inicial do tipo InsertProjectDto
    />
  );
};

export default Projetos;
