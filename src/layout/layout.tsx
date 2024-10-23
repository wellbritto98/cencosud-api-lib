import React, { useState } from 'react';
import { AppBar, Drawer, Toolbar, Typography, Box, List, ListItem, ListItemText, CssBaseline, Divider, IconButton } from '@mui/material';
import { Link, Outlet } from 'react-router-dom'; 
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se a tela é pequena (mobile)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Mostra o ícone de menu somente em telas menores */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            My Application
          </Typography>
        </Toolbar>
      </AppBar>

      {/* O Drawer é persistente em telas maiores e temporário em telas menores */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={isMobile ? drawerOpen : true} // Se for mobile, controla pelo estado, senão sempre aberto
        onClose={handleDrawerToggle} // Fecha o drawer no mobile
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {['Projetos', 'Apis', 'Componentes'].map((text) => (
            <ListItem 
              key={text} 
              component={Link} 
              to={`/${text.toLowerCase()}`}
              onClick={handleDrawerToggle} // Fecha o drawer ao clicar no item se for mobile
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, padding: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
