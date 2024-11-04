import React, { useState, useEffect } from "react";
import { Dialog, AppBar, Tabs, Tab, Box, Typography, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ComponentApi, ReadProjectDto, ReadApiDto, ReadEndpointDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import { getProjectStatusName } from "../shared/enums/ProjectStatus";

interface ComponentUtilizationPopupProps {
  open: boolean;
  onClose: () => void;
  componentId: number;
}

const ComponentUtilizationPopup: React.FC<ComponentUtilizationPopupProps> = ({ open, onClose, componentId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [projects, setProjects] = useState<ReadProjectDto[]>([]);
  const [apis, setApis] = useState<ReadApiDto[]>([]);
  const [endpoints, setEndpoints] = useState<ReadEndpointDto[]>([]);
  const componentApi = new ComponentApi(undefined, '', api);

  useEffect(() => {
    if (open) {
      fetchUtilization();
    }
  }, [open]);

  const fetchUtilization = async () => {
    try {
      const utilizationData = await componentApi.apiComponentComponentUtilizationGet(componentId);
      setProjects(utilizationData.data?.projects || []);
      setApis(utilizationData.data?.apis || []);
      setEndpoints(utilizationData.data?.endpoints || []);
    } catch (error) {
      console.error("Erro ao buscar dados de utilização:", error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderList = (items: any[], fields: { [key: string]: string }, formatters: { [key: string]: (value: any) => string } = {}) => (
    <List>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={item[fields.primary]}
              secondary={
                <>
                  {Object.keys(fields)
                    .filter((key) => key !== "primary")
                    .map((field) => (
                      <Typography key={field} variant="body2" color="textSecondary">
                        <strong>{fields[field]}:</strong> {formatters[field] ? formatters[field](item[field]) : item[field]}
                      </Typography>
                    ))}
                </>
              }
            />
          </ListItem>
          {index < items.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <AppBar position="static" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        <Typography variant="h6">Component Utilization</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </AppBar>

      <Tabs value={selectedTab} onChange={handleTabChange} centered variant="fullWidth">
        <Tab label="Projetos" />
        <Tab label="Apis" />
        <Tab label="Endpoints" />
      </Tabs>

      <Box p={3}>
        {selectedTab === 0 &&
          renderList(
            projects,
            {
              primary: "name",
              description: "Description",
              status: "Status",
            },
            {
              status: getProjectStatusName,
            }
          )}
        {selectedTab === 1 &&
          renderList(apis, {
            primary: "name",
            description: "Description",
            baseUrl: "Base URL",
            version: "Version",
          })}
        {selectedTab === 2 &&
          renderList(endpoints, {
            primary: "path",
            method: "Method",
            description: "Description",
          })}
      </Box>
    </Dialog>
  );
};

export default ComponentUtilizationPopup;
