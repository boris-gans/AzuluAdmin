import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Content, ContentCreate, ContentUpdate } from "../../types";
import apiService from "../../services/api";

interface AboutPageFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ABOUT_PAGE_KEY = "aboutPage";

const AboutPageForm: React.FC<AboutPageFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [aboutContent, setAboutContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [existingAboutPage, setExistingAboutPage] = useState<Content | null>(
    null
  );

  // Fetch existing about page content
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setFetching(true);
        const content = await apiService
          .getContent(ABOUT_PAGE_KEY)
          .catch(() => null);
        if (content) {
          setExistingAboutPage(content);
          setAboutContent(content.big_string || "");
        }
      } catch (err) {
        console.error("Error fetching about page content:", err);
      } finally {
        setFetching(false);
      }
    };

    if (open) {
      fetchAboutContent();
    }
  }, [open]);

  const handleContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAboutContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (existingAboutPage) {
        // Update existing about page
        await apiService.updateContent(ABOUT_PAGE_KEY, {
          big_string: aboutContent,
        });
      } else {
        // Create new about page
        await apiService.createContent({
          key: ABOUT_PAGE_KEY,
          string_collection: [],
          big_string: aboutContent,
        });
      }
      onSubmit();
    } catch (err: any) {
      setError("Failed to save about page. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <Paper
        elevation={24}
        style={{
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflow: "auto",
          padding: 24,
        }}
      >
        <div className="modal-header" style={{ marginBottom: 16 }}>
          <Typography variant="h6">About Page Content</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This text will be displayed on the About page of your website.
          </Typography>
        </div>

        {fetching ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-content">
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="About Page Content"
                  multiline
                  rows={15}
                  fullWidth
                  value={aboutContent}
                  onChange={handleContentChange}
                  placeholder="Enter the content for your About page"
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Preview:
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: "#f5f5f5",
                    mt: 1,
                    borderLeft: "4px solid #1976d2",
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {aboutContent ? (
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      {aboutContent}
                    </Typography>
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      Your About page content will appear here
                    </Typography>
                  )}
                </Paper>
              </Box>
            </div>

            <div
              className="modal-footer"
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <Button onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading
                  ? "Saving..."
                  : existingAboutPage
                  ? "Update About Page"
                  : "Create About Page"}
              </Button>
            </div>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default AboutPageForm;
