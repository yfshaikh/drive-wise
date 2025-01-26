import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import CarCompareCard from '../components/CarCompareCard';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function CompareCarsPage() {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState([]);
  
  const handleCarRemoved = (carId) => {
    setComparisons(prevComparisons => prevComparisons.filter(id => id !== carId));
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if(!token){
      navigate('/signin');
      return;
    }

    const userInfo = jwtDecode(token);
    
    const fetchComparisons = async () => {
      try {
        const userDocRef = doc(db, 'users', userInfo.email);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userComparisons = Array.isArray(userData.comparisons) ? userData.comparisons : [];
          setComparisons(userComparisons);
        } else {
          console.error('User document not found');
          setComparisons([]);
        }
      } catch (error) {
        console.error('Error fetching comparisons:', error);
        setComparisons([]);
      }
    };

    fetchComparisons();
  }, []);

  useEffect(() => {
    console.log(comparisons);
  }, [comparisons]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compare Cars</h1>
      {comparisons.length < 2 ? (
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-700">Please add at least two cars to compare. You currently have {comparisons.length} {comparisons.length === 1 ? 'car' : 'cars'}.</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-6 pb-4 items-center min-h-[600px]">
          {comparisons.map((carId) => (
            <div className="flex-shrink-0 w-[400px]" key={carId}>
              <CarCompareCard
                car={carId}
                onCarRemoved={handleCarRemoved}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompareCarsPage
