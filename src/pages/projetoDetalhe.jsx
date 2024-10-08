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
import axios from "axios";

const ProjetoDetalhe = () => {
  const { id } = useParams(); // Obter o ProjectId da URL
  const location = useLocation(); // Pegar o estado passado pela navegação
  const project = location.state; // Obter os dados do projeto do estado
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiInstances = async () => {
      try {
        const apisResponse = await axios.get(
          `http://localhost:5137/api/ApiInstance/Find?json=%7B%20%22ProjectId%40igual%22%3A%20%22${id}%40System.Int32%22%20%7D`
        );
        setApis(apisResponse.data);
      } catch (error) {
        console.error("Erro ao buscar APIs do projeto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiInstances();
  }, [id]);

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
            {project.name}
          </Typography>
        </Toolbar>
      </AppBar>
      {project && (
        <>
          <Typography variant="h4" gutterBottom>
            Detalhes do Projeto: {project.name}
          </Typography>
          <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
        <TextField label="Id" value={project.id} sx={{width:"10%"}}   />
        <TextField label="Nome" value={project.name} sx={{width:"40%"}}   />
        <TextField label="Descrição" value={project.description}  sx={{width:"40%"}}   />
        <TextField label="Status" value={project.status} sx={{width:"10%"}}   />

        <Button variant="contained" color="primary" sx={{width:"10%"}}>Salvar</Button>
        </Paper>

        </>
      )}

      <Typography variant="h5" gutterBottom>
        APIs Relacionadas
      </Typography>

      <List>
        {apis.map((apiInstance) => (
          <ListItem key={apiInstance.apiId}>
            <ListItemText
              primary={apiInstance.api.name}
              secondary={`${apiInstance.api.description} (Versão: ${apiInstance.api.version})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjetoDetalhe;
