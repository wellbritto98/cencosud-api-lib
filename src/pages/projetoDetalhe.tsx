import React, { useCallback, useEffect, useState } from "react";
import { TextField, Select, MenuItem, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../shared/api";
import { ProjectApi, ApiInstanceApi, UpdateProjectDto, ReadProjectDto, ProjectStatus, InsertApiInstanceDto } from "../shared/apiSwaggerGen/api";
import DeleteIcon from '@mui/icons-material/Delete';
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import GenericDataGrid from "../components/GenericDatagrid";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getProjectStatusName } from "../shared/enums/projectStatus";
import { useHandleDelete } from "../hooks/useHandleDelete";
import { InsertApiInstanceForm } from "../components/InsertApiInstanceForm";

const ProjetoDetalhe = () => {
  const location = useLocation();
  const projectApi = new ProjectApi(undefined, '', api);
  const apiInstancesApi = new ApiInstanceApi(undefined, '', api);

  const projectData = location.state as ReadProjectDto;
  const projectId = projectData?.id || 0; // Define um valor padrão para garantir que seja um número
  const [originalProject, setOriginalProject] = useState<ReadProjectDto | null>(null);
  const [name, setName] = useState(projectData?.name || '');
  const [description, setDescription] = useState(projectData?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(projectData?.status ?? ProjectStatus.NUMBER_0); // Define o tipo como ProjectStatus
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (projectData) {
      setOriginalProject(projectData);
    }
  }, [projectData]);

  useEffect(() => {
    if (
      projectData &&
      (name !== originalProject?.name ||
        description !== originalProject?.description ||
        status !== originalProject?.status)
    ) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
  }, [name, description, status, originalProject, projectData]);

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

  const deleteApiInstance = async (projectId: number, apiId: number) => {
    await apiInstancesApi.apiApiInstanceDeleteDelete(projectId, apiId);
  };
  const [rows, setRows] = useState([]);
  const handleDelete = useHandleDelete(fetchApiInstances, deleteApiInstance, "ApiInstance", setRows);

  const createProject = async (data: InsertApiInstanceDto) => {
    await apiInstancesApi.apiApiInstanceCreatePost(data);
  };
  const handleDetailClick = useHandleDetailClick("/api");

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
          <IconButton
            color="primary"
            onClick={() => handleDetailClick(params.row)}
          >
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(projectId, params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const initialInsertDto = {
    projectId: projectId,
    apiId: 1,
  };

  const transformData = (data) => data.map((item) => ({
    id: item.api?.id,
    name: item.api?.name ?? '',
    description: item.api?.description ?? '',
    baseUrl: item.api?.baseUrl ?? '',
    version: item.api?.version ?? '',
  }));

  const projectStatusOptions = Object.values(ProjectStatus)
    .filter((value) => typeof value === "number")
    .map((value) => (
      <MenuItem key={value} value={value as ProjectStatus}>
        {getProjectStatusName(value as ProjectStatus)}
      </MenuItem>
    ));

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
          select
          value={status}
          sx={{ width: "25%" }}
          onChange={(e) => setStatus(Number(e.target.value) as ProjectStatus)} // Converte para número antes de ProjectStatus
        >
          {projectStatusOptions}
        </TextField>

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
