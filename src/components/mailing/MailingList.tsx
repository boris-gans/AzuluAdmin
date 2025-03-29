import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Switch,
  FormGroup,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from "../../services/api";

interface MailingListEntry {
  id: number;
  name: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

const MailingList: React.FC = () => {
  const [entries, setEntries] = useState<MailingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribedOnly, setSubscribedOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchMailingList = async () => {
    setLoading(true);
    setError("");
    try {
      const skip = (page - 1) * limit;
      const response = await apiService.getMailingList(
        skip,
        limit,
        subscribedOnly
      );

      // Process the entries
      if (Array.isArray(response)) {
        // Handle direct array response
        setEntries(response || []);
        // Since we don't know the total, use a rough estimate for pagination
        setTotalPages(
          Math.ceil(response.length / limit) + (response.length < limit ? 0 : 1)
        );
      } else {
        // Handle structured response
        setEntries(response.items || []);
        setTotalPages(Math.ceil((response.total || 0) / limit));
      }
    } catch (err: any) {
      console.error("Error fetching mailing list:", err);
      setError(err.response?.data?.detail || "Failed to load mailing list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailingList();
  }, [page, subscribedOnly]);

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      await apiService.deleteMailingListEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err: any) {
      console.error("Error deleting entry:", err);
      alert(err.response?.data?.detail || "Failed to delete entry");
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ px: 4 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Mailing List
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={subscribedOnly}
                onChange={(e) => setSubscribedOnly(e.target.checked)}
              />
            }
            label="Show subscribed only"
          />
        </FormGroup>
      </Box>

      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "rgba(255, 0, 0, 0.05)",
            border: "1px solid rgba(255, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Box sx={{ px: 4 }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
            borderRadius: 1,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No mailing list entries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 1,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            backgroundColor:
                              entry.subscribed !== false
                                ? "rgba(76, 175, 80, 0.1)"
                                : "rgba(244, 67, 54, 0.1)",
                            color:
                              entry.subscribed !== false
                                ? "rgb(76, 175, 80)"
                                : "rgb(244, 67, 54)",
                          }}
                        >
                          {entry.subscribed !== false
                            ? "Subscribed"
                            : "Unsubscribed"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {entry.created_at
                          ? formatDate(entry.created_at)
                          : "Unknown"}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteEntry(entry.id)}
                            sx={{
                              color: "#d32f2f",
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.04)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && entries.length > 0 && (
            <Box display="flex" justifyContent="center" p={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MailingList;
