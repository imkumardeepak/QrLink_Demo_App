import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";
import Layout from "../components/Layout";

// Lazy load components
const DashboardPage = lazy(() => import("../pages/Dashboard"));
const ProductPage = lazy(() => import("../pages/ProductMaster/ProductMaster"));
const BatchPage = lazy(() => import("../pages/BatchCreation/Batchmaster"));
const BatchProfile = lazy(() => import("../pages/BatchCreation/BatchProfile"));
const BatchDetail = lazy(() => import("../pages/BatchCreation/BatchDetail"));
const BatchProductionPage = lazy(() =>
  import("../pages/BatchCreation/BatchProductionPage")
);
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ✅ Layout wraps all pages so Navbar and Sidebar only appear once */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="batches" element={<BatchPage />} />
          <Route path="batches/production" element={<BatchProductionPage />} />
          <Route
            path="/batches/production/:id"
            element={<BatchProductionPage />}
          />
          <Route path="batches/:id" element={<BatchDetail />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="batchesprofile/:identification_number"
          element={<BatchProfile />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
