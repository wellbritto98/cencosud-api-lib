import React, { useCallback, useEffect, useState } from "react";
import { TextField, Select, MenuItem, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../shared/api";
import { ApiInstanceApi, UpdateEndpointDto, InsertApiInstanceDto, EndpointApi, ComponentInstanceApi, ReadEndpointDto, InsertComponentInstanceDto } from "../shared/apiSwaggerGen/api";
import DeleteIcon from '@mui/icons-material/Delete';
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import GenericDataGrid from "../components/GenericDatagrid";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useHandleDelete } from "../hooks/useHandleDelete";
import { InsertApiInstanceForm } from "../components/InsertApiInstanceForm";
import { getComponentTypeName } from "../shared/enums/ComponentType";
import ComponentUtilizationPopup from "../components/ComponentUtilizationPopup";
import BarChartIcon from '@mui/icons-material/BarChart';

const EndpointDetalhe = () => {
  const location = useLocation();
  const endpointApi = new EndpointApi(undefined, '', api);
  const componentInstanceApi = new ComponentInstanceApi(undefined, '', api);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);

  const endpointData = location.state as ReadEndpointDto;
  const endpointId = endpointData?.id || 0;
  const [originalEndpoint, setOriginalEndpoint] = useState<ReadEndpointDto | null>(null);
  const [path, setPath] = useState(endpointData?.path || '');
  const [description, setDescription] = useState(endpointData?.description || '');
  const [method, setMethod] = useState(endpointData?.method || '');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    if (endpointData) {
      setOriginalEndpoint(endpointData);
    }
  }, [endpointData]);

  useEffect(() => {
    // Disable save if any field is empty or if no changes are detected
    const hasChanges = (
      path !== originalEndpoint?.path ||
      description !== originalEndpoint?.description ||
      method !== originalEndpoint?.method
    );
    const hasEmptyFields = !path || !description || !method;

    setIsSaveDisabled(!hasChanges || hasEmptyFields);
  }, [path, description, method, originalEndpoint]);

  const handleOpenPopup = (componentId: number) => {
    setSelectedComponentId(componentId);
    setOpenPopup(true);
  };
  const handleSave = async () => {
    const updateEndpointDto: UpdateEndpointDto = { path, description, method };
    try {
      await endpointApi.apiEndpointUpdatePut(endpointId, updateEndpointDto);
      toast.success("Endpoint atualizado com sucesso!");
      setIsSaveDisabled(true);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Erro ao atualizar o projeto. Por favor, tente novamente.");
    }
  };

  const deleteComponentInstance = async (endpointId: number, apiId: number) => {
    await componentInstanceApi.apiComponentInstanceDeleteDelete(endpointId, apiId);
  };
  const fetchComponentInstances = useCallback(() => endpointApi.apiEndpointGetEndpointComponentsGet(endpointId), [endpointId]);
  const [rows, setRows] = useState([]);
  const handleDelete = useHandleDelete(fetchComponentInstances, deleteComponentInstance, "ComponentInstance", setRows);

  const createComponent = async (data: InsertComponentInstanceDto) => {
    await componentInstanceApi.apiComponentInstanceCreatePost(data);
  };
  const handleDetailClick = useHandleDetailClick("/component");

  const columns = [
    { field: 'id', headerName: 'Id', width: 90 },
    {
      field: 'type', headerName: 'Tipo', flex: 1, valueGetter: (value) => {
        return getComponentTypeName(value)
      }
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpenPopup(params.row.id)}>
            <BarChartIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(endpointId, params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const initialInsertDto = {
    endpointId: endpointId,
    componentId: 1,
  };

  const transformData = (data) => data.map((item) => ({
    id: item.component?.id,
    type: item.component?.type ?? '',
    description: item.component?.description ?? '',
  }));


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detalhes do endpoint: {endpointData?.path}
      </Typography>

      <Paper sx={{ p: 2, mb: 4, display: "flex", gap: 5 }}>
        <TextField label="Id" value={endpointId} sx={{ width: "10%" }} disabled />
        <TextField
          label="Path"
          value={path}
          sx={{ width: "40%" }}
          onChange={(e) => setPath(e.target.value)}
        />
        <TextField
          label="Descrição"
          value={description}
          sx={{ width: "40%" }}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Method"
          select
          value={method}
          sx={{ width: "25%" }}
          onChange={(e) => setMethod(e.target.value)}
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
        title="Lista de Componentes"
        columns={columns}
        fetchData={fetchComponentInstances}
        createData={createComponent}
        entityName="ComponentInstance"
        insertDto={initialInsertDto}
        transformData={transformData}
        rowsT={rows}
      />
      <ComponentUtilizationPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        componentId={selectedComponentId || 0} // Passa o ID selecionado ou 0 como fallback
      />
    </Box>

  );
};

export default EndpointDetalhe;


