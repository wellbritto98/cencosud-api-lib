import React, { useState, useCallback, useEffect } from "react";
import { Box, Typography, Paper, TextField, Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useLocation } from "react-router-dom";
import { ApiInstanceApi, InsertApiInstanceDto, ProjectApi, ReadApiDto, UpdateProjectDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from "@mui/x-data-grid";
import { EditToolbar } from "../components/EditToolbarDatagrid";
import { useFetchData } from "../hooks/useFetchData";

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
  const [rows, setRows] = useFetchData(fetchApiInstances, "ApiInstance");
  const [formattedRows, setFormattedRows] = useState<ReadApiDto[]>([]);

  useEffect(() => {
    const transformedData: ReadApiDto[] = rows.map((item) => ({
      id: item.api?.id,
      name: item.api?.name ?? '',
      description: item.api?.description ?? '',
      baseUrl: item.api?.baseUrl ?? '',
      version: item.api?.version ?? '',
    }));
    setFormattedRows(transformedData);
  }, [rows]);

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

  const deleteApiInstance = async (projectId: number, apiId: number): Promise<void> => {
    await apiInstancesApi.apiApiInstanceDeleteDelete(projectId, apiId);
    toast.success("API Instance deletada com sucesso!");
    setRows((prevRows) => prevRows.filter((row) => row.apiId !== apiId));
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
          <IconButton color="secondary" onClick={() => deleteApiInstance(projectId ,params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOpen = () => console.log("Implementar ação de abrir modal");

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

      <DataGrid
        rows={formattedRows}
        columns={columns}
        pageSizeOptions={[5]}
        pagination
        slots={{ toolbar: () => <EditToolbar entityName={"APIs"} handleOpen={handleOpen} /> }}
      />

      <ToastContainer />
    </Box>
  );
};

export default ProjetoDetalhe;
