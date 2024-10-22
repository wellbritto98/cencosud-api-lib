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
  Fab,
  Modal,
  TextField,
  Button,
  CircularProgress, // Import the CircularProgress component for the spinner
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // Import the OpenInNewIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import the DeleteIcon
import { useNavigate } from "react-router-dom"; // Importa o useNavigate para redirecionar
import { api } from "../shared/api";
import { ProjectApi, ReadProjectDto, InsertProjectDto } from "../shared/apiSwaggerGen/api";
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Projetos = () => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState<ReadProjectDto[]>([]); // Use the ReadProjectDto type for the state
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate(); // Hook para redirecionar

  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  // Set up the axios instance with token management
  const axiosInstance = api;
  const projectApi = new ProjectApi(undefined, '', axiosInstance); // Create a new ProjectApi instance
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

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

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Add this to prevent default form behavior if necessary
    setLoading(true); // Set loading to true when the save starts
    const newProject: InsertProjectDto = {
      name,
      description,
      status,
    };

    try {
      await projectApi.apiProjectCreatePost(newProject);
      const response = await projectApi.apiProjectGetAllGet();
      setProjects(response.data);
      toast.success("Projeto adicionado com sucesso!"); // Success notification
      handleClose(event, 'close'); // Pass the event and reason to handleClose
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast.error("Erro ao criar projeto, tente novamente!"); // Error notification
    } finally {
      setLoading(false); // Set loading to false after save is complete
    }
  };

  const handleDelete = async (projectId: number | undefined) => {
    if (window.confirm("Você tem certeza que deseja deletar este projeto?")) {
      try {
        await projectApi.apiProjectDeleteDelete(projectId);
        const response = await projectApi.apiProjectGetAllGet();
        setProjects(response.data);
        toast.success("Projeto deletado com sucesso!"); // Success notification
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        toast.error("Erro ao deletar projeto, tente novamente!"); // Error notification
      }
    }
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
                      <OpenInNewIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(project.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ position: 'fixed', bottom: 80, right: 80 }}>
          <Fab color="primary" onClick={handleOpen} aria-label="add">
            <AddIcon />
          </Fab>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Inserir Novo Projeto
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descrição"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Status"
            variant="outlined"
            value={status}
            disabled={loading}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleSave}
              disabled={loading} // Disable the button while loading
            >
              {loading ? <Typography>Adicionando...<CircularProgress size={12} /></Typography> : "Salvar"} {/* Show spinner when loading */}
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </Box>
  );
};

export default Projetos;