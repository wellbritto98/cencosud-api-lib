import { ProjectApi, InsertProjectDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import React from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete";
import GenericDataGrid from "../components/GenericDatagrid";
import { GridColDef } from "@mui/x-data-grid";
import { getProjectStatusName } from "../shared/enums/projectStatus";
import InsertProjectForm from "../components/InsertProjectForm";


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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'description', headerName: 'Descrição', flex: 1 },
    {
      field: 'status', // Campo para exibir o alias
      headerName: 'Status',
      width: 110,
      valueGetter: (value) => {
            return getProjectStatusName(value)
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleDetailClick(params.row)} // Passa a linha completa
          >
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
    status: 0,
  };

  return (
    <GenericDataGrid
      title="Lista de Projetos"
      columns={columns}
      fetchData={fetchProjects}
      createData={createProject}
      entityName="Projeto"
      insertDto={initialInsertDto} // Passar um objeto inicial do tipo InsertProjectDto
      customInsertContent={(formData, handleInputChange) => (
        <InsertProjectForm formData={formData} handleInputChange={handleInputChange} />
      )}
    />
  );
};

export default Projetos;
