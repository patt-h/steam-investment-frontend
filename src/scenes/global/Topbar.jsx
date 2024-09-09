import { Box, IconButton, useTheme, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import './topbar.css'

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
  };
  
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Box flex="1" />

        <div className="topbar" style={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
          <ul className="nav-topbar">
            <a href="http://localhost:3000/home">
              <li>Investments</li>
            </a>
            <a href="http://localhost:3000/home">
              <li>Price history</li>
            </a>
            <a href="https://steamcommunity.com/market/search?appid=730" target="_blank">
              <li>Steam Market</li>
            </a>
            <a href="http://localhost:3000/about">
              <li>About</li>
            </a>
          </ul>
        </div>

        <Box display="flex" justifyContent="flex-end" flex="1">
          <Tooltip title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
    </Box>
  );
};

export default Topbar;