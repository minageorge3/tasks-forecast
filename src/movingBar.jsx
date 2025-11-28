import { Box, useTheme } from "@mui/material";
import { keyframes } from "@mui/system";

// 1. Define the Zoom Animation
const zoomInOut = keyframes`
  0%, 100% { transform: scale(0.5); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
`;

const LinearDotLoading = ({ color = "primary", sx }) => {
  const theme = useTheme();

  // Helper to get the actual hex color from the theme string (e.g., 'primary' -> #1976d2)
  const themeColor = theme.palette[color]?.main || color;

  const dotStyle = {
    width: 8, 
    height: 8,
    borderRadius: "50%",
    backgroundColor: themeColor,
    animation: `${zoomInOut} 1.7s infinite ease-in-out both`,
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centers the dots like a loader
        alignItems: "center",
        gap: 1.5, // Space between dots
        // width: "100%", // Acts like LinearProgress (full width)
        padding: .2,
        ml:"1rem",
        ...sx,
      }}
    >
      <Box sx={{ ...dotStyle, animationDelay: "-0.32s" }} />
      <Box sx={{ ...dotStyle, animationDelay: "-0.16s" }} />
      <Box sx={{ ...dotStyle, animationDelay: "0s" }} />
    </Box>
  );
};

export default LinearDotLoading;
