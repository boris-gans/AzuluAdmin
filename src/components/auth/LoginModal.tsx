import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
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

  // Close modal with ESC key
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError("Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <Paper
        elevation={4}
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          maxWidth: "350px",
          borderRadius: 0,
          border: "1px solid #000",
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            ADMIN LOGIN
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ p: 3 }}>
            <Typography align="center" sx={{ mb: 2 }}>
              <LockOutlined sx={{ mb: 1 }} />
            </Typography>

            <TextField
              autoFocus
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              pt: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting && <CircularProgress size={16} color="inherit" />
              }
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default LoginModal;
