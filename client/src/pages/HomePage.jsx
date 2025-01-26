import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CarDisplayItem from "../components/CarDisplayItem";
import GoogleSignIn from "../components/GoogleSignIn";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: '',
    seats: '',
    yearRange: ''
  });
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  React.useEffect(() => {
    if (!token) {
      navigate('/signin');
      console.log("No token, redirecting to signin");
      return;
    }
    
    try {
      const decoded = jwtDecode(token);

      // Check for existing quiz responses
      const checkQuizResponses = async () => {
        const userDocRef = doc(db, 'users', decoded.email);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists() && !docSnap.data().quizResponses) {
          navigate('/');
        }
      };

      checkQuizResponses();
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/signin');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollection = collection(db, "cars");
        const carsSnapshot = await getDocs(carsCollection);
        const carsData = carsSnapshot.docs.map((doc) => ({
          docId: doc.id, // Firestore document name (unique ID in collection)
          ...doc.data(),
        }));
        setCars(carsData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Create price range options
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under $10,000', value: '0-10000' },
    { label: '$10,000 - $20,000', value: '10000-20000' },
    { label: '$20,000 - $30,000', value: '20000-30000' },
    { label: '$30,000 - $40,000', value: '30000-40000' },
    { label: 'Over $40,000', value: '40000-999999' }
  ];

  // Create seat options
  const seatOptions = [
    { label: 'All Seats', value: '' },
    { label: '2 Seats', value: '2' },
    { label: '4 Seats', value: '4' },
    { label: '5 Seats', value: '5' },
    { label: '6+ Seats', value: '6' }
  ];

  // Create year range options
  const yearRanges = [
    { label: 'All Years', value: '' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2018', value: '2018' },
    { label: '2017', value: '2017' },
    { label: '2016', value: '2016' },
    { label: '2015', value: '2015' },
  ];

  const filteredCars = cars.filter(car => {
    const meetsPrice = !filters.priceRange || (() => {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const carPrice = Number(car.price);
      return carPrice >= min && carPrice <= max;
    })();

    const meetsSeats = !filters.seats || car.seating_capacity === filters.seats;

    const meetsYear = !filters.yearRange || String(car.year) === filters.yearRange;

    return meetsPrice && meetsSeats && meetsYear;
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormControl fullWidth>
          <InputLabel>Price Range</InputLabel>
          <Select
            name="priceRange"
            value={filters.priceRange}
            label="Price Range"
            onChange={handleFilterChange}
          >
            {priceRanges.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Seats</InputLabel>
          <Select
            name="seats"
            value={filters.seats}
            label="Seats"
            onChange={handleFilterChange}
          >
            {seatOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Year Range</InputLabel>
          <Select
            name="yearRange"
            value={filters.yearRange}
            label="Year Range"
            onChange={handleFilterChange}
          >
            {yearRanges.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <CarDisplayItem 
              key={car.docId} 
              id={car.docId} 
              image={car.images?.[0] || "/default-car-image.jpg"} 
              title={`${Number(car.year)} ${car.name}`} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-600">
            No cars found matching your selected filters. Try adjusting your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
