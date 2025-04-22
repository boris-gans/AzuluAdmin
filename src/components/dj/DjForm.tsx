import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Apple as AppleIcon,
} from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TikTokIcon from "@mui/icons-material/TouchApp"; // Using TouchApp as TikTok placeholder
import { Dj, DjCreate, DjUpdate } from "../../types";
import apiService from "../../services/api";
import ImageUploader from "../common/ImageUploader";

// Create wrapper components for Grid to fix TypeScript errors
const GridContainer = (props: any) => <Grid container {...props} />;
const GridItem = (props: any) => <Grid item {...props} />;

// ------------------------------------------------------------
// spotify
// <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
// <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
// </svg>

// tiktok
{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
</svg> */}

// soundcloud
{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
<path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
</svg> */}

// instagram
{/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
</svg> */}



interface DjFormProps {
  open: boolean;
  dj: Dj | null;
  onClose: () => void;
  onSubmit: () => void;
}

const EMPTY_DJ: DjCreate = {
  alias: "",
  profile_url: "",
  socials: {
    instagram: "",
    spotify: "",
    soundcloud: "",
    apple_music: "",
    youtube: "",
    tiktok: "",
  },
};

const DjForm: React.FC<DjFormProps> = ({
  open,
  dj,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DjCreate | DjUpdate>(EMPTY_DJ);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when dialog opens or dj changes
  useEffect(() => {
    if (dj) {
      // Clone the DJ data for editing
      const djData = { ...dj };
      
      // Ensure DjSocials is initialized properly
      if (!djData.socials) {
        djData.socials = {
          id: 0,
          instagram: "",
          spotify: "",
          soundcloud: "",
          apple_music: "",
          youtube: "",
          tiktok: "",
        };
      }
      
      setFormData(djData);
    } else {
      setFormData({ ...EMPTY_DJ });
    }
  }, [dj, open]);

  // Simple input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Social media field change handler
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value,
      },
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.alias) {
      setError("DJ name is required");
      setLoading(false);
      return;
    }

    try {
      if (dj) {
        await apiService.updateDj(dj.id, formData);
      } else {
        await apiService.createDj(formData as DjCreate);
      }
      onSubmit();
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.detail || "An error occurred while saving the DJ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
          }}
          onClick={onClose}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 24px 38px rgba(0,0,0,0.25)",
              padding: 0,
              width: "90%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                borderBottom: "1px solid #eaeaea",
                padding: "24px 32px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.5px",
                  color: "#111",
                }}
              >
                {dj ? "Edit DJ" : "Add New DJ"}
              </Typography>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: "32px" }}>
                {error && (
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      bgcolor: "rgba(255, 0, 0, 0.05)",
                      borderRadius: 2,
                      border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                  >
                    <Typography color="#d32f2f" fontWeight={500}>
                      {error}
                    </Typography>
                  </Box>
                )}

                <div style={{ marginBottom: "48px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#666",
                    }}
                  >
                    Basic Information
                  </Typography>

                  <GridContainer spacing={3}>
                    <GridItem xs={12}>
                      <TextField
                        name="alias"
                        label="DJ Name"
                        fullWidth
                        required
                        value={formData.alias || ""}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12}>
                      <Box sx={{ mt: 4, mb: 3 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 2,
                            fontWeight: 500,
                            color: "#333",
                          }}
                        >
                          Profile Image
                        </Typography>
                        {formData.profile_url && (
                          <Box sx={{ mb: 2 }}>
                            <img
                              src={formData.profile_url}
                              alt="DJ Profile"
                              style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "contain",
                                borderRadius: "8px",
                                marginBottom: "16px"
                              }}
                            />
                          </Box>
                        )}
                        <ImageUploader
                          onImageUploaded={(imageUrl) => {
                            setFormData((prev) => ({
                              ...prev,
                              profile_url: imageUrl,
                            }));
                          }}
                          currentImage={formData.profile_url}
                          label={formData.profile_url ? "Change Profile Image" : "Upload Profile Image"}
                          required={true}
                        />
                      </Box>
                    </GridItem>
                  </GridContainer>
                </div>

                <div style={{ marginBottom: "48px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#666",
                    }}
                  >
                    Social Media Links
                  </Typography>

                  <GridContainer spacing={3}>
                    <GridItem xs={12} md={6}>
                      <TextField
                        name="instagram"
                        label="Instagram"
                        fullWidth
                        value={formData.socials?.instagram || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://instagram.com/username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#C13584">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="spotify"
                        label="Spotify"
                        fullWidth
                        value={formData.socials?.spotify || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://open.spotify.com/artist/..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                              </svg>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="soundcloud"
                        label="SoundCloud"
                        fullWidth
                        value={formData.socials?.soundcloud || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://soundcloud.com/username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FF7700">
                                <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
                              </svg>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="apple_music"
                        label="Apple Music"
                        fullWidth
                        value={formData.socials?.apple_music || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://music.apple.com/..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AppleIcon sx={{ color: '#FB2D3F' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="youtube"
                        label="YouTube"
                        fullWidth
                        value={formData.socials?.youtube || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://youtube.com/@channel"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <YouTubeIcon sx={{ color: '#FF0000' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="tiktok"
                        label="TikTok"
                        fullWidth
                        value={formData.socials?.tiktok || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://tiktok.com/@username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#000000">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                              </svg>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </div>
              </div>

              <div
                style={{
                  padding: "24px 32px",
                  borderTop: "1px solid #eaeaea",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Button
                  onClick={onClose}
                  disabled={loading}
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    backgroundColor: "#000",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  {loading
                    ? "Saving..."
                    : dj
                    ? "Update DJ"
                    : "Add DJ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DjForm;
