import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress, size = "40", showPercentage = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  return (
    <Box position="relative" display="flex" alignItems="center" justifyContent="center">
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.redAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[600]}`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          color: colors.grey[100],
          textAlign: "center",
          lineHeight: `${size}px`, // Wyśrodkowanie tekstu w pionie
          width: `${size}px`, // Wyśrodkowanie tekstu w poziomie
        }}
      >
        {showPercentage ? (progress * 100).toFixed(2) + "%" : ''}
      </Typography>
    </Box>
  );
};

export default ProgressCircle;
