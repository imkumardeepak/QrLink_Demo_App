import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/productService";
import ErrorBoundary from "../components/ErrorBoundary";
import Loader from "../components/Loader";

const DashboardPage = () => {
  // Fetch product data using TanStack Query
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading data</p>;

  // Calculate dashboard metrics
  const totalProducts = products?.data?.length || 0;

  return (
    <ErrorBoundary>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Product Name</th>
                  <th className="p-2 border">Registration Number</th>
                  <th className="p-2 border">Manufactured By</th>
                </tr>
              </thead>
              <tbody>
                {products?.data?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="p-2 border">{product.id}</td>
                    <td className="p-2 border">{product.product_name}</td>
                    <td className="p-2 border">
                      {product.registration_number}
                    </td>
                    <td className="p-2 border">{product.manufactured_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
