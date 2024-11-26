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
      backgroundImage:  'linear-gradient(to right, #F79431, #1585EC )', // Gradient para a toolbar
    }}
  >
    <GridToolbarQuickFilter
      sx={{
        borderRadius: 1, // Aplica bordas arredondadas na raiz
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
          borderRadius: 1, // Aplica bordas arredondadas ao input
        },
        '& .MuiInputBase-root': {
          borderRadius: 1, // Garantir borda arredondada também no input base
        },
      }}
    />
    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
      Add {entityName}
    </Button>
  </GridToolbarContainer>
);