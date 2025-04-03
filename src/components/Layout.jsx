import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Box } from "@mui/joy";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          width: { xs: "100%", lg: "calc(100% - 290px)" },
          ml: { xs: 0, lg: "0px" },
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            p: { xs: 0, sm: 0 },
            minHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            bgcolor: "inherit",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9,
            transition: "opacity 0.3s ease-in-out",
          }}
          onClick={toggleSidebar}
        />
      )}
    </Box>
  );
};

export default Layout;
