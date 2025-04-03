import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { Typography, Box, CircularProgress } from "@mui/joy";

const API_URL = import.meta.env.VITE_API_URL;

const BatchDetail = () => {
  const { id } = useParams();
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/batches/${id}`);
        setBatchData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [id]);

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="danger">Error loading data</Typography>;
  }

  if (!batchData) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-500">
            Batch not found!
          </h2>
        </div>
      </div>
    );
  }

  const baseUrl = `http://${window.location.hostname}:${window.location.port}`;
  const batchUrl = `${baseUrl}/batchesprofile/${batchData.identification_number}`;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h4 className="text-3xl font-semibold text-gray-800 mb-6">
          Batch Qr Code
        </h4>
        <div className="mx-auto mb-6 flex justify-center items-center">
          <QRCodeCanvas value={batchUrl} size={256} level="H" />
        </div>

        <p className="text-lg text-gray-700 mt-4">
          Scan the QR code to view batch details.
        </p>
        <Link
          to="/batches"
          className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaArrowLeft className="inline-block mr-2" /> Back to List
        </Link>
      </div>
    </Box>
  );
};

export default BatchDetail;
