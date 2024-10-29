import { Button } from "@mui/material";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React from "react";
import AddIcon from '@mui/icons-material/Add';

interface EditToolbarProps {
  entityName: string;
  handleOpen: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({ entityName, handleOpen }) => (
  <GridToolbarContainer
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: 2,
      backgroundColor: '#F77F00', // Laranja pastel para a toolbar
    }}
  >
    <GridToolbarQuickFilter
      sx={{
        backgroundColor: 'white', // Define o background como branco
        borderRadius: 2, // Aplica bordas arredondadas na raiz
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
          borderRadius: 2, // Aplica bordas arredondadas ao input
        },
        '& .MuiInputBase-root': {
          borderRadius: 2, // Garantir borda arredondada também no input base
        },
      }}
    />
    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
      Add {entityName}
    </Button>
  </GridToolbarContainer>
);