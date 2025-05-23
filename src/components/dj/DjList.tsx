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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Apple as AppleIcon,
} from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TikTokIcon from "@mui/icons-material/TouchApp"; // Using TouchApp as TikTok placeholder
import apiService from "../../services/api";
import { Dj } from "../../types";
import DjForm from "./DjForm";

const DjList: React.FC = () => {
  const [djs, setDjs] = useState<Dj[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDj, setSelectedDj] = useState<Dj | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [djToDelete, setDjToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDjs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDjs(0, 100);
      setDjs(data);
      // console.log("djs: ", dta);
      setError("");
    } catch (err) {
      setError("Failed to load DJs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDjs();
  }, []);

  const handleOpenForm = (dj?: Dj) => {
    setSelectedDj(dj || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDj(null);
  };

  const handleFormSubmit = () => {
    handleCloseForm();
    fetchDjs();
  };

  const handleDeleteClick = (djId: number) => {
    setDjToDelete(djId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (djToDelete === null) return;

    setIsDeleting(true);
    try {
      await apiService.deleteDj(djToDelete);
      await fetchDjs();
    } catch (err) {
      setError("Failed to delete DJ. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDjToDelete(null);
    }
  };

  // Render social platform icons with links
  const renderSocialIcons = (dj: Dj) => {
    if (!dj.socials) return <Typography variant="caption">No socials available</Typography>;

    const socials = dj.socials;
    const socialIcons = [];

    if (socials.instagram) {
      socialIcons.push(
        <IconButton 
          key="instagram" 
          component="a" 
          href={socials.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#C13584' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </IconButton>
      );
    }
    
    if (socials.spotify) {
      socialIcons.push(
        <IconButton 
          key="spotify" 
          component="a" 
          href={socials.spotify} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#1DB954' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </IconButton>
      );
    }
    
    if (socials.soundcloud) {
      socialIcons.push(
        <IconButton 
          key="soundcloud" 
          component="a" 
          href={socials.soundcloud} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#FF7700' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
          </svg>
        </IconButton>
      );
    }
    
    if (socials.tiktok) {
      socialIcons.push(
        <IconButton 
          key="tiktok" 
          component="a" 
          href={socials.tiktok} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#000000' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </IconButton>
      );
    }

    return (
      <Stack direction="row" spacing={0.5}>
        {socialIcons.length > 0 ? socialIcons : <Typography variant="caption">No active socials</Typography>}
      </Stack>
    );
  };

  if (loading && djs.length === 0) {
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
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          DJs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm()}
          startIcon={<AddIcon />}
          sx={{
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
        >
          New DJ
        </Button>
      </Box>

      {error && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            border: "1px solid #f44336",
            backgroundColor: "rgba(244,67,54,0.05)",
          }}
        >
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Box sx={{ px: 4 }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
            mb: 4,
          }}
        >
          <Table sx={{ mx: "0" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "60px" }}>
                  Profile
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  DJ Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Social Media
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "120px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {djs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", color: "text.secondary" }}
                    >
                      No DJs found. Add your first DJ!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                djs.map((dj) => (
                  <TableRow
                    key={dj.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenForm(dj)}
                  >
                    <TableCell>
                      <Avatar 
                        src={dj.profile_url} 
                        alt={dj.alias}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: "1px solid #eee" 
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{dj.alias}</TableCell>
                    <TableCell>{renderSocialIcons(dj)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenForm(dj);
                          }}
                          sx={{
                            border: "1px solid",
                            borderColor: "primary.main",
                            p: "4px",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(dj.id);
                          }}
                          sx={{
                            border: "1px solid",
                            borderColor: "error.main",
                            p: "4px",
                            "&:hover": {
                              backgroundColor: "rgba(244,67,54,0.05)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {isFormOpen && (
        <DjForm
          open={isFormOpen}
          dj={selectedDj}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.2)",
            border: "1px solid #000",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete DJ</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this DJ? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
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
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderBottom: "2px solid #c62828",
              borderRight: "2px solid #c62828",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DjList;
