import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { InsertEndpointDto } from "../shared/apiSwaggerGen/api";

interface InsertEndpointFormProps {
  formData: InsertEndpointDto;
  handleInputChange: (field: keyof InsertEndpointDto, value: any) => void;
  apiId: number;
}

export const InsertEndpointForm: React.FC<InsertEndpointFormProps> = ({
  formData,
  handleInputChange,
  apiId,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "row", gap: 4, mt: 3 }}>
      <TextField
        label="Código da API"
        value={apiId}
        disabled
        fullWidth
      />

      <TextField
        label="Path"
        value={formData.path}
        onChange={(e) => handleInputChange("path", e.target.value)} // Adiciona onChange
        fullWidth
      />

      <TextField
        label="Método"
        value={formData.method}
        onChange={(e) => handleInputChange("method", e.target.value)} // Atualiza status corretamente
        fullWidth
        select
      >
        <MenuItem value={"GET"}>GET</MenuItem>
        <MenuItem value={"POST"}>POST</MenuItem>
        <MenuItem value={"PUT"}>PUT</MenuItem>
        <MenuItem value={"DELETE"}>DELETE</MenuItem>
        <MenuItem value={"PATCH"}>PATCH</MenuItem>
        <MenuItem value={"OPTIONS"}>OPTIONS</MenuItem>
        <MenuItem value={"HEAD"}>HEAD</MenuItem>
        <MenuItem value={"TRACE"}>TRACE</MenuItem>
        <MenuItem value={"CONNECT"}>CONNECT</MenuItem>

      </TextField>

      <TextField
        label="Descrição do Endpoint"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)} // Adiciona onChange
        fullWidth
      />


    </Box>
  );
};

export default InsertEndpointForm;
