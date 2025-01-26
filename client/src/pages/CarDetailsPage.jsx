import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Card, Typography, CircularProgress, Button, Box, TextField, IconButton } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const CarDetailsPage = () => {
  const { id } = useParams(); // Get the document ID from the URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true); // Ensure loading is true before fetch
      try {
        console.log("Fetching car with ID:", id);
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const carData = { id: docSnap.id, ...docSnap.data() };
            console.log("Setting car data:", carData);
            setCar(carData);
        } else {
            console.log("No such document!");
            setCar(null);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {  // Only fetch if we have an ID
      fetchCar();
    }
  }, [id]);

  // Add more detailed debugging
  useEffect(() => { 
    console.log("Car state updated. Loading:", loading, "Car:", car);
  }, [car, loading]);

  const handleAskAI = () => {
    // TODO: Implement AI question handling
    console.log("AI Question:", aiQuestion);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h5">Car not found!</Typography>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Image Carousel */}
      <Card className="rounded-2xl shadow-xl mb-6 overflow-hidden border-2 border-[#1B2A41] group">
        <Carousel 
          showThumbs={false} 
          infiniteLoop 
          autoPlay
          showStatus={false}
          renderArrowPrev={(clickHandler, hasPrev) => (
            <button
              onClick={clickHandler}
              className="absolute left-0 z-10 p-3 top-[calc(50%-24px)] -translate-y-1/2 bg-[#324A5F]/90 hover:bg-[#1B2A41] rounded-r-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{ width: 'auto', height: 'auto' }}
            >
              <span className="text-[#CCC9DC] text-2xl">&#10094;</span>
            </button>
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            <button
              onClick={clickHandler}
              className="absolute right-0 z-10 p-3 top-[calc(50%-24px)] -translate-y-1/2 bg-[#324A5F]/90 hover:bg-[#1B2A41] rounded-l-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{ width: 'auto', height: 'auto' }}
            >
              <span className="text-[#CCC9DC] text-2xl">&#10095;</span>
            </button>
          )}
        >
          {Object.values(car.images).slice(0, 8).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Car image ${index + 1}`}
                className="h-[25rem] w-full object-cover cursor-pointer hover:opacity-95 transition-opacity duration-300"
                onClick={() => setSelectedImage(image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1821]/50 to-transparent" />
            </div>
          ))}
        </Carousel>
      </Card>
  
      {/* Car Details */}
      <Card className="p-8" sx={{ boxShadow: 'none', border: 'none' }}>
        {/* Title and Price */}
        <div className="mb-8 border-b-2 border-[#324A5F]/20 pb-6">
          <Typography variant="h4" className="font-bold text-[#0C1821]">
            {car.make.name} {car.name} {car.year}
          </Typography>
          <Typography variant="h5" className="text-[#324A5F] mt-2 font-semibold">
            ${car.price.toLocaleString()}
          </Typography>
        </div>
  
        {/* Description */}
        {car.description && (
          <div className="mb-8 bg-[#CCC9DC]/10 p-6 rounded-xl">
            <Typography variant="body1" className="text-[#1B2A41] leading-relaxed">
              {car.description}
            </Typography>
          </div>
        )}
  
        {/* Key Specs */}
        <div>
          <Typography variant="h5" className="font-semibold text-[#0C1821] mb-6 border-b-2 border-[#324A5F]/20 pb-2">
            Key Specifications
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#324A5F]/5 p-4 rounded-xl hover:bg-[#324A5F]/10 transition-colors duration-300">
              <Typography variant="body1" className="text-[#1B2A41]">
                <strong className="text-[#324A5F]">Body Style</strong>
                <div className="mt-1">{car.body_style}</div>
              </Typography>
            </div>
            <div className="bg-[#324A5F]/5 p-4 rounded-xl hover:bg-[#324A5F]/10 transition-colors duration-300">
              <Typography variant="body1" className="text-[#1B2A41]">
                <strong className="text-[#324A5F]">Seating Capacity</strong>
                <div className="mt-1">{car.seating_capacity}</div>
              </Typography>
            </div>
            <div className="bg-[#324A5F]/5 p-4 rounded-xl hover:bg-[#324A5F]/10 transition-colors duration-300">
              <Typography variant="body1" className="text-[#1B2A41]">
                <strong className="text-[#324A5F]">MPG</strong>
                <div className="mt-1">{car.combined_mpg || car.combined_mpge}</div>
              </Typography>
            </div>
            <div className="bg-[#324A5F]/5 p-4 rounded-xl hover:bg-[#324A5F]/10 transition-colors duration-300">
              <Typography variant="body1" className="text-[#1B2A41]">
                <strong className="text-[#324A5F]">Drivetrain</strong>
                <div className="mt-1">{car.drivetrain}</div>
              </Typography>
            </div>
          </div>
        </div>

        {/* AI Question Input */}
        <div className="mt-8 max-w-2xl">
          <Typography variant="h6" className="mb-3 flex items-center gap-2 text-[#324A5F]">
            Ask about this car <AutoAwesomeIcon className="text-[#324A5F]" />
          </Typography>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              className="flex-1 p-3 border-2 border-[#324A5F]/20 rounded-lg focus:outline-none focus:border-[#324A5F] transition-colors duration-300"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
            />
            <button
              className="bg-[#324A5F] text-white px-6 py-3 rounded-lg hover:bg-[#1B2A41] transition-colors duration-300"
              onClick={handleAskAI}
            >
              Ask
            </button>
          </div>
        </div>
        
      </Card>
    </div>
  );
};

export default CarDetailsPage;
