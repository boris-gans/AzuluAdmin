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
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import apiService from "../../services/api";
import { Event } from "../../types";
import EventForm from "./EventForm";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents(0, 100, false);
      // Sort events by start time, newest first
      const sortedEvents = [...data].sort(
        (a, b) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      setEvents(sortedEvents);
      setError("");
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenForm = (event?: Event) => {
    setSelectedEvent(event || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleFormSubmit = () => {
    handleCloseForm();
    fetchEvents();
  };

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete === null) return;

    setIsDeleting(true);
    try {
      await apiService.deleteEvent(eventToDelete);
      await fetchEvents();
    } catch (err) {
      setError("Failed to delete event. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (err) {
      return dateString;
    }
  };

  const getTicketStatusChip = (status: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
      | undefined = "default";

    switch (status) {
      case "Available":
        color = "success";
        break;
      case "Sold Out":
        color = "error";
        break;
      case "Sold At The Door":
        color = "warning";
        break;
    }

    return (
      <Chip
        label={status}
        color={color}
        size="small"
        variant="outlined"
        sx={{
          borderRadius: "2px",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      />
    );
  };

  if (loading && events.length === 0) {
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
          Events
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
          New Event
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
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Event Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Date & Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>
                  Ticket Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", color: "text.secondary" }}
                    >
                      No events found. Create your first event!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow
                    key={event.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{event.name}</TableCell>
                    <TableCell>{event.venue_name}</TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        letterSpacing: "-0.05em",
                      }}
                    >
                      {formatEventDate(event.start_time)}
                    </TableCell>
                    <TableCell>
                      {getTicketStatusChip(event.ticket_status)}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenForm(event)}
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
                          onClick={() => handleDeleteClick(event.id)}
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
        <EventForm
          open={isFormOpen}
          event={selectedEvent}
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
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Event</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be
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

export default EventList;
