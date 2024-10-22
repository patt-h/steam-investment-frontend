import { useEffect, useState } from 'react';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmAccount, resendToken } from '../../components/TokenApi';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ConfirmAccount = () => {
    const [confirmationStatus, setConfirmationStatus] = useState('success');
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const location = useLocation();
    const navigate = useNavigate();

    const getTokenFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('token');
    };

    useEffect(() => {
        const token = getTokenFromUrl();

        if (token) {
            confirmAccount(token)
                .then(() => {
                    setConfirmationStatus('success');
                    setTimeout(() => navigate('/'), 3000);
                })
                .catch(() => {
                    setConfirmationStatus('error');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setConfirmationStatus('error');
            setLoading(false);
        }
    }, [location, navigate]);

    const handleResend = async () => {
        const token = getTokenFromUrl();
        setIsLoading(true);
        setIsButtonDisabled(true);
        if (token) {
            try {
                await resendToken(token);
                setSnackbarMessage('New activation link has been sent successfully. Please check your email.');
                setSnackbarSeverity('success');
            } catch (error) {
                setSnackbarMessage('Sending new activation link failed. Please check the validity of the token and try again.');
                setSnackbarSeverity('error');
                setIsButtonDisabled(false);
            } finally {
                setIsLoading(false);
            }
        }
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <>
        <div className="wrapper" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            {loading ? (
                <p>Checking token...</p>
            ) : (
                <div className="confirmation-message" style={{ textAlign: 'center' }}>
                    {confirmationStatus === 'success' ? (
                        <div className="success-message">
                            <CheckCircleIcon style={{ color: "#22bb33", fontSize: '60px' }} />
                            <h2>Your account has been confirmed!</h2>
                            <p>You will be redirected to the login page in 3 seconds</p>
                        </div>
                    ) : (
                        <div className="error-message" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '10px',
                            padding: '10px'

                        }}>
                            <CancelIcon style={{ color: "#bb2222", fontSize: '60px' }} />
                            <h2>Token expired or invalid</h2>
                            <p>Send new activation link to complete registration, click the button below</p>
                            <button onClick={handleResend} disabled={isLoading || isButtonDisabled}>
                                {isLoading ? <CircularProgress size={24} style={{ color: '#555' }} /> : 'Send new token'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        <Snackbar 
            open={snackbarOpen}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
        >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                {snackbarMessage}
            </Alert>

        </Snackbar>
        </>
    );
};

export default ConfirmAccount;
