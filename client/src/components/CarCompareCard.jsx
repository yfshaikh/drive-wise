import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { jwtDecode } from 'jwt-decode';

function CarCompareCard({ car, onCarRemoved }) {
  const [carData, setCarData] = useState(null);
  const token = sessionStorage.getItem("token");
  if(!token){
    navigate('/signin');
    return;
  }
  const userInfo = jwtDecode(token);

  const onRemove = async (carId) => {
    try {
      const userRef = doc(db, 'users', userInfo.email);
      await updateDoc(userRef, {
        comparisons: arrayRemove(carId)
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
    <div className="border rounded-lg px-4 py-20 shadow-md bg-white w-full max-w-sm relative">
      <button
        onClick={() => onRemove(car)}
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-200 border border-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer shadow-md"
        aria-label="Remove car from comparison"
      >
        <span className="text-gray-600 text-xl leading-none">&times;</span>
      </button>
      <div className="space-y-3">
        <img 
          src={carData.images[0]} 
          alt={`${carData.make} ${carData.model}`}
          className="w-full h-48 object-cover rounded-md"
        />
        <h3 className="text-xl font-semibold">
            Toyota {carData.name}
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">Year:</p>
            <p>{carData.year}</p>
          </div>
          <div>
            <p className="font-medium">Price:</p>
            <p>${carData.price}</p>
          </div>
          {/* <div>
            <p className="font-medium">Mileage:</p>
            <p>{carData.mileage?.toLocaleString()} miles</p>
          </div> */}
          <div>
            <p className="font-medium">MPG:</p>
            <p>{carData.combined_mpg || carData.combined_mpge}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarCompareCard;
