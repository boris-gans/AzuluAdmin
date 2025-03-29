import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import apiService from "../../services/api";
import { Content } from "../../types";
import ContentForm from "./ContentForm";
import MovingBannerForm from "./MovingBannerForm";
import AboutPageForm from "./AboutPageForm";

// Custom DeleteConfirmationDialog component
const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  contentKey?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ open, contentKey, onClose, onConfirm, isDeleting }) => {
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
        zIndex: 1400,
      }}
    >
      <Paper
        elevation={24}
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 24,
        }}
      >
        <div className="modal-header" style={{ marginBottom: 16 }}>
          <Typography variant="h6">Delete Content</Typography>
        </div>

        <div className="modal-content" style={{ marginBottom: 24 }}>
          <Typography>
            Are you sure you want to delete the content "{contentKey}"? This
            action cannot be undone.
          </Typography>
        </div>

        <div
          className="modal-footer"
          style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
        >
          <Button onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Paper>
    </div>
  );
};

const ContentList: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [isAboutFormOpen, setIsAboutFormOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContents();
      setContents(data);
      setError("");
    } catch (err) {
      setError("Failed to load content. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleOpenForm = (content?: Content) => {
    // Don't use ContentForm for special content types
    if (content?.key === "movingBanner") {
      openBannerForm();
      return;
    }

    if (content?.key === "aboutPage") {
      openAboutForm();
      return;
    }

    setSelectedContent(content || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedContent(null);
  };

  const handleFormSubmit = () => {
    handleCloseForm();
    fetchContents();
  };

  // Banner form handlers
  const openBannerForm = () => {
    setIsBannerFormOpen(true);
  };

  const closeBannerForm = () => {
    setIsBannerFormOpen(false);
  };

  const handleBannerSubmit = () => {
    closeBannerForm();
    fetchContents();
  };

  // About page form handlers
  const openAboutForm = () => {
    setIsAboutFormOpen(true);
  };

  const closeAboutForm = () => {
    setIsAboutFormOpen(false);
  };

  const handleAboutSubmit = () => {
    closeAboutForm();
    fetchContents();
  };

  const createOrEditMovingBanner = () => {
    openBannerForm();
  };

  const createOrEditAboutPage = () => {
    openAboutForm();
  };

  const truncateString = (str: string, length = 50) => {
    if (!str) return "";
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  const formatStringCollection = (collection: string[]) => {
    if (!collection || collection.length === 0) return "No items";
    return `${collection.length} items`;
  };

  const getContentTypeLabel = (content: Content) => {
    if (content.key === "movingBanner") return "Moving Banner";
    if (content.key === "aboutPage") return "About Page";
    return "Custom Content";
  };

  const handleDeleteDialogOpen = (content: Content) => {
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setContentToDelete(null);
  };

  const handleDeleteContent = async () => {
    if (!contentToDelete) return;

    try {
      setIsDeleting(true);
      await apiService.deleteContent(contentToDelete.key);
      fetchContents();
      setIsDeleteDialogOpen(false);
      setContentToDelete(null);
    } catch (err) {
      setError("Failed to delete content. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && contents.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Content</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={createOrEditMovingBanner}
          >
            {contents.some((c) => c.key === "movingBanner") ? "Edit" : "Create"}{" "}
            Moving Banner
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={createOrEditAboutPage}
          >
            {contents.some((c) => c.key === "aboutPage") ? "Edit" : "Create"}{" "}
            About Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenForm()}
          >
            New Custom Content
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>String Collection</TableCell>
              <TableCell>Big String</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No content found. Create your first content item!
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.key}</TableCell>
                  <TableCell>{getContentTypeLabel(content)}</TableCell>
                  <TableCell>
                    {formatStringCollection(content.string_collection)}
                  </TableCell>
                  <TableCell>{truncateString(content.big_string)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenForm(content)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteDialogOpen(content)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isFormOpen && (
        <ContentForm
          open={isFormOpen}
          content={selectedContent}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}

      <MovingBannerForm
        open={isBannerFormOpen}
        onClose={closeBannerForm}
        onSubmit={handleBannerSubmit}
      />

      <AboutPageForm
        open={isAboutFormOpen}
        onClose={closeAboutForm}
        onSubmit={handleAboutSubmit}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        contentKey={contentToDelete?.key}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteContent}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ContentList;
