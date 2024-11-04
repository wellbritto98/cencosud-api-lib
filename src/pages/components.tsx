import { ComponentApi, InsertComponentDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import React, { useState } from "react";
import GenericDataGrid from "../components/GenericDatagrid";
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import { IconButton } from "@mui/material";
import { useHandleDetailClick } from "../hooks/useHandleDetailOnClick";
import { useHandleDelete } from "../hooks/useHandleDelete";
import { getComponentTypeName } from "../shared/enums/ComponentType";
import InsertComponentForm from "../components/InsertComponentForm";
import ComponentUtilizationPopup from "../components/ComponentUtilizationPopup";


const Componentes = () => {
  const componentApi = new ComponentApi(undefined, '', api);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);


  const fetchComponents = () => componentApi.apiComponentGetAllGet();

  const createComponent = async (data: InsertComponentDto): Promise<void> => {
    await componentApi.apiComponentCreatePost(data);
  };

  const deleteComponent = async (id: number): Promise<void> => {
    await componentApi.apiComponentDeleteDelete(id);
  };

  // Usando hooks genéricos para manipulação
  const handleDetailClick = useHandleDetailClick("/api");
  const [rows, setRows] = React.useState([]); // State para armazenar os dados

  const handleDelete = useHandleDelete(fetchComponents, deleteComponent, "Component", setRows);
  const handleOpenPopup = (componentId: number) => {
    setSelectedComponentId(componentId);
    setOpenPopup(true);
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'type', headerName: 'Type', width: 300,
      valueGetter: (value) => {
        return getComponentTypeName(value)
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpenPopup(params.row.id)}>
            <BarChartIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Criar um objeto de InsertComponentDto como padrão para inicializar os campos
  const initialInsertDto: InsertComponentDto = {
    type: 0,
    description: '',
  };

  return (
    <>
      <GenericDataGrid
        title="Lista de Components"
        columns={columns}
        fetchData={fetchComponents}
        createData={createComponent}
        entityName="component"
        insertDto={initialInsertDto} // Passar um objeto inicial do tipo InsertComponentDto
        customInsertContent={(formData, handleInputChange) => (
          <InsertComponentForm formData={formData} handleInputChange={handleInputChange} />
        )}
      />
      <ComponentUtilizationPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        componentId={selectedComponentId || 0} // Passa o ID selecionado ou 0 como fallback
      />

    </>
  );
};

export default Componentes;
