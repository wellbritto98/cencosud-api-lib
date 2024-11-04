import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { InsertComponentDto } from "../shared/apiSwaggerGen/api";
import { ComponentType, getComponentTypeName } from "../shared/enums/ComponentType";

interface InsertComponentFormProps {
  formData: InsertComponentDto;
  handleInputChange: (field: keyof InsertComponentDto, value: any) => void;
}

export const InsertComponentForm: React.FC<InsertComponentFormProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "row", gap: 4, mt: 3 }}>
      <TextField
        label="Descrição do Componente"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)} // Adiciona onChange
        fullWidth
      />
      <TextField
        label="Tipo de Componente"
        value={formData.type}
        onChange={(e) => handleInputChange("type", parseInt(e.target.value))}
        fullWidth
        select
      >
        {Object.keys(ComponentType)
          .filter((key) => !isNaN(Number(key))) 
          .map((key) => (
            <MenuItem key={key} value={Number(key)}>
              {getComponentTypeName(Number(key))}
            </MenuItem>
          ))}
      </TextField>

    </Box>
  );
};

export default InsertComponentForm;
