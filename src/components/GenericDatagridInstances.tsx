import React, { useState } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, CircularProgress, Modal, Typography, TextField } from "@mui/material";
import { useFetchData } from "../hooks/useFetchData";
import { ToastContainer, toast } from 'react-toastify';
import { EditToolbar } from "./EditToolbarDatagrid";

interface GenericDataGridProps<T, U extends object> {
    columns: GridColDef[];
    fetchData: () => Promise<{ data: T[] }>;
    createData: (data: U) => Promise<void>;
    deleteData: (id1: number, id2:number) => Promise<void>;
    detailUrl: string;
    entityName: string;
  }

const GenericDataGridInstances = () => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%", padding: 7 }}>
      <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          pagination
          slots={{ toolbar: () => <EditToolbar entityName={entityName} handleOpen={handleOpen} /> }}
        />
    </Box>
  );
};

export default GenericDataGridInstances;
