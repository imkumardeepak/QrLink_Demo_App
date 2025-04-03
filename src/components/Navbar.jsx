import { FiMenu } from "react-icons/fi";
import { Button, Typography, Box } from "@mui/joy";

const Navbar = ({ toggleSidebar }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        p: { xs: 1, sm: 2 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 9,
      }}
    >
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <Button
          variant="plain"
          onClick={toggleSidebar}
          sx={{
            p: 1,
            minWidth: "auto",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          <FiMenu size={24} />
        </Button>
      </Box>

      <Typography
        level="h5"
        fontWeight="bold"
        sx={{
          fontSize: { xs: "1rem", sm: "1.25rem" },
          color: "#333",
        }}
      >
        CropGate
      </Typography>

      {/* Placeholder for potential right-side content */}
      <Box sx={{ width: { xs: 32, sm: 40 } }} />
    </Box>
  );
};

export default Navbar;
