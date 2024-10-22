import React, { useState, useEffect } from "react";
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
import { ProjectApi, ReadApiInstanceDto, ReadProjectDto } from "../shared/apiSwaggerGen/api"; // Import Swagger-generated ProjectApi
import { api } from "../shared/api";

const ProjetoDetalhe = () => {
  const { id } = useParams(); // Get the ProjectId from the URL
  const location = useLocation(); // Get the state passed via navigation
  const [project, setProject] = useState<ReadProjectDto | null>(null); 
  const [apis, setApis] = useState<ReadApiInstanceDto[]>([]); // Set the correct type for apis state
  const [loading, setLoading] = useState(true);

  const axiosInstance = api; // Create the axios instance with token management
  const projectApi = new ProjectApi(undefined, '', axiosInstance); // Create ProjectApi instance with axiosInstance

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project details
        const response = await projectApi.apiProjectGetGet(Number(id));
        setProject(response.data);
  
        // Fetch related APIs for the project
        const apisResponse = await projectApi.apiProjectGetApiInstancesGet(Number(id));

        // Set apis if data exists
        if (apisResponse && apisResponse.data) {
          setApis(apisResponse.data);
        } else {
          console.warn("API response does not contain data:", apisResponse);
          setApis([]); // Handle empty response
        }
  
      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
        setApis([]); // Handle error case by setting empty array
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjectDetails();
  }, [id, projectApi]);

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
            <TextField label="Nome" value={project.name} sx={{ width: "40%" }} />
            <TextField label="Descrição" value={project.description} sx={{ width: "40%" }} />
            <TextField label="Status" value={project.status} sx={{ width: "10%" }} />
            <Button variant="contained" color="primary" sx={{ width: "10%" }}>Salvar</Button>
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
    </Box>
  );
};

export default ProjetoDetalhe;
