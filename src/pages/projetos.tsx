import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CssBaseline,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom"; // Importa o useNavigate para redirecionar
import { api } from "../shared/api";
import { ProjectApi, ReadProjectDto } from "../shared/apiSwaggerGen/api";


const Projetos = () => {
  const [projects, setProjects] = useState<ReadProjectDto[]>([]); // Use the ReadProjectDto type for the state
  const navigate = useNavigate(); // Hook para redirecionar

  // Set up the axios instance with token management
  const axiosInstance = api;
  const projectApi = new ProjectApi(undefined, '', axiosInstance); // Create a new ProjectApi instance

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use the swagger-generated API method to get projects
        const response = await projectApi.apiProjectGetAllGet();
        setProjects(response.data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };
    fetchProjects();
  }, []);

  // Função para navegar para a página de detalhe do projeto com os dados
  const handleDetailClick = (project: ReadProjectDto) => {
    navigate(`/projeto/${project.id}`, { state: project });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Projetos
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Lista de Projetos
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project: ReadProjectDto) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleDetailClick(project)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Projetos;
