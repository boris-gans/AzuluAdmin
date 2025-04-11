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
    if (!dj.DjSocials) return <Typography variant="caption">No socials available</Typography>;

    const socials = dj.DjSocials;
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
          <InstagramIcon fontSize="small" />
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
          <MusicNoteIcon fontSize="small" />
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
          <MusicNoteIcon fontSize="small" />
        </IconButton>
      );
    }
    
    if (socials.apple_music) {
      socialIcons.push(
        <IconButton 
          key="apple_music" 
          component="a" 
          href={socials.apple_music} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#FB2D3F' }}
        >
          <AppleIcon fontSize="small" />
        </IconButton>
      );
    }
    
    if (socials.youtube) {
      socialIcons.push(
        <IconButton 
          key="youtube" 
          component="a" 
          href={socials.youtube} 
          target="_blank" 
          rel="noopener noreferrer"
          size="small"
          sx={{ color: '#FF0000' }}
        >
          <YouTubeIcon fontSize="small" />
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
          <TikTokIcon fontSize="small" />
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
