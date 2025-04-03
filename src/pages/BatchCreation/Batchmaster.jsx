import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  Sheet,
  Stack,
} from "@mui/joy";
import axios from "axios";
import { FaEdit, FaQrcode, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL + "/batches";

const BatchMasterPage = () => {
  const [batchData, setBatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setBatchData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBatchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBatchData(batchData.filter((batch) => batch.id !== id));
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch");
    }
  };

  const handleEdit = (id) => {
    navigate(`/batches/production/${id}`);
  };

  const handleQr = (id) => {
    navigate(`/batches/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography level="h4" color="danger" sx={{ textAlign: "center", py: 4 }}>
        Error loading data
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          level="h2"
          sx={{
            fontWeight: "bold",
            color: "primary.900",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Batch Production Master
        </Typography>
        <Button
          variant="solid"
          color="primary"
          size="md"
          onClick={() => navigate("/batches/production")}
          sx={{
            px: 3,
            py: 1,
            borderRadius: "8px",
            fontWeight: "medium",
            bgcolor: "primary.500",
            "&:hover": { bgcolor: "primary.600" },
          }}
        >
          + Add Batch
        </Button>
      </Stack>

      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          overflow: "auto",
          boxShadow: "sm",
          bgcolor: "background.surface",
        }}
      >
        <Table
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "neutral.100",
            "--TableCell-paddingX": { xs: "12px", sm: "24px" },
            "--TableCell-paddingY": "12px",
            "& thead th": {
              fontWeight: "medium",
              color: "text.primary",
              fontSize: "0.875rem",
            },
            "& tbody td": {
              fontSize: "0.875rem",
              color: "text.secondary",
            },
          }}
        >
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Product Name</th>
              <th>Identification Number</th>
              <th>Manufacture Date</th>
              <th>Expiry Date</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batchData.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.batch_number}</td>
                <td>{batch.product_name}</td>
                <td>{batch.identification_number || "N/A"}</td>
                <td>
                  {batch.manufacture_date
                    ? new Date(batch.manufacture_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </td>
                <td>
                  {batch.expiry_date
                    ? new Date(batch.expiry_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{ minWidth: 120 }}
                  >
                    <IconButton
                      aria-label="edit"
                      variant="soft"
                      color="primary"
                      size="sm"
                      onClick={() => handleEdit(batch.id)}
                      sx={{ borderRadius: "50%" }}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      variant="soft"
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(batch.id)}
                      sx={{ borderRadius: "50%" }}
                    >
                      <FaTrash />
                    </IconButton>
                    <IconButton
                      aria-label="qr"
                      variant="soft"
                      color="neutral"
                      size="sm"
                      onClick={() => handleQr(batch.id)}
                      sx={{ borderRadius: "50%" }}
                    >
                      <FaQrcode />
                    </IconButton>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};

export default BatchMasterPage;
