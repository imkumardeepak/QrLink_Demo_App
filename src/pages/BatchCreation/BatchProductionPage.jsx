import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Typography,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  FormHelperText,
  Stack,
  Card,
  CardContent,
} from "@mui/joy";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL;

// Validation Schema
const schema = yup.object().shape({
  batch_number: yup.string().required("Batch number is required"),
  product_name: yup.string().required("Product name is required"),
  identification_number: yup.string().optional(),
  manufacture_date: yup.date().nullable().optional(),
  expiry_date: yup
    .date()
    .nullable()
    .optional()
    .test(
      "is-after-manufacture",
      "Expiry date must be after manufacture date",
      function (value) {
        const manufactureDate = this.parent.manufacture_date;
        if (!value || !manufactureDate) return true;
        return dayjs(value).isAfter(dayjs(manufactureDate));
      }
    ),
});

const BatchProductionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productNames, setProductNames] = useState([]);
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      batch_number: "",
      product_name: "",
      identification_number: "",
      manufacture_date: null,
      expiry_date: null,
    },
  });

  useEffect(() => {
    const fetchBatchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/batches/${id}`);
        const data = response.data.data;
        reset({
          batch_number: data.batch_number || "",
          product_name: data.product_name || "",
          identification_number: data.identification_number || "",
          manufacture_date: data.manufacture_date
            ? dayjs(data.manufacture_date).format("YYYY-MM-DD")
            : null,
          expiry_date: data.expiry_date
            ? dayjs(data.expiry_date).format("YYYY-MM-DD")
            : null,
        });
      } catch (error) {
        console.error("Error fetching batch data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductNames = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProductNames(
          response.data.data.map((product) => product.product_name)
        );
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };

    fetchProductNames();
    if (isEditMode && id) {
      fetchBatchData();
    }
  }, [isEditMode, id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const url = isEditMode
        ? `${API_URL}/batches/${id}`
        : `${API_URL}/batches`;
      const method = isEditMode ? "put" : "post";
      await axios[method](url, data);
      reset();
      navigate("/batches");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography
        level="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#1a1a1a",
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        {isEditMode ? "Edit Batch Production" : "Add Batch Production"}
      </Typography>

      <Card
        variant="outlined"
        sx={{
          maxWidth: 600,
          mx: "auto",
          borderRadius: "lg",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Batch Number */}
              <FormControl error={!!errors.batch_number}>
                <FormLabel required>Batch Number</FormLabel>
                <Input
                  {...register("batch_number")}
                  placeholder="Enter batch number"
                  variant="outlined"
                  sx={{ bgcolor: "white", borderRadius: "8px" }}
                />
                <FormHelperText>{errors.batch_number?.message}</FormHelperText>
              </FormControl>

              {/* Product Name */}
              <FormControl error={!!errors.product_name}>
                <FormLabel required>Product Name</FormLabel>
                <Controller
                  name="product_name"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || ""}
                      onChange={(e, value) => field.onChange(value)}
                      placeholder="Select product"
                      variant="outlined"
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    >
                      {productNames.map((name) => (
                        <Option key={name} value={name}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.product_name?.message}</FormHelperText>
              </FormControl>

              {/* Identification Number */}
              <FormControl error={!!errors.identification_number}>
                <FormLabel>Identification Number</FormLabel>
                <Input
                  {...register("identification_number")}
                  placeholder="Enter identification number (optional)"
                  variant="outlined"
                  sx={{ bgcolor: "white", borderRadius: "8px" }}
                />
                <FormHelperText>
                  {errors.identification_number?.message}
                </FormHelperText>
              </FormControl>

              {/* Date Fields */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl sx={{ flex: 1 }} error={!!errors.manufacture_date}>
                  <FormLabel>Manufacture Date</FormLabel>
                  <Input
                    type="date"
                    {...register("manufacture_date")}
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                  <FormHelperText>
                    {errors.manufacture_date?.message}
                  </FormHelperText>
                </FormControl>

                <FormControl sx={{ flex: 1 }} error={!!errors.expiry_date}>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input
                    type="date"
                    {...register("expiry_date")}
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                  <FormHelperText>{errors.expiry_date?.message}</FormHelperText>
                </FormControl>
              </Stack>

              {/* Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => navigate("/batches")}
                  disabled={loading}
                  sx={{ px: 3, borderRadius: "8px" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  loading={loading}
                  sx={{ px: 3, borderRadius: "8px" }}
                >
                  {isEditMode ? "Update Batch" : "Add Batch"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BatchProductionPage;
