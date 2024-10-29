import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { InsertApiInstanceDto } from "../shared/apiSwaggerGen/api";
import { ToastContainer } from "react-toastify";

interface InsertApiInstanceFormProps {
  formData: InsertApiInstanceDto;
  handleInputChange: (field: keyof InsertApiInstanceDto, value: any) => void;
  projectId: number;
}

export const InsertApiInstanceForm: React.FC<InsertApiInstanceFormProps> = ({
  formData,
  handleInputChange,
  projectId,
}) => (
  <Box sx={{ display: 'flex', flexDirection: "row", gap: 4, mt: 3 }}>
    <TextField
      label="Código do Projeto"
      value={projectId}
      disabled
      fullWidth
    />

    <TextField
      label="Selecione a API"
      id="api-select"
      value={formData.apiId}
      onChange={(e) => handleInputChange("apiId", parseInt(e.target.value))}
      fullWidth
      select
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);

export default InsertApiInstanceForm;
