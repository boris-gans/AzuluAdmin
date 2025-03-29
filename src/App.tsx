import React, { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginModal from "./components/auth/LoginModal";
import Dashboard from "./components/Dashboard";
import theme from "./theme";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h1"
            fontSize="3rem"
            fontWeight="700"
            letterSpacing="-0.03em"
          >
            AZULU
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please log in to access the admin dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpenLoginModal}
            sx={{
              px: 4,
              py: 1.5,
              borderBottom: "4px solid #000",
              borderRight: "4px solid #000",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translate(-2px, -2px)",
                boxShadow: "6px 6px 0 rgba(0,0,0,0.2)",
              },
              "&:active": {
                transform: "translate(0px, 0px)",
                boxShadow: "0px 0px 0 rgba(0,0,0,0.2)",
                borderBottom: "2px solid #000",
                borderRight: "2px solid #000",
              },
            }}
          >
            Admin Login
          </Button>
          <LoginModal open={isLoginModalOpen} onClose={handleCloseLoginModal} />
        </Box>
      </Container>
    );
  }

  return <Dashboard />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
