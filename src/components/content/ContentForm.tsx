import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Content, ContentCreate, ContentUpdate } from "../../types";
import apiService from "../../services/api";

// Create wrapper components for Grid to fix TypeScript errors
const GridContainer = (props: any) => <Grid container {...props} />;
const GridItem = (props: any) => <Grid {...props} />;

interface ContentFormProps {
  open: boolean;
  content: Content | null;
  onClose: () => void;
  onSubmit: () => void;
}

const EMPTY_CONTENT: ContentCreate = {
  key: "",
  string_collection: [],
  big_string: "",
};

const ContentForm: React.FC<ContentFormProps> = ({
  open,
  content,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ContentCreate | ContentUpdate>(
    EMPTY_CONTENT
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stringInput, setStringInput] = useState("");
  const [keyError, setKeyError] = useState("");

  const isEditMode = !!content;
  const isMovingBanner =
    content?.key === "movingBanner" ||
    (!isEditMode && "key" in formData && formData.key === "movingBanner");
  const isAboutPage =
    content?.key === "aboutPage" ||
    (!isEditMode && "key" in formData && formData.key === "aboutPage");

  useEffect(() => {
    if (content) {
      setFormData({ ...content });
    } else {
      setFormData({ ...EMPTY_CONTENT });
    }

    // Set default key if it's a special content type being created
    if (!content && window.location.search.includes("type=movingBanner")) {
      setFormData((prev) => ({ ...prev, key: "movingBanner" }));
    } else if (!content && window.location.search.includes("type=aboutPage")) {
      setFormData((prev) => ({ ...prev, key: "aboutPage" }));
    }
  }, [content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "key") {
      setKeyError("");
    }
  };

  const handleAddString = () => {
    if (stringInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        string_collection: [
          ...(prev.string_collection || []),
          stringInput.trim(),
        ],
      }));
      setStringInput("");
    }
  };

  const handleRemoveString = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      string_collection: (prev.string_collection || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate key if creating new content - using type guard to check if key exists
    if (
      !isEditMode &&
      (!("key" in formData) || !formData.key || formData.key.trim() === "")
    ) {
      setKeyError("Key is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isEditMode && content) {
        const updateData: ContentUpdate = {};
        if (formData.string_collection)
          updateData.string_collection = formData.string_collection;
        if (formData.big_string !== undefined)
          updateData.big_string = formData.big_string;

        await apiService.updateContent(content.key, updateData);
      } else {
        // Type assertion here since we know it's ContentCreate if not in edit mode
        await apiService.createContent(formData as ContentCreate);
      }
      onSubmit();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("A content item with this key already exists.");
      } else {
        setError("Failed to save content. Please try again.");
      }
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
          <Typography variant="h6">
            {isEditMode
              ? `Edit Content: ${content.key}`
              : isMovingBanner
              ? "Moving Banner Settings"
              : isAboutPage
              ? "About Page Content"
              : "Create New Content"}
          </Typography>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <GridContainer spacing={2}>
              {!isEditMode && !isMovingBanner && !isAboutPage && (
                <GridItem xs={12}>
                  <TextField
                    name="key"
                    label="Content Key"
                    fullWidth
                    value={"key" in formData ? formData.key : ""}
                    onChange={handleChange}
                    required
                    error={!!keyError}
                    helperText={keyError}
                    disabled={isEditMode}
                  />
                </GridItem>
              )}

              {/* Hidden field for predefined keys */}
              {!isEditMode && (isMovingBanner || isAboutPage) && (
                <input
                  type="hidden"
                  name="key"
                  value={isMovingBanner ? "movingBanner" : "aboutPage"}
                />
              )}

              {isMovingBanner && (
                <GridItem xs={12}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    The moving banner displays a rotating series of text
                    elements at the top of the homepage. Each string you add
                    will display as a separate item in the banner.
                  </Typography>
                </GridItem>
              )}

              {(isMovingBanner || (!isAboutPage && !isMovingBanner)) && (
                <GridItem xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">
                      {isMovingBanner ? "Banner Items" : "String Collection"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {isMovingBanner
                        ? "Add text items to display in the rotating banner"
                        : "Add strings that will be displayed as a collection (e.g., FAQs, list items)"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      value={stringInput}
                      onChange={(e) => setStringInput(e.target.value)}
                      label={isMovingBanner ? "Add banner item" : "Add string"}
                      size="small"
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddString}
                      disabled={!stringInput.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(formData.string_collection || []).map((str, index) => (
                      <Chip
                        key={index}
                        label={
                          str.length > 20 ? `${str.substring(0, 20)}...` : str
                        }
                        onDelete={() => handleRemoveString(index)}
                      />
                    ))}
                  </Box>
                </GridItem>
              )}

              {(isAboutPage || (!isAboutPage && !isMovingBanner)) && (
                <GridItem xs={12}>
                  <TextField
                    name="big_string"
                    label={isAboutPage ? "About Page Content" : "Big String"}
                    fullWidth
                    multiline
                    rows={isAboutPage ? 10 : 6}
                    value={formData.big_string || ""}
                    onChange={handleChange}
                    helperText={
                      isAboutPage
                        ? "This text will be displayed on the About page"
                        : "Large text content like terms of service, about text, etc."
                    }
                  />
                </GridItem>
              )}
            </GridContainer>
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
                : isEditMode
                ? "Update Content"
                : "Create Content"}
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default ContentForm;
