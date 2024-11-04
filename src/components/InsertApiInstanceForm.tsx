import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import { ApiApi, InsertApiInstanceDto, ReadApiDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";

interface InsertApiInstanceFormProps {
  formData: InsertApiInstanceDto;
  handleInputChange: (field: keyof InsertApiInstanceDto, value: any) => void;
  projectId: number;
}

export const InsertApiInstanceForm: React.FC<InsertApiInstanceFormProps> = ({
  formData,
  handleInputChange,
  projectId,
}) => {
  const [apiOptions, setApiOptions] = useState<ReadApiDto[]>([]); // Estado para armazenar as APIs

  const apiApi = new ApiApi(undefined, '', api);

  useEffect(() => {
    // Função para buscar as APIs do banco de dados
    const fetchApiOptions = async () => {
      try {
        const response = await apiApi.apiApiGetAllGet();
        setApiOptions(response.data); // Armazena a lista de ReadApiDto
      } catch (error) {
        console.error("Erro ao buscar APIs:", error);
      }
    };

    fetchApiOptions(); // Chama a função para buscar APIs ao montar o componente
  }, []);

  return (
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
        {apiOptions.length > 0 ? (
          apiOptions.map((api) => (
            <MenuItem key={api.id} value={api.id}>
              {api.name || "API Sem Nome"}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhuma API disponível</MenuItem>
        )}
      </TextField>
    </Box>
  );
};

export default InsertApiInstanceForm;
