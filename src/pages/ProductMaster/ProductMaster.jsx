import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../../services/productService";
import {
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Typography,
  Divider,
  Button,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Box,
  Stack,
  Chip,
} from "@mui/joy";
import AddProduct from "./AddProduct";
import { FaBookmark, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

const ProductMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch Products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  if (isLoading)
    return (
      <Typography level="h4" sx={{ p: 5, textAlign: "center" }}>
        Loading...
      </Typography>
    );
  if (isError)
    return (
      <Typography level="h4" color="danger" sx={{ p: 5, textAlign: "center" }}>
        Error loading products
      </Typography>
    );

  const products = data?.data || [];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 5 },
        bgcolor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: "bold",
            color: "#1a1a1a",
          }}
        >
          Product Master
        </Typography>
        <Button
          variant="solid"
          size="lg"
          color="success"
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          sx={{
            fontWeight: "bold",
            px: 3,
            "&:hover": { bgcolor: "success.600" },
          }}
        >
          + Add Product
        </Button>
      </Stack>

      {/* Product List as Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {products.map((product) => (
          <Card
            key={product.id}
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: 360,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardOverflow>
              <AspectRatio ratio="4/3">
                <img
                  src={`data:image/jpeg;base64,${product.product_image}`}
                  alt={product.product_name}
                  loading="lazy"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
                <IconButton
                  aria-label="bookmark product"
                  variant="soft"
                  color="neutral"
                  size="sm"
                  sx={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                  }}
                >
                  <FaBookmark />
                </IconButton>
              </AspectRatio>
            </CardOverflow>

            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box>
                  <Typography
                    level="h5"
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      mb: 0.5,
                    }}
                  >
                    {product.product_name}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    Reg: {product.registration_number}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography level="body-xs" sx={{ color: "text.secondary" }}>
                    Manufacturer:
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{ fontWeight: "medium", color: "#333" }}
                  >
                    {product.manufactured_by}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="solid"
                    size="sm"
                    color="primary"
                    startDecorator={<FaEdit />}
                    onClick={() => {
                      setProductToEdit(product);
                      setIsModalOpen(true);
                    }}
                    sx={{ flex: 1, fontWeight: "medium" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="solid"
                    size="sm"
                    color="danger"
                    startDecorator={<FaTrash />}
                    onClick={() => deleteMutation.mutate(product.id)}
                    sx={{ flex: 1, fontWeight: "medium" }}
                    loading={
                      deleteMutation.isLoading &&
                      deleteMutation.variables === product.id
                    }
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <Modal open={true} onClose={() => setIsModalOpen(false)}>
          <ModalDialog
            aria-labelledby="product-modal"
            sx={{
              width: { xs: "90%", sm: 600, md: 800 },
              maxHeight: "90vh",
              borderRadius: "md",
              overflow: "auto",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <AddProduct
              productToEdit={productToEdit}
              onClose={() => setIsModalOpen(false)}
            />
          </ModalDialog>
        </Modal>
      )}
    </Box>
  );
};

export default ProductMaster;
