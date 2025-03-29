import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(password);
      if (success) {
        setPassword("");
        onClose();
      } else {
        setError("Invalid admin password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.2)",
          border: "1px solid #000",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid #000",
          py: 2,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        ADMIN LOGIN
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <LockOutlined fontSize="large" sx={{ mb: 1.5 }} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              Enter admin password to access the CRM
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Admin Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
                borderWidth: 1,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: "black",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ px: 3, pb: 3, pt: 0, justifyContent: "space-between" }}
        >
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant="outlined"
            sx={{
              borderWidth: 1,
              "&:hover": {
                borderWidth: 1,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              minWidth: "100px",
              borderBottom: "3px solid #000",
              borderRight: "3px solid #000",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translate(-2px, -2px)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              },
              "&:active": {
                transform: "translate(0px, 0px)",
                boxShadow: "0px 0px 0 rgba(0,0,0,0.2)",
                borderBottom: "1px solid #000",
                borderRight: "1px solid #000",
              },
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal;
