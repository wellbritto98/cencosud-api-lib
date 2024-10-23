import React, { useContext, useState } from 'react';
import { AppBar, Drawer, Toolbar, Typography, Box, List, ListItem, ListItemText, CssBaseline, Divider, IconButton, ListItemButton, ListItemIcon } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ApiIcon from '@mui/icons-material/Api';
import SettingsIcon from '@mui/icons-material/Settings';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/authContext';

const drawerWidth = 240;

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se a tela é pequena (mobile)
  const location = useLocation(); // Obtém a localização atual
  const { logout } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Projetos', icon: <WorkOutlineIcon />, link: '/projetos' },
    { text: 'Apis', icon: <ApiIcon />, link: '/apis' },
    { text: 'Componentes', icon: <SettingsIcon />, link: '/componentes' }
  ];

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
          <Typography variant="h6" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={`/assets/img/Cencosud logo branco.png`}
              alt="Cencosud logo"
              style={{ maxWidth: 100 }}
            />

            Cencosud API Lib
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
        }}
      >
        <Box>
          <Toolbar />
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem
                disablePadding
                key={item.text}
                component={ListItemButton}
                sx={{
                  textDecoration: 'none',
                  color: location.pathname === item.link ? 'primary.main' : 'inherit', // Aplica cor ao item ativo
                  backgroundColor: location.pathname === item.link ? 'rgba(0, 0, 0, 0.08)' : 'inherit' // Adiciona destaque ao item ativo
                }}
                component={Link}
                to={item.link}
                onClick={handleDrawerToggle} // Fecha o drawer ao clicar no item se for mobile
              >
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Adiciona o botão de Logout no final do Drawer */}
        <Box>
          <Divider />
          <List>
            <ListItem
              disablePadding
              onClick={logout} // Chama a função de logout quando clicado
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
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
