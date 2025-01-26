import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CarDisplayItem from "../components/CarDisplayItem";
import GoogleSignIn from "../components/GoogleSignIn";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
const HomePage = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  React.useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      if (!decoded?.email) {
        navigate('/signin');
        return;
      }

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



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 p-6">
      {cars.map((car) => (
        <CarDisplayItem 
          key={car.docId} 
          id={car.docId} 
          image={car.images?.[0] || "/default-car-image.jpg"} 
          title={`${car.year} ${car.name}`} 
        />
      ))}
    </div>
  );
};

export default HomePage;
