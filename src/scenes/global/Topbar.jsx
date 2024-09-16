import { Box, IconButton, useTheme, Tooltip, Typography} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

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
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        borderRadius="3px"
      >
        <Typography variant="h2">
          Steam Investment Helper
        </Typography>
      </Box>

      <Box display="flex">
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