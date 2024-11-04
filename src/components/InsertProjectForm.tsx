import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { InsertProjectDto } from "../shared/apiSwaggerGen/api";

interface InsertProjectFormProps {
  formData: InsertProjectDto;
  handleInputChange: (field: keyof InsertProjectDto, value: any) => void;
}

export const InsertProjectForm: React.FC<InsertProjectFormProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "row", gap: 4, mt: 3 }}>
      <TextField
        label="Nome do Projeto"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)} // Adiciona onChange
        fullWidth
      />

      <TextField
        label="Descrição do Projeto"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)} // Adiciona onChange
        fullWidth
      />

      <TextField
        label="Status do Projeto"
        value={formData.status}
        onChange={(e) => handleInputChange("status", parseInt(e.target.value))} // Atualiza status corretamente
        fullWidth
        select
      >
        <MenuItem value={0}>Ativo</MenuItem>
        <MenuItem value={1}>Desenvolvimento</MenuItem>
        <MenuItem value={2}>Cancelado</MenuItem>
      </TextField>
    </Box>
  );
};

export default InsertProjectForm;
