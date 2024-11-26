import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, CircularProgress, Modal, Typography, TextField } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { EditToolbar } from "./EditToolbarDatagrid";
import { useFetchData } from "../hooks/useFetchData";

interface GenericDataGridProps<T, U extends object, V extends object> { // Adicionado `U extends object`
  title: string;
  columns: GridColDef[];
  fetchData: () => Promise<{ data: T[] }>;
  createData: (data: U) => Promise<void>;
  entityName: string;
  insertDto: U;
  transformData?: (data: T[]) => V[]; // Função para transformar os dados
  rowsT?: T[], // Adiciona refreshData como uma nova prop
  customInsertContent?: JSX.Element | ((formData: U, handleInputChange: (field: keyof U, value: any) => void) => JSX.Element);
}

const GenericDataGrid = <T, U extends object, V extends object>({
  title,
  columns,
  fetchData,
  createData,
  entityName,
  insertDto,
  transformData,
  rowsT,
  customInsertContent,
}: GenericDataGridProps<T, U, V>) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<U>(insertDto);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useFetchData(fetchData, entityName);
  const [transformedRows, setTransformedRows] = useState<V[]>([]);

  useEffect(() => {
    if (rowsT) {
      setRows(rowsT); // Atualiza `rows` com `rowsT` sempre que `rowsT` muda
    }
  }, [rowsT]);
  
  useEffect(() => {
    if (transformData) {
      setTransformedRows(transformData(rows)); // Aplica a transformação se existir
    } else {
      setTransformedRows(rows as unknown as V[]); // Converte os dados diretamente
    }
  }, [rows, transformData]);

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
  const handleDeleteRefresh = async () => {
    const response = await fetchData();
    setRows(response.data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createData(formData);
      const response = await fetchData();
      setRows(response.data);
      try {
        toast.success(`${entityName} adicionado com sucesso!`);
      }
      catch (e) {
        console.log(e)
      }
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
    <Box sx={
      { flexGrow: 1, 
        width: "100%", 
        padding: 6 
      }
      }>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transformedRows} // Usa os dados transformados
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          slots={{ toolbar: () => <EditToolbar entityName={entityName} handleOpen={handleOpen} /> }}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 6, backgroundColor: 'white', borderRadius: 1 }}>
          <Typography variant="h6">Inserir Novo {entityName}</Typography>
          {customInsertContent
            ? typeof customInsertContent === "function"
              ? customInsertContent(formData, handleInputChange)
              : customInsertContent
            : renderFields()}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="warning" onClick={handleClose}>Cancelar</Button>
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
