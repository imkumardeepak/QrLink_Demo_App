import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaTimes, FaSearchPlus } from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const BatchProfile = () => {
  const { identification_number } = useParams();
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Function to get location from geolocation API and reverse geocode to get location name
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get location name
            const locationName = await reverseGeocode(latitude, longitude);
            const locationData = {
              latitude,
              longitude,
              locationName,
              source: "geolocation",
            };
            setUserLocation(locationData);
            storeLocation(locationData);
          } catch (err) {
            console.error("Reverse geocoding error:", err);
            // Fallback to just lat/long if geocoding fails
            const locationData = {
              latitude,
              longitude,
              locationName: "Unknown",
              source: "geolocation",
            };
            setUserLocation(locationData);
            storeLocation(locationData);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  // Function to reverse geocode latitude and longitude to location name
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const { address } = response.data;
      // Construct a readable location name from address components
      const locationName = [
        address.city || address.town || address.village,
        address.state || address.region,
        address.country,
      ]
        .filter(Boolean) // Remove undefined/null values
        .join(", ");
      return locationName || "Unknown Location";
    } catch (err) {
      console.error("Error fetching location name:", err);
      throw err; // Let the caller handle the error
    }
  };

  // Function to store location data (e.g., send to your backend)
  const storeLocation = async (locationData) => {
    try {
      const response = await axios.post(`${API_URL}/access-logs`, {
        batch_number: batchData.batch_number,
        product_name: batchData.product_name,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.locationName, // Matches the 'address' field in the API
      });
      console.log("Location stored successfully:", response.data);
    } catch (err) {
      console.error(
        "Error storing location:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    // Request location permission on component mount
    getGeoLocation();

    const fetchBatchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/batches/identification/${identification_number}`
        );
        setBatchData(response.data.data);
        setSuccessMessage("Batch data fetched successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [identification_number]);

  // Lock body scroll when zoom is active
  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [zoomedImage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">
          Error loading data
        </div>
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="container mx-auto p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-500">
            Batch not found!
          </h2>
          <Link
            to="/batches"
            className="inline-block mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back to List
          </Link>
        </div>
      </div>
    );
  }

  const convertBufferToBase64 = (bufferData) => {
    if (!bufferData) return null;
    const binary = new Uint8Array(bufferData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    );
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  // Image modal for zoomed view
  const ZoomedImageModal = () => {
    if (!zoomedImage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors"
            aria-label="Close zoom"
          >
            <FaTimes size={24} />
          </button>
          {zoomedImage.data ? (
            <img
              src={convertBufferToBase64(zoomedImage.data)}
              alt={zoomedImage.alt}
              className="max-w-full max-h-screen mx-auto object-contain bg-white bg-opacity-10 p-2 rounded"
            />
          ) : (
            <div className="bg-white p-8 text-center rounded-lg">
              <FaBoxOpen className="mx-auto h-24 w-24 mb-4 text-gray-500" />
              <p className="text-xl">No image available</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Reusable image component with zoom capability
  const ZoomableImage = ({ imageData, altText, className }) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleImageClick = () => {
      setIsZoomed(true);
    };

    const closeZoom = (e) => {
      e.stopPropagation();
      setIsZoomed(false);
    };

    useEffect(() => {
      if (isZoomed) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isZoomed]);

    return (
      <>
        <div
          className="border rounded-lg p-2 sm:p-3 md:p-4 h-full flex items-center justify-center cursor-pointer relative group transition-all"
          onClick={handleImageClick}
        >
          {imageData ? (
            <div className="text-center w-full">
              <div className="relative">
                <img
                  src={convertBufferToBase64(imageData)}
                  alt={altText}
                  className={`w-full object-contain mx-auto sm:max-h-48 md:max-h-56 lg:max-h-64 ${
                    className || ""
                  }`}
                />
                <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaSearchPlus className="text-gray-700 text-sm sm:text-base" />
                </div>
              </div>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                Click to zoom
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4 sm:py-6 md:py-8 w-full">
              <FaBoxOpen className="mx-auto h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm md:text-base">
                No image available
              </p>
            </div>
          )}
        </div>

        {isZoomed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={closeZoom}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeZoom}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-1 sm:p-2 text-gray-800 hover:bg-gray-200 transition-colors z-10"
                aria-label="Close zoom"
              >
                <FaTimes size={20} className="sm:w-6 sm:h-6" />
              </button>
              <img
                src={convertBufferToBase64(imageData)}
                alt={altText}
                className="max-w-full max-h-screen object-contain mx-auto bg-white p-2 sm:p-4 rounded"
              />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="min-h-screen py-8 bg-fixed bg-center bg-repeat"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/12612073/pexels-photo-12612073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
      }}
    >
      <ZoomedImageModal />
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-100 text-gray-800 p-4">
            <h2 className="text-2xl font-bold">Product Information</h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-6">
                {batchData.product_image && (
                  <ZoomableImage
                    imageData={batchData.product_image.data}
                    altText={batchData.product_name || "Product Image"}
                  />
                )}
              </div>

              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Product Name
                    </div>
                    <div className="text-lg">
                      {batchData.product_name || "TATAMIDA 17.8 SL - 100 ML"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Registration Number
                    </div>
                    <div className="text-lg">
                      {batchData.registration_number ||
                        "CIR36,589/2001IMIDACLOPRID (SL)21"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Batch Number
                    </div>
                    <div className="text-lg">
                      {batchData.batch_number || "AK00258"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Manufactured By
                    </div>
                    <div className="text-lg">
                      {batchData.manufactured_by || "Rallis India Ltd"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Manufacturing Date
                    </div>
                    <div className="text-lg">
                      {batchData.manufacture_date
                        ? new Date(
                            batchData.manufacture_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "27-May-2022"}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="font-semibold text-gray-600 mb-1">
                      Expiry Date
                    </div>
                    <div className="text-lg">
                      {batchData.expiry_date
                        ? new Date(batchData.expiry_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "25-May-2024"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-600 mb-2">
                    Cautionary Symbol
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 relative">
                      <ZoomableImage
                        imageData={batchData.cautionary_symbol_image.data}
                        altText={`${
                          batchData.cautionary_symbol_image || "Product"
                        } Instructions`}
                        className="max-h-96"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 mb-4 md:mb-0 md:px-3">
                <div className="border rounded-lg p-4 h-full">
                  <div className="font-semibold text-gray-600 mb-2">
                    Antidote Statement
                  </div>
                  <div>
                    {batchData.antidotes_statement ||
                      "No specific antidote. Treat Symptomatically"}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 md:pl-6">
                <div className="border rounded-lg p-4 h-full">
                  <div className="font-semibold text-gray-600 mb-2">
                    Marketed By
                  </div>
                  <div>{batchData.marked_by || "Rallis India Ltd"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-3">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-600 mb-2">
                    Identification Number
                  </div>
                  <div>{batchData.identification_number || "0082395421"}</div>
                </div>
              </div>

              <div className="w-full md:w-1/2 md:pl-3">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold text-gray-600 mb-2">
                    Customer Care Details
                  </div>
                  <div>
                    {batchData.customer_care_details ||
                      "Ph No 8108622210, cmc@rallis.com"}
                  </div>
                </div>
              </div>
            </div>

            {batchData.product_instruction_image && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">
                  Product Instructions
                </h3>
                <ZoomableImage
                  imageData={batchData.product_instruction_image.data}
                  altText={`${
                    batchData.product_name || "Product"
                  } Instructions`}
                  className="max-h-96"
                />
              </div>
            )}

            {/* Display Location Info (Optional) */}
            {userLocation && (
              <div className="mt-6 border rounded-lg p-4">
                <div className="font-semibold text-gray-600 mb-2">
                  Access Location
                </div>
                <div>
                  {userLocation.error ? (
                    userLocation.error
                  ) : (
                    <>
                      Latitude: {userLocation.latitude}, Longitude:{" "}
                      {userLocation.longitude}
                      {userLocation.ip && `, IP: ${userLocation.ip}`}
                      {" (Source: " + userLocation.source + ")"}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProfile;
