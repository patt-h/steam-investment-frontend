import { Box, IconButton, useTheme, Tooltip, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext} from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import SettingsModal from "../../components/SettingsModal";

const Topbar = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
    };

    return (
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box display="flex" borderRadius="3px">
          <Typography variant="h2">Steam Investment Helper</Typography>
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

          <Tooltip title="Settings">
            <IconButton onClick={handleOpenModal}>
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <SettingsModal open={openModal} handleClose={handleCloseModal} />
  
      </Box>
    );
};

export default Topbar;
