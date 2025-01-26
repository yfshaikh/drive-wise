import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function GoogleSignIn({ onSignInSuccess }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Get user info from the result
            const user = {
                first_name: result.user.displayName?.split(' ')[0] || '',
                last_name: result.user.displayName?.split(' ').slice(1).join(' ') || '',
                email: result.user.email,
                photo_url: result.user.photoURL,
                uid: result.user.uid
            };

            // If you need to store additional user info in your backend
            if (onSignInSuccess) {
                await onSignInSuccess(user);
            }

            sessionStorage.setItem("token", result.user.accessToken);

        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full max-w-md mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome to DriveWise!
                </h1>
                <h2 className="text-gray-600">
                    Please sign in to continue
                </h2>
            </div>
            <button 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-between w-full px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 border border-gray-300 rounded-md shadow-sm transition-colors duration-200"
            >
                <span>Sign in with Google</span>
                <img 
                    src="/google.webp" 
                    alt="Google logo" 
                    className="w-5 h-5"
                />
            </button>
            {error && (
                <div className="mt-2 text-sm text-red-600 text-center">
                    {error}
                </div>
            )}
        </div>
    );
}

export default GoogleSignIn;
