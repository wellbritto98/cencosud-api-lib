import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { ProjectApi, ReadApiInstanceDto, ReadProjectDto, UpdateProjectDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjetoDetalhe = () => {
  const { id } = useParams(); // Get the ProjectId from the URL
  const location = useLocation(); // Get the state passed via navigation
  const [project, setProject] = useState<ReadProjectDto | null>(null); // Project data
  const [originalProject, setOriginalProject] = useState<ReadProjectDto | null>(null); // Original project data for comparison
  const [apis, setApis] = useState<ReadApiInstanceDto[]>([]); // APIs related to the project
  const [loading, setLoading] = useState(true); // Loading state
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Save button disabled state

  const [name, setName] = useState(''); // Form fields
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  // Memoize the ProjectApi instance to prevent infinite loops in useEffect
  const projectApi = useMemo(() => new ProjectApi(undefined, '', api), []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project details
        const response = await projectApi.apiProjectGetGet(Number(id));
        setProject(response.data);
        setOriginalProject(response.data); // Store the original data for comparison

        // Initialize form fields with fetched data
        setName(response.data.name || '');
        setDescription(response.data.description || '');
        setStatus(response.data.status || '');

        // Fetch related APIs for the project
        const apisResponse = await projectApi.apiProjectGetApiInstancesGet(Number(id));

        // Set apis if data exists
        if (apisResponse && apisResponse.data) {
          setApis(apisResponse.data);
        } else {
          setApis([]);
        }

      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
        toast.error("Erro ao buscar detalhes do projeto.");
        setApis([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, projectApi]);

  // Function to check if any changes are made to the form fields
  useEffect(() => {
    if (
      project &&
      (name !== originalProject?.name ||
        description !== originalProject?.description ||
        status !== originalProject?.status)
    ) {
      setIsSaveDisabled(false); // Enable save if fields are changed
    } else {
      setIsSaveDisabled(true); // Disable save if no changes
    }
  }, [name, description, status, originalProject, project]);

  const handleSave = async () => {
    if (!project) return;

    const updateProjectDto: UpdateProjectDto = {
      name,
      description,
      status,
    };

    try {
      await projectApi.apiProjectUpdatePut(Number(project.id), updateProjectDto);
      setOriginalProject({ ...project, name, description, status }); // Update original project to the new values
      setIsSaveDisabled(true); // Disable save button again
      toast.success("Projeto atualizado com sucesso!"); // Success toast
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Erro ao atualizar o projeto. Por favor, tente novamente."); // Error toast
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {project?.name || 'Detalhes do Projeto'}
          </Typography>
        </Toolbar>
      </AppBar>

      {project && (
        <>
          <Typography variant="h4" gutterBottom>
            Detalhes do Projeto: {project.name}
          </Typography>
          <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
            <TextField label="Id" value={project.id} sx={{ width: "10%" }} disabled />
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
              disabled={isSaveDisabled} // Disable if no changes
            >
              Salvar
            </Button>
          </Paper>
        </>
      )}

      <Typography variant="h5" gutterBottom>
        APIs Relacionadas
      </Typography>

      <List>
        {apis.length > 0 ? (
          apis.map((apiInstance) => (
            <ListItem key={apiInstance.apiId}>
              <ListItemText
                primary={apiInstance.api?.name || "API Desconhecida"}
                secondary={`${apiInstance.api?.description || "Sem descrição"} (Versão: ${apiInstance.api?.version || "N/A"})`}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">Nenhuma API relacionada encontrada.</Typography>
        )}
      </List>

      {/* ToastContainer is necessary for displaying toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default ProjetoDetalhe;
