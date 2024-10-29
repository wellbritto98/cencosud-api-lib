import React, { useCallback, useState } from "react";
import { TextField, Select, MenuItem, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import GenericDataGrid from "../components/GenericDataGrid";
import { useHandleDelete } from "../hooks/useHandleDelete";
import { api } from "../shared/api";
import { ProjectApi, ApiInstanceApi, UpdateProjectDto, InsertApiInstanceDto } from "../shared/apiSwaggerGen/api";
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { InsertApiInstanceForm } from "../components/InsertApiInstanceForm";

const ProjetoDetalhe = () => {
  const location = useLocation();
  const projectApi = new ProjectApi(undefined, '', api);
  const apiInstancesApi = new ApiInstanceApi(undefined, '', api);

  const projectData = location.state;
  const projectId = projectData?.id;

  const [name, setName] = useState(projectData?.name || '');
  const [description, setDescription] = useState(projectData?.description || '');
  const [status, setStatus] = useState(projectData?.status || '');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const fetchApiInstances = useCallback(() => projectApi.apiProjectGetApiInstancesGet(projectId), [projectId]);

  const handleSave = async () => {
    const updateProjectDto: UpdateProjectDto = { name, description, status };
    try {
      await projectApi.apiProjectUpdatePut(projectId, updateProjectDto);
      toast.success("Projeto atualizado com sucesso!");
      setIsSaveDisabled(true);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Erro ao atualizar o projeto. Por favor, tente novamente.");
    }
  };

  const deleteApiInstance = async (projectId, apiId) => {
    await apiInstancesApi.apiApiInstanceDeleteDelete(projectId, apiId);
  };
  const [rows, setRows] = React.useState([]); // State para armazenar os dados
  const handleDelete = useHandleDelete(fetchApiInstances, deleteApiInstance, "ApiInstance", setRows);

  const createProject = async (data) => {
    await apiInstancesApi.apiApiInstanceCreatePost(data);
  };

  const columns = [
    { field: 'id', headerName: 'API ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'baseUrl', headerName: 'Base URL', flex: 1 },
    { field: 'version', headerName: 'Version', width: 110 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary">
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(projectId, params.row.id)} // Passe ambos os IDs quando disponível
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const initialInsertDto = {
    projectId: projectId, // Project ID fixo
    apiId: 1, // Valor inicial do API ID
  };

  const transformData = (data) => data.map((item) => ({
    id: item.api?.id,
    name: item.api?.name ?? '',
    description: item.api?.description ?? '',
    baseUrl: item.api?.baseUrl ?? '',
    version: item.api?.version ?? '',
  }));

  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detalhes do Projeto: {projectData?.name}
      </Typography>

      <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
        <TextField label="Id" value={projectId} sx={{ width: "10%" }} disabled />
        <TextField
          label="Nome"
          value={name}
          sx={{ width: "40%" }}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Descrição"
          value={description}
          sx={{ width: "40%" }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Status"
          value={status}
          sx={{ width: "10%" }}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "10%" }}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Salvar
        </Button>
      </Paper>

      <GenericDataGrid
        title="Lista de Apis"
        columns={columns}
        fetchData={fetchApiInstances}
        createData={createProject}
        entityName="ApiInstance"
        insertDto={initialInsertDto}
        transformData={transformData}
        rowsT={rows}
        customInsertContent={(formData, handleInputChange) => (
          <InsertApiInstanceForm formData={formData} handleInputChange={handleInputChange} projectId={projectId} />
        )}
      />
    </Box>
  );
};

export default ProjetoDetalhe;
