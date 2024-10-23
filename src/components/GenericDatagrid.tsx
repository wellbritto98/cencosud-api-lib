import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Button, Box, CircularProgress, Modal, Typography, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useFetchData } from "../hooks/useFetchData";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete";
import { ToastContainer, toast } from 'react-toastify';

interface GenericDataGridProps<T, U extends object> { // Restringindo `U` para ser um objeto
  title: string;
  columns: GridColDef[];
  fetchData: () => Promise<{ data: T[] }>;
  createData: (data: U) => Promise<void>; // Agora recebemos o `InsertDto` dinâmico
  deleteData: (id: number) => Promise<void>;
  detailUrl: string;
  entityName: string;
  insertDto: U; // Recebemos o DTO de inserção como uma prop
}

const GenericDataGrid = <T, U extends object>({ title, columns, fetchData, createData, deleteData, detailUrl, entityName, insertDto }: GenericDataGridProps<T, U>) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<U>(insertDto); // Usamos um estado para armazenar dinamicamente o Dto
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useFetchData(fetchData, entityName);
  const handleDetailClick = useHandleDetailClick(detailUrl);
  const handleDelete = useHandleDelete(fetchData, deleteData, entityName, setRows);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData(insertDto); // Resetar o formulário ao fechar
    setOpen(false);
  };

  // Função para lidar com a mudança de valores dinâmicos no formulário
  const handleInputChange = (field: keyof U, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createData(formData); // Envia o DTO dinamicamente
      const response = await fetchData();
      setRows(response.data);
      toast.success(`${entityName} adicionado com sucesso!`);
      handleClose();
    } catch (error) {
      toast.error(`Erro ao criar ${entityName}, tente novamente!`);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar campos de inserção dinamicamente com base nas chaves do InsertDto
  const renderFields = () => {
    return Object.keys(insertDto).map((key) => (
      <TextField
        key={key}
        fullWidth
        margin="normal"
        label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitaliza o nome do campo
        value={(formData as any)[key] || ''} // Pega o valor dinamicamente do estado formData
        onChange={(e) => handleInputChange(key as keyof U, e.target.value)} // Atualiza o valor dinamicamente
      />
    ));
  };

  const EditToolbar = () => (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: '#F77F00', // Laranja pastel para a toolbar
      }}
    >
      <GridToolbarQuickFilter
        sx={{
          backgroundColor: 'white', // Define o background como branco
          borderRadius: 2, // Aplica bordas arredondadas na raiz
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: 2, // Aplica bordas arredondadas ao input
          },
          '& .MuiInputBase-root': {
            borderRadius: 2, // Garantir borda arredondada também no input base
          },
        }}
      />
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
        Add {entityName}
      </Button>
    </GridToolbarContainer>
  );

  return (
    <Box sx={{ flexGrow: 1, width:"100%", padding:6 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          slots={{ toolbar: EditToolbar }}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1 }}>
          <Typography variant="h6">Inserir Novo {entityName}</Typography>
          {renderFields()} {/* Renderiza os campos dinamicamente */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>Cancelar</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ ml: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Salvar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default GenericDataGrid;
