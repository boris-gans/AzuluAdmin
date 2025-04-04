import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import apiService from "../../services/api";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  required?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  label = "Upload Image",
  required = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentImage || null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Effect to upload file automatically when selected
  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file before proceeding
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        showSnackbar(validationError, "error");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      const errorMsg = "Please select a file to upload";
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus("Uploading image...");
      setError("");

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Get the stored auth token
      const authToken = localStorage.getItem("adminPassword");
      if (!authToken) {
        throw new Error("Authentication required");
      }

      // Post directly to the backend upload endpoint
      const response = await fetch(
        "https://azulucms.onrender.com/upload/image",
        {
          method: "POST",
          headers: {
            "X-Admin-Password": authToken,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Upload failed with status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success && result.url) {
        setUploadStatus("Upload successful!");
        onImageUploaded(result.url);
        showSnackbar("Image uploaded successfully!", "success");
      } else {
        throw new Error("Upload failed: No valid URL returned");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMsg = `Error: ${error.message || "Unknown error occurred"}`;
      setError(errorMsg);
      showSnackbar(errorMsg, "error");
      // Don't clear the selected file so user can retry with the same file
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    onImageUploaded("");
    showSnackbar("Image removed", "info");
  };

  return (
    <Box
      sx={{
        mt: 2,
        ...(required && !imagePreview
          ? {
              boxShadow: "0 0 0 2px rgba(255, 0, 0, 0.2)",
              borderRadius: "4px",
            }
          : {}),
      }}
    >
      {imagePreview ? (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 1,
              mb: 1,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </Paper>
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveImage}
            sx={{ mb: 1 }}
            startIcon={<CloudUploadIcon />}
          >
            Replace Image
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px dashed #ccc",
            borderRadius: "4px",
            p: 2,
            mb: 1,
          }}
        >
          <Button
            component="label"
            variant="contained"
            color="primary"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{
              mb: 1,
              backgroundColor: "#000",
              borderBottom: "3px solid #000",
              borderRight: "3px solid #000",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#000",
                transform: "translate(-2px, -2px)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              },
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              label
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          <Typography variant="caption" color="text.secondary">
            Maximum file size: 5MB. Formats: JPG, PNG, GIF, WebP
          </Typography>
          {required && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              * Image is required
            </Typography>
          )}
        </Box>
      )}

      {uploadStatus && (
        <Typography
          variant="body2"
          color="primary"
          sx={{ mt: 0.5, textAlign: "center" }}
        >
          {uploadStatus}
        </Typography>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImageUploader;
