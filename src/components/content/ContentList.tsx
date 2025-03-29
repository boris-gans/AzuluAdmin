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
import { Edit as EditIcon } from "@mui/icons-material";
import apiService from "../../services/api";
import { Content } from "../../types";
import ContentForm from "./ContentForm";

const ContentList: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const truncateString = (str: string, length = 50) => {
    if (!str) return "";
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  const formatStringCollection = (collection: string[]) => {
    if (!collection || collection.length === 0) return "No items";
    return `${collection.length} items`;
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm()}
        >
          New Content
        </Button>
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
              <TableCell>String Collection</TableCell>
              <TableCell>Big String</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No content found. Create your first content item!
                </TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.key}</TableCell>
                  <TableCell>
                    {formatStringCollection(content.string_collection)}
                  </TableCell>
                  <TableCell>{truncateString(content.big_string)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenForm(content)}
                    >
                      <EditIcon />
                    </IconButton>
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
    </>
  );
};

export default ContentList;
