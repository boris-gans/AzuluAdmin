import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Chip,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO, isValid, format } from "date-fns";
import { Event, EventCreate, EventUpdate } from "../../types";
import apiService from "../../services/api";
import ImageUploader from "../common/ImageUploader";

// Create wrapper components for Grid to fix TypeScript errors
const GridContainer = (props: any) => <Grid container {...props} />;
const GridItem = (props: any) => <Grid item {...props} />;

// Predefined options
const TICKET_STATUS_OPTIONS = ["Available", "Sold Out", "Sold At The Door"];
const CURRENCY_OPTIONS = [
  { label: "Select Currency", value: "" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "USD ($)", value: "USD" },
  { label: "CAD (C$)", value: "CAD" },
  { label: "AUD (A$)", value: "AUD" },
];
const GENRE_OPTIONS = [
  "Deep House",
  "Afro House",
  "Electronic",
  "Techno",
  "House",
  "Melodic Techno",
  "Progressive House",
  "Disco",
];

// Common timezones
const TIMEZONE_OPTIONS = [
  { label: "Amsterdam", value: "Europe/Amsterdam" },
  { label: "New York", value: "America/New_York" },
  { label: "Los Angeles", value: "America/Los_Angeles" },
  { label: "Chicago", value: "America/Chicago" },
  { label: "London", value: "Europe/London" },
  { label: "Paris", value: "Europe/Paris" },
  { label: "Berlin", value: "Europe/Berlin" },
  { label: "Rome", value: "Europe/Rome" },
  { label: "Madrid", value: "Europe/Madrid" },
  { label: "Stockholm", value: "Europe/Stockholm" },
  { label: "Oslo", value: "Europe/Oslo" },
  { label: "Helsinki", value: "Europe/Helsinki" },
  { label: "Warsaw", value: "Europe/Warsaw" },
  { label: "Zurich", value: "Europe/Zurich" },
  { label: "Lisbon", value: "Europe/Lisbon" },
  { label: "Athens", value: "Europe/Athens" },
  { label: "Istanbul", value: "Europe/Istanbul" },
  { label: "Dubai", value: "Asia/Dubai" },
  { label: "Shanghai", value: "Asia/Shanghai" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Sydney", value: "Australia/Sydney" },
];

interface EventFormProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onSubmit: () => void;
}

const EMPTY_EVENT: EventCreate = {
  name: "",
  venue_name: "",
  address: "",
  start_date: new Date().toISOString().split('T')[0] + " 00:00:00",
  start_time: "22:00",
  end_time: "01:00",
  time_zone: TIMEZONE_OPTIONS[0].value,
  ticket_status: "Available",
  ticket_link: "",
  lineup: [],
  genres: [],
  description: "",
  poster_url: "",
  price: 0,
  currency: "",
};

const EventForm: React.FC<EventFormProps> = ({
  open,
  event,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EventCreate | EventUpdate>(
    EMPTY_EVENT
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [customGenreInput, setCustomGenreInput] = useState("");

  // Reset form when dialog opens or event changes
  useEffect(() => {
    if (event) {
      console.log(event);
      console.log(event.start_date);
      // const formattedDate = format(event.start_date, "yyyy-MM-dd") + " 00:00:00";
      // console.log(formattedDate);

      setFormData({ ...event });
    } else {
      setFormData({ ...EMPTY_EVENT });
    }
  }, [event, open]);

  // Simple input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Handle select inputs
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Date handling
  const handleDateChange = (name: string, date: Date | null) => {
    if (date && isValid(date)) {
      if (name === "start_date") {
        // Format as YYYY-MM-DD 00:00:00
        const formattedDate = format(date, "yyyy-MM-dd") + " 00:00:00";
        console.log(formattedDate);
        setFormData((prev) => ({ ...prev, [name]: formattedDate }));
      } else if (name === "start_time" || name === "end_time") {
        // Format as HH:MM
        const formattedTime = format(date, "HH:mm");
        setFormData((prev) => ({ ...prev, [name]: formattedTime }));
      }
    }
  };

  // Parse date string to Date object
  const parseDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    try {
      // Handle start_date format (YYYY-MM-DD 00:00:00)
      if (dateString.includes("T")) {
        const datePart = dateString.split("T")[0];
        console.log(datePart);
        return parseISO(datePart);
      } else {
        return null;
      }
      // Handle time format (HH:MM)
      // const [hours, minutes] = dateString.split(":");
      const date = new Date();
      // date.setHours(parseInt(hours, 10));
      // date.setMinutes(parseInt(minutes, 10));
      return isValid(date) ? date : null;
    } catch (e) {
      return null;
    }
  };

  const parseTime = (timeString?: string): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return isValid(date) ? date : null;
  };

  // Lineup management
  const addArtist = () => {
    if (!artistInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      lineup: [...(prev.lineup || []), artistInput.trim()],
    }));
    setArtistInput("");
  };

  const removeArtist = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lineup: (prev.lineup || []).filter((_, i) => i !== index),
    }));
  };

  // Genre management
  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      const currentGenres = prev.genres || [];
      const genreExists = currentGenres.includes(genre);

      return {
        ...prev,
        genres: genreExists
          ? currentGenres.filter((g) => g !== genre)
          : [...currentGenres, genre],
      };
    });
  };

  const addCustomGenre = () => {
    if (
      !customGenreInput.trim() ||
      (formData.genres || []).includes(customGenreInput)
    )
      return;

    setFormData((prev) => ({
      ...prev,
      genres: [...(prev.genres || []), customGenreInput.trim()],
    }));
    setCustomGenreInput("");
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.venue_name || !formData.address || !formData.time_zone || !formData.description || !formData.poster_url || !formData.start_time || !formData.end_time) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      if (event) {
        await apiService.updateEvent(event.id, formData);
      } else {
        await apiService.createEvent(formData as EventCreate);
      }
      onSubmit();
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.detail || "An error occurred while saving the event"
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
                {event ? "Edit Event" : "Create Event"}
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
                        name="name"
                        label="Event Name"
                        fullWidth
                        required
                        value={formData.name || ""}
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

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="venue_name"
                        label="Venue Name"
                        fullWidth
                        required
                        value={formData.venue_name || ""}
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

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="address"
                        label="Address"
                        fullWidth
                        required
                        value={formData.address || ""}
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

                    <GridItem xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date"
                          value={parseDate(formData.start_date)}
                          onChange={(date) =>
                            handleDateChange("start_date", date)
                          }
                          sx={{
                            width: "100%",
                            mt: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="Start Time"
                          value={parseTime(formData.start_time)}
                          onChange={(date) =>
                            handleDateChange("start_time", date)
                          }
                          sx={{
                            width: "100%",
                            mt: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="End Time"
                          value={parseTime(formData.end_time)}
                          onChange={(date) =>
                            handleDateChange("end_time", date)
                          }
                          sx={{
                            width: "100%",
                            mt: 2,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      >
                        <InputLabel>Time Zone</InputLabel>
                        <Select
                          name="time_zone"
                          value={formData.time_zone || ""}
                          label="Time Zone"
                          required={true}
                          onChange={handleSelectChange}
                        >
                          {TIMEZONE_OPTIONS.map((timezone) => (
                            <MenuItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                    Ticket Information
                  </Typography>

                  <GridContainer spacing={3}>
                    <GridItem xs={12} md={6}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      >
                        <InputLabel>Ticket Status</InputLabel>
                        <Select
                          name="ticket_status"
                          value={formData.ticket_status || "Available"}
                          label="Ticket Status"
                          onChange={handleSelectChange}
                        >
                          {TICKET_STATUS_OPTIONS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="ticket_link"
                        label="Ticket Link"
                        fullWidth
                        value={formData.ticket_link || ""}
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

                    <GridItem xs={12} md={6}>
                      <TextField
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={formData.price || ""}
                        onChange={handleNumberChange}
                        margin="normal"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} md={6}>
                      <FormControl
                        fullWidth
                        margin="normal"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      >
                        <InputLabel>Currency</InputLabel>
                        <Select
                          name="currency"
                          value={formData.currency || ""}
                          label="Currency"
                          onChange={handleSelectChange}
                        >
                          {CURRENCY_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                    Event Details
                  </Typography>

                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description || ""}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />

                  <Box sx={{ mt: 4, mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      Event Poster
                    </Typography>
                    <ImageUploader
                      onImageUploaded={(imageUrl) => {
                        setFormData((prev) => ({
                          ...prev,
                          poster_url: imageUrl,
                        }));
                      }}
                      currentImage={formData.poster_url}
                      label="Upload Event Poster"
                      required={true}
                    />
                  </Box>
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
                    Lineup
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <TextField
                      label="Artist Name"
                      fullWidth
                      value={artistInput}
                      onChange={(e) => setArtistInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArtist();
                        }
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={addArtist}
                      disabled={!artistInput.trim()}
                      sx={{
                        borderRadius: "8px",
                        fontWeight: 600,
                        textTransform: "none",
                        height: "56px",
                        minWidth: "100px",
                        backgroundColor: "#000",
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                  >
                    {(formData.lineup || []).map((artist, index) => (
                      <Chip
                        key={index}
                        label={artist}
                        onDelete={() => removeArtist(index)}
                        sx={{
                          borderRadius: "6px",
                          fontWeight: 500,
                          mb: 1,
                          p: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                </div>

                <div style={{ marginBottom: "40px" }}>
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
                    Genres
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                  >
                    {GENRE_OPTIONS.map((genre) => {
                      const isSelected = (formData.genres || []).includes(
                        genre
                      );
                      return (
                        <Chip
                          key={genre}
                          label={genre}
                          onClick={() => toggleGenre(genre)}
                          color={isSelected ? "primary" : "default"}
                          variant={isSelected ? "filled" : "outlined"}
                          sx={{
                            mb: 1,
                            borderRadius: "6px",
                            p: 0.5,
                            fontWeight: 500,
                            bgcolor: isSelected ? "#000" : "transparent",
                            color: isSelected ? "#fff" : "#000",
                            borderColor: "#ccc",
                            "&:hover": {
                              bgcolor: isSelected ? "#333" : "#f5f5f5",
                            },
                          }}
                        />
                      );
                    })}
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Custom Genre"
                      fullWidth
                      value={customGenreInput}
                      onChange={(e) => setCustomGenreInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomGenre();
                        }
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={addCustomGenre}
                      disabled={!customGenreInput.trim()}
                      sx={{
                        borderRadius: "8px",
                        fontWeight: 600,
                        textTransform: "none",
                        height: "56px",
                        minWidth: "100px",
                        backgroundColor: "#000",
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
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
                    : event
                    ? "Update Event"
                    : "Create Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventForm;
