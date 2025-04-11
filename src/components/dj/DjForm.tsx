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

interface DjFormProps {
  open: boolean;
  dj: Dj | null;
  onClose: () => void;
  onSubmit: () => void;
}

const EMPTY_DJ: DjCreate = {
  alias: "",
  profile_url: "",
  DjSocials: {
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
      if (!djData.DjSocials) {
        djData.DjSocials = {
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
      DjSocials: {
        ...prev.DjSocials,
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
                        <ImageUploader
                          onImageUploaded={(imageUrl) => {
                            setFormData((prev) => ({
                              ...prev,
                              profile_url: imageUrl,
                            }));
                          }}
                          currentImage={formData.profile_url}
                          label="Upload Profile Image"
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
                        value={formData.DjSocials?.instagram || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://instagram.com/username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <InstagramIcon sx={{ color: '#C13584' }} />
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
                        value={formData.DjSocials?.spotify || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://open.spotify.com/artist/..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MusicNoteIcon sx={{ color: '#1DB954' }} />
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
                        value={formData.DjSocials?.soundcloud || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://soundcloud.com/username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MusicNoteIcon sx={{ color: '#FF7700' }} />
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
                        value={formData.DjSocials?.apple_music || ""}
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
                        value={formData.DjSocials?.youtube || ""}
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
                        value={formData.DjSocials?.tiktok || ""}
                        onChange={handleSocialChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://tiktok.com/@username"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TikTokIcon sx={{ color: '#000000' }} />
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
