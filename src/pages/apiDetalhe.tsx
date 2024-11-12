import React, { useCallback, useEffect, useState } from "react";
import { TextField, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useHandleDelete } from "../hooks/useHandleDelete";
import { api } from "../shared/api";
import { ProjectApi, ApiInstanceApi, UpdateApiDto, ReadApiDto, EndpointApi, InsertEndpointDto, ApiApi } from "../shared/apiSwaggerGen/api";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GenericDataGrid from "../components/GenericDatagrid";
import InsertEndpointForm from "../components/InsertEndpointForm";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";

const ApiDetalhe = () => {
  const location = useLocation();
  const apiApi = new ApiApi(undefined, "", api);
  const endpointApi = new EndpointApi(undefined, "", api);

  const apiData = location.state as ReadApiDto;
  const apiId = apiData?.id;
  const [originalApi, setOriginalApi] = useState<ReadApiDto | null>(null);
  const [name, setName] = useState(apiData?.name || "");
  const [description, setDescription] = useState(apiData?.description || "");
  const [baseUrl, setBaseUrl] = useState(apiData?.baseUrl || "");
  const [version, setVersion] = useState(apiData?.version || "");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (apiData) {
      setOriginalApi(apiData);
    }
  }, [apiData]);

  useEffect(() => {
    // Disable save if any field is empty or if no changes are detected
    const hasChanges = (
      name !== originalApi?.name ||
      description !== originalApi?.description ||
      baseUrl !== originalApi?.baseUrl ||
      version !== originalApi?.version
    );
    const hasEmptyFields = !name || !description || !baseUrl || !version;

    setIsSaveDisabled(!hasChanges || hasEmptyFields);
  }, [name, description, baseUrl, version, originalApi]);

  const fetchEndpoints = useCallback(() => apiApi.apiApiGetApiEndpointsGet(apiId), [apiId]);

  const handleSave = async () => {
    const updateApiDto: UpdateApiDto = { name, description, baseUrl, version };
    try {
      await apiApi.apiApiUpdatePut(apiId, updateApiDto);
      toast.success("API atualizada com sucesso!");
      setIsSaveDisabled(true);
    } catch (error) {
      console.error("Erro ao atualizar API:", error);
      toast.error("Erro ao atualizar a API. Por favor, tente novamente.");
    }
  };

  const handleDetailClick = useHandleDetailClick("/endpoint");
  const deleteEndpoint = async (id) => {
    await endpointApi.apiEndpointDeleteDelete(id);
  };
  const [rows, setRows] = useState([]);
  const handleDelete = useHandleDelete(fetchEndpoints, deleteEndpoint, "Endpoint", setRows);

  const createEndpoint = async (data: InsertEndpointDto) => {
    await endpointApi.apiEndpointCreatePost(data);
  };

  const columns = [
    { field: "id", headerName: "Id", width: 90 },
    { field: "path", headerName: "Path", width: 110 },
    { field: "method", headerName: "Method", width: 110 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleDetailClick(params.row)}>
            <OpenInNewIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const initialInsertDto: InsertEndpointDto = {
    apiId: apiId,
    path: "",
    method: "",
    description: "",
  };

  const transformData = (data) =>
    data.map((item) => ({
      id: item.id,
      apiId: item.apiId,
      path: item.path ?? "",
      method: item.method ?? "",
      description: item.description ?? "",
    }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detalhes da API: {apiData?.name}
      </Typography>

      <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
        <TextField label="Id" value={apiId} sx={{ width: "10%" }} disabled />
        <TextField
          label="Nome"
          value={name}
          sx={{ width: "30%" }}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Descrição"
          value={description}
          sx={{ width: "30%" }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Url Base"
          value={baseUrl}
          sx={{ width: "30%" }}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
        <TextField
          label="Versão"
          value={version}
          sx={{ width: "10%" }}
          onChange={(e) => setVersion(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "10%" }}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Salvar
        </Button>
      </Paper>

      <GenericDataGrid
        title="Lista de Endpoints"
        columns={columns}
        fetchData={fetchEndpoints}
        createData={createEndpoint}
        entityName="Endpoint"
        insertDto={initialInsertDto}
        transformData={transformData}
        rowsT={rows}
        customInsertContent={(formData, handleInputChange) => (
          <InsertEndpointForm formData={formData} handleInputChange={handleInputChange} apiId={Number(apiId)} />
        )}
      />
    </Box>
  );
};

export default ApiDetalhe;
