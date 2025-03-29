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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO, isValid } from "date-fns";
import { Event, EventCreate, EventUpdate } from "../../types";
import apiService from "../../services/api";
import ImageUploader from "../common/ImageUploader";

// Create wrapper components for Grid to fix TypeScript errors
const GridContainer = (props: any) => <Grid container {...props} />;
const GridItem = (props: any) => <Grid item {...props} />;

// Predefined options
const TICKET_STATUS_OPTIONS = ["Available", "Sold Out", "Sold At The Door"];
const CURRENCY_OPTIONS = [
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
  "Minimal",
  "Disco",
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
  start_time: new Date().toISOString(),
  end_time: new Date(Date.now() + 3600000).toISOString(),
  ticket_status: "Available",
  ticket_link: "",
  lineup: [],
  genres: [],
  description: "",
  poster_url: "",
  price: 0,
  currency: "USD",
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
      setFormData((prev) => ({ ...prev, [name]: date.toISOString() }));
    }
  };

  // Parse ISO date string to Date object
  const parseDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? date : null;
    } catch (e) {
      return null;
    }
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
    if (!formData.name || !formData.venue_name || !formData.address) {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
        {event ? "Edit Event" : "Create New Event"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
            Basic Information
          </Typography>

          <GridContainer spacing={2}>
            <GridItem xs={12}>
              <TextField
                name="name"
                label="Event Name"
                fullWidth
                required
                value={formData.name || ""}
                onChange={handleChange}
                margin="normal"
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
              />
            </GridItem>

            <GridItem xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={parseDate(formData.start_time)}
                  onChange={(date) => handleDateChange("start_time", date)}
                  sx={{ width: "100%", mt: 2 }}
                />
              </LocalizationProvider>
            </GridItem>

            <GridItem xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Time"
                  value={parseDate(formData.end_time)}
                  onChange={(date) => handleDateChange("end_time", date)}
                  sx={{ width: "100%", mt: 2 }}
                />
              </LocalizationProvider>
            </GridItem>
          </GridContainer>

          <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
            Ticket Information
          </Typography>

          <GridContainer spacing={2}>
            <GridItem xs={12} md={6}>
              <FormControl fullWidth margin="normal">
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
              />
            </GridItem>

            <GridItem xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency || "USD"}
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

          <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
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
          />

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Event Poster
            </Typography>
            <ImageUploader
              onImageUploaded={(imageUrl) => {
                setFormData((prev) => ({ ...prev, poster_url: imageUrl }));
              }}
              currentImage={formData.poster_url}
              label="Upload Event Poster"
              required={true}
            />
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
            Lineup
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
            />
            <Button
              variant="contained"
              onClick={addArtist}
              disabled={!artistInput.trim()}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {(formData.lineup || []).map((artist, index) => (
              <Chip
                key={index}
                label={artist}
                onDelete={() => removeArtist(index)}
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
            Genres
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = (formData.genres || []).includes(genre);
              return (
                <Chip
                  key={genre}
                  label={genre}
                  onClick={() => toggleGenre(genre)}
                  color={isSelected ? "primary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{ mb: 1 }}
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
            />
            <Button
              variant="contained"
              onClick={addCustomGenre}
              disabled={!customGenreInput.trim()}
            >
              Add
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
