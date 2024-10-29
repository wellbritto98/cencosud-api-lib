import React, { useState } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, CircularProgress, Modal, Typography, TextField } from "@mui/material";
import { useFetchData } from "../hooks/useFetchData";
import { ToastContainer, toast } from 'react-toastify';
import { EditToolbar } from "./EditToolbarDatagrid";

interface GenericDataGridProps<T, U extends object> {
  title: string;
  columns: GridColDef[];
  fetchData: () => Promise<{ data: T[] }>;
  createData: (data: U) => Promise<void>;
  deleteData: (id: number) => Promise<void>;
  detailUrl: string;
  entityName: string;
  insertDto: U;
  getRowId?: (row: T) => string | number; // Propriedade opcional getRowId
  customInsertContent?: JSX.Element | ((formData: U, handleInputChange: (field: keyof U, value: any) => void) => JSX.Element); // Custom component or function
}

const GenericDataGrid = <T, U extends object>({
  title,
  columns,
  fetchData,
  createData,
  deleteData,
  detailUrl,
  entityName,
  insertDto,
  getRowId, // Recebe a função opcional getRowId
  customInsertContent
}: GenericDataGridProps<T, U>) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<U>(insertDto);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useFetchData(fetchData, entityName);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData(insertDto);
    setOpen(false);
  };

  const handleInputChange = (field: keyof U, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createData(formData);
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

  const renderFields = () => {
    return Object.keys(insertDto).map((key) => (
      <TextField
        key={key}
        fullWidth
        margin="normal"
        label={key.charAt(0).toUpperCase() + key.slice(1)}
        value={(formData as any)[key] || ''}
        onChange={(e) => handleInputChange(key as keyof U, e.target.value)}
      />
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%", padding: 6 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          slots={{ toolbar: () => <EditToolbar entityName={entityName} handleOpen={handleOpen} /> }}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 1 }}>
          <Typography variant="h6">Inserir Novo {entityName}</Typography>
          {customInsertContent
            ? typeof customInsertContent === "function"
              ? customInsertContent(formData, handleInputChange)
              : customInsertContent
            : renderFields()} {/* Renderiza o componente customizado, se existir */}
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
      <ToastContainer />
    </Box>
  );
};

export default GenericDataGrid;
