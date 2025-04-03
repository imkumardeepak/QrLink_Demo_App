import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Modal,
  ModalClose,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
  FormHelperText,
  Box,
  Stack,
  Divider,
} from "@mui/joy";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/products";

// Validation Schema
const schema = yup.object().shape({
  product_name: yup.string().required("Product name is required"),
  registration_number: yup.string().required("Registration number is required"),
  manufactured_by: yup.string().required("Manufacturer is required"),
  antidotes_statement: yup.string().required("Antidotes statement is required"),
  marked_by: yup.string().required("Marked by is required"),
  customer_care_details: yup
    .string()
    .required("Customer care details is required"),
  gstin: yup.string().required("GSTIN is required"),
  product_image: yup.mixed().required("Product image is required"),
  cautionary_symbol_image: yup
    .mixed()
    .required("Cautionary symbol image is required"),
  product_instruction_image: yup
    .mixed()
    .required("Product instruction image is required"),
});

const AddProduct = ({ productToEdit, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!productToEdit;
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    product_image: null,
    cautionary_symbol_image: null,
    product_instruction_image: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: isEdit ? productToEdit : {},
  });

  useEffect(() => {
    if (isEdit && productToEdit) {
      Object.entries(productToEdit).forEach(([key, value]) =>
        setValue(key, value)
      );
    }
  }, [productToEdit, setValue, isEdit]);

  const productMutation = useMutation({
    mutationFn: async (formData) => {
      const url = isEdit
        ? `${API_URL}/products/${productToEdit.id}`
        : `${API_URL}/products`;
      return axios[isEdit ? "put" : "post"](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      onClose();
    },
    onError: (error) => {
      console.error("Error submitting product:", error.response?.data || error);
    },
  });

  const handleImageChange = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImages((prev) => ({
        ...prev,
        [key]: URL.createObjectURL(file),
      }));
      setValue(event.target.value); // Set single File object
    }
  };

  const onSubmit = async (data) => {
    setUploading(true);
    const formData = new FormData();

    // Append text fields (convert null/undefined to empty string)
    const textFields = [
      "product_name",
      "registration_number",
      "manufactured_by",
      "antidotes_statement",
      "marked_by",
      "customer_care_details",
      "gstin",
    ];
    textFields.forEach((key) => {
      formData.append(key, data[key] || "");
    });

    // Append image files if present
    const imageFields = [
      "product_image",
      "cautionary_symbol_image",
      "product_instruction_image",
    ];
    imageFields.forEach((key) => {
      formData.append(key, data[key][0]);
    });

    console.log(data);

    try {
      await productMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <ModalDialog
        sx={{
          width: { xs: "95%", sm: 600, md: 800 },
          maxHeight: "90vh",
          borderRadius: "lg",
          p: { xs: 2, sm: 3 },
          bgcolor: "background.paper",
          boxShadow: "lg",
          overflowY: "auto",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          level="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#1a1a1a",
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          {isEdit ? "Edit Product" : "Add Product"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Basic Info Section */}
            <Box>
              <Typography
                level="h6"
                sx={{ mb: 2, fontWeight: "medium", color: "#333" }}
              >
                Basic Information
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ flexWrap: "wrap" }}
              >
                <FormControl
                  sx={{ flex: 1, minWidth: 0 }}
                  error={!!errors.product_name}
                >
                  <FormLabel required>Product Name</FormLabel>
                  <Input
                    {...register("product_name")}
                    placeholder="Enter product name"
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                  <FormHelperText>
                    {errors.product_name?.message}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  sx={{ flex: 1, minWidth: 0 }}
                  error={!!errors.registration_number}
                >
                  <FormLabel required>Registration Number</FormLabel>
                  <Input
                    {...register("registration_number")}
                    placeholder="Enter registration number"
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                  <FormHelperText>
                    {errors.registration_number?.message}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <FormControl sx={{ mt: 2 }} error={!!errors.manufactured_by}>
                <FormLabel required>Manufactured By</FormLabel>
                <Input
                  {...register("manufactured_by")}
                  placeholder="Enter manufacturer"
                  variant="outlined"
                  sx={{ bgcolor: "white", borderRadius: "8px" }}
                />
                <FormHelperText>
                  {errors.manufactured_by?.message}
                </FormHelperText>
              </FormControl>
            </Box>

            <Divider sx={{ my: 1, bgcolor: "gray.200" }} />

            {/* Additional Info Section */}
            <Box>
              <Typography
                level="h6"
                sx={{ mb: 2, fontWeight: "medium", color: "#333" }}
              >
                Additional Details
              </Typography>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Antidotes Statement</FormLabel>
                  <Input
                    {...register("antidotes_statement")}
                    placeholder="Enter antidotes statement (optional)"
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                </FormControl>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl sx={{ flex: 1, minWidth: 0 }}>
                    <FormLabel>Marked By</FormLabel>
                    <Input
                      {...register("marked_by")}
                      placeholder="Enter marked by (optional)"
                      variant="outlined"
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    />
                  </FormControl>

                  <FormControl sx={{ flex: 1, minWidth: 0 }}>
                    <FormLabel>Customer Care Details</FormLabel>
                    <Input
                      {...register("customer_care_details")}
                      placeholder="Enter customer care details (optional)"
                      variant="outlined"
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    />
                  </FormControl>
                </Stack>

                <FormControl>
                  <FormLabel>GSTIN</FormLabel>
                  <Input
                    {...register("gstin")}
                    placeholder="Enter GSTIN (optional)"
                    variant="outlined"
                    sx={{ bgcolor: "white", borderRadius: "8px" }}
                  />
                </FormControl>
              </Stack>
            </Box>

            <Divider sx={{ my: 1, bgcolor: "gray.200" }} />

            {/* Images Section */}
            <Box>
              <Typography
                level="h6"
                sx={{ mb: 2, fontWeight: "medium", color: "#333" }}
              >
                Product Images
              </Typography>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ flexWrap: "wrap" }}
              >
                {[
                  { key: "product_image", label: "Product Image" },
                  {
                    key: "cautionary_symbol_image",
                    label: "Cautionary Symbol",
                  },
                  {
                    key: "product_instruction_image",
                    label: "Instruction Image",
                  },
                ].map(({ key, label }) => (
                  <FormControl
                    key={key}
                    sx={{ flex: { md: 1 }, minWidth: { xs: "100%", md: 0 } }}
                    error={!!errors[key]}
                  >
                    <FormLabel>{label}</FormLabel>
                    {(productToEdit?.[key] || previewImages[key]) && (
                      <Box
                        sx={{
                          mb: 1,
                          borderRadius: "8px",
                          overflow: "hidden",
                          width: { xs: 120, sm: 150 },
                          height: { xs: 120, sm: 150 },
                          bgcolor: "gray.100",
                          position: "relative",
                        }}
                      >
                        <img
                          src={
                            previewImages[key] ||
                            `data:image/jpeg;base64,${productToEdit?.[key]}`
                          }
                          alt={label}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                    <Input
                      type="file"
                      {...register(key)} // Registers the input with react-hook-form
                      onChange={(e) => handleImageChange(e, key)} // Updates preview and form value
                      variant="outlined"
                      sx={{ bgcolor: "white", borderRadius: "8px" }}
                    />
                    <FormHelperText>{errors[key]?.message}</FormHelperText>
                  </FormControl>
                ))}
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 3 }}
            >
              <Button
                variant="outlined"
                color="neutral"
                onClick={onClose}
                disabled={uploading}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  fontWeight: "medium",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                color="primary"
                loading={uploading}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  fontWeight: "medium",
                  "&:hover": { bgcolor: "primary.600" },
                }}
              >
                {isEdit ? "Update Product" : "Add Product"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default AddProduct;
