import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion'; // Import Framer Motion

function CarCompareCard({ car, onCarRemoved }) {
  const [carData, setCarData] = useState(null);
  const token = sessionStorage.getItem("token");
  if (!token) {
    navigate('/signin');
    return null;
  }
  const userInfo = jwtDecode(token);

  const onRemove = async (carId) => {
    try {
      const userRef = doc(db, 'users', userInfo.email);
      await updateDoc(userRef, {
        comparisons: arrayRemove(carId),
      });
      onCarRemoved(carId);
    } catch (error) {
      console.error('Error removing car from comparisons:', error);
    }
  };

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carDoc = await getDoc(doc(db, 'cars', car));
        if (carDoc.exists()) {
          setCarData(carDoc.data());
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };

    if (car) {
      fetchCarData();
    }
  }, [car]);

  if (!carData) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="border rounded-lg px-4 py-6 shadow-lg bg-white w-full max-w-sm relative flex flex-col items-center ml-4 hover:cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' }} // Hover effect
      transition={{ duration: 0.3 }} // Transition duration
    >
      <button
        onClick={() => onRemove(car)}
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer shadow-md"
        aria-label="Remove car from comparison"
      >
        <span className="text-gray-600 text-xl leading-none">&times;</span>
      </button>
      <img
        src={carData.images[0]}
        alt={`${carData.make} ${carData.model}`}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-2xl font-bold text-center mb-4">
        Toyota {carData.name}
      </h3>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-medium">Year</p>
          <p className="text-2xl font-semibold">{carData.year}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-medium">Price</p>
          <p className="text-2xl font-semibold">${carData.price}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-medium">MPG</p>
          <p className="text-2xl font-semibold">{carData.combined_mpg || carData.combined_mpge}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CarCompareCard;
