import { useTheme, IconButton, Box, Modal, Snackbar, FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography, List, ListItem, ListItemText } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect } from "react";
import AutoCompleteInput from './AutoCompleteInput';
import { fetchUserSettings, updateUserSettings } from './SettingsApi';

import { tokens } from "../theme";

const SettingsModal = ({ open, handleClose }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState('General');
    const [settingsId, setSettingsId] = useState(null);
    const [currency, setCurrency] = useState('USD');
    const [userGoal, setUserGoal] = useState("TEST");
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await fetchUserSettings();
                setSettingsId(data.id);
                setUserGoal(data.goalName);
                setCurrency(data.currency);
            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        if (open) {
            fetchSettings();
        }
    }, [open]);

    const handleSaveSettings = async () => {
        const updatedSettings = {
            id: settingsId,
            currency: currency,
            goalName: userGoal,
        };
    
        try {
            await updateUserSettings(updatedSettings);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    const handleGoalChange = (newGoal) => {
        setUserGoal(newGoal);
    };

    const handlePasswordChange = () => {
        console.log("Password change triggered");
    };

    const handleEmailChange = () => {
        console.log('Email changed to:', newEmail);
    };
    

    const renderGeneralSettings = () => (
        <Box>
            <Typography variant="h6" >
                Currency that is used while adding new items
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select value={currency} onChange={handleCurrencyChange}>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="PLN">PLN</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h6" mt="10px">
                Select item that you want to save for
            </Typography>
            <AutoCompleteInput
                value={userGoal}
                onChange={handleGoalChange}
                placeholder="Select item"
            />

            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveSettings}>
                Save Settings
            </Button>
        </Box>
    );

    const renderPasswordSettings = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>
            <TextField
                label="Old Password"
                type="password"
                fullWidth
                margin="normal"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handlePasswordChange}>
                Save Password
            </Button>
        </Box>
    );

    const renderEmailSettings = () => (
        <Box>
            <Typography variant="h6" gutterBottom>
                Change Email
            </Typography>
            <TextField
                label="Current Email"
                type="email"
                fullWidth
                margin="normal"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
            />
            <TextField
                label="New Email"
                type="email"
                fullWidth
                margin="normal"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleEmailChange}>
                Save Email
            </Button>
        </Box>
    );
    

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                maxHeight: '80vh',
                overflowY: 'auto',
                backgroundColor: colors.primary[400], 
                border: "2px solid rgba(255, 255, 255, .2)",
                boxShadow: 24,
                p: 3,
                display: 'flex',
                flexDirection: 'row'
            }}>
                <IconButton onClose={handleClose} onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>

                <Box sx={{ width: '25%', borderRight: `1px solid #333`, pr: 2 }}>
                    <List>
                        <ListItem button="true" selected={selectedSection === 'General'} onClick={() => setSelectedSection('General')}>
                            <PersonIcon sx={{ mr: 1 }} />
                            <ListItemText primary="General" />
                        </ListItem>
                        <ListItem button="true" selected={selectedSection === 'Password'} onClick={() => setSelectedSection('Password')}>
                            <PasswordIcon sx={{ mr: 1 }} />
                            <ListItemText primary="Password" />
                        </ListItem>
                        <ListItem button="true" selected={selectedSection === 'Email'} onClick={() => setSelectedSection('Email')}>
                            <EmailIcon sx={{ mr: 1 }} />
                            <ListItemText primary="Email" />
                        </ListItem>
                    </List>
                </Box>

                {/* Content Area */}
                <Box sx={{ width: '70%', pl: 2 }}>
                    {selectedSection === 'General' ? renderGeneralSettings() : selectedSection === 'Password' ? renderPasswordSettings() : renderEmailSettings()}
                </Box>

                <Snackbar 
                    open={snackbarOpen}
                    anchorOrigin={{horizontal: 'center', vertical: 'top'}}
                    autoHideDuration={2000} 
                    onClose={() => setSnackbarOpen(false)}
                    message="Settings have been successfully updated!" 
                />
            </Box>
        </Modal>
    );
};

export default SettingsModal;
