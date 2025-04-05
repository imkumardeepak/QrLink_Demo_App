import { Link } from "react-router-dom";
import { FiMenu, FiHome, FiBox } from "react-icons/fi";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Box,
  Divider,
} from "@mui/joy";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <Box
      sx={{
        position: { xs: "fixed", lg: "sticky" },
        top: 0,
        left: 0,
        bottom: 0,
        width: { xs: "240px", sm: "260px" },
        backgroundColor: "#1a1a1a",
        color: "white",
        transition: "transform 0.3s ease-in-out",
        transform: {
          xs: isOpen ? "translateX(0)" : "translateX(-100%)",
          lg: "translateX(0)",
        },
        zIndex: 10,
        overflowY: "auto",
        boxShadow: { lg: "2px 0 5px rgba(0,0,0,0.1)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 2 },
          backgroundColor: "#222",
        }}
      >
        <Typography
          level="h6"
          fontWeight="bold"
          sx={{ color: "white", fontSize: { xs: "1rem", sm: "1.125rem" } }}
        >
          Admin Panel
        </Typography>
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          onClick={toggleSidebar}
          sx={{
            display: { xs: "flex", lg: "none" },
            p: 1,
            minWidth: "auto",
            color: "white",
          }}
        >
          <FiMenu size={20} />
        </Button>
      </Box>

      <List
        sx={{
          "--ListItem-radius": "8px",
          "--List-gap": "6px",
          p: { xs: 1, sm: 2 },
        }}
      >
        <ListItem>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              color: "white",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              "&.active": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <FiHome style={{ marginRight: "12px", fontSize: "20px" }} />
            Dashboard
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/products"
            sx={{
              color: "white",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              "&.active": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <FiBox style={{ marginRight: "12px", fontSize: "20px" }} />
            Products
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/batches"
            sx={{
              color: "white",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              "&.active": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <FiBox style={{ marginRight: "12px", fontSize: "20px" }} />
            Batches
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/access-logs"
            sx={{
              color: "white",
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
              "&.active": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <FiBox style={{ marginRight: "12px", fontSize: "20px" }} />
            Access Logs
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
