import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import { Content, ContentCreate, ContentUpdate } from "../../types";
import apiService from "../../services/api";

interface MovingBannerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const BANNER_KEY = "movingBanner";

const MovingBannerForm: React.FC<MovingBannerFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [bannerItems, setBannerItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState("");
  const [existingBanner, setExistingBanner] = useState<Content | null>(null);

  // Fetch existing banner content
  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        setFetching(true);
        const content = await apiService
          .getContent(BANNER_KEY)
          .catch(() => null);
        if (content) {
          setExistingBanner(content);
          setBannerItems(content.string_collection || []);
        }
      } catch (err) {
        console.error("Error fetching banner content:", err);
      } finally {
        setFetching(false);
      }
    };

    if (open) {
      fetchBannerContent();
    }
  }, [open]);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setBannerItems([...bannerItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newItem.trim()) {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (index: number) => {
    setBannerItems(bannerItems.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...bannerItems];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    setBannerItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === bannerItems.length - 1) return;
    const newItems = [...bannerItems];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    setBannerItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (existingBanner) {
        // Update existing banner
        await apiService.updateContent(BANNER_KEY, {
          string_collection: bannerItems,
        });
      } else {
        // Create new banner
        await apiService.createContent({
          key: BANNER_KEY,
          string_collection: bannerItems,
          big_string: "",
        });
      }
      onSubmit();
    } catch (err: any) {
      setError("Failed to save banner. Please try again.");
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
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "auto",
          padding: 24,
        }}
      >
        <div className="modal-header" style={{ marginBottom: 16 }}>
          <Typography variant="h6">Moving Banner Settings</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            The moving banner displays a rotating series of text elements at the
            top of the homepage. Each item will appear in sequence.
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
                <Typography variant="subtitle1" gutterBottom>
                  Banner Items
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    label="Add banner item"
                    placeholder="Enter text to display in banner"
                    size="small"
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddItem}
                    disabled={!newItem.trim()}
                  >
                    Add
                  </Button>
                </Box>

                {bannerItems.length === 0 ? (
                  <Typography color="textSecondary">
                    No items added yet. Add items to appear in the moving
                    banner.
                  </Typography>
                ) : (
                  <Box>
                    {bannerItems.map((item, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 1,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>{item}</Typography>
                        <Box>
                          <Button
                            size="small"
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                          >
                            ↑
                          </Button>
                          <Button
                            size="small"
                            disabled={index === bannerItems.length - 1}
                            onClick={() => handleMoveDown(index)}
                          >
                            ↓
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                          >
                            ✕
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Preview:</Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    mt: 1,
                    borderLeft: "4px solid #1976d2",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: 3, overflowX: "auto", py: 1 }}
                  >
                    {bannerItems.length > 0 ? (
                      bannerItems.map((item, index) => (
                        <Typography
                          key={index}
                          variant="subtitle1"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {item}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="subtitle1" color="textSecondary">
                        Banner preview will appear here
                      </Typography>
                    )}
                  </Box>
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
                  : existingBanner
                  ? "Update Banner"
                  : "Create Banner"}
              </Button>
            </div>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default MovingBannerForm;
