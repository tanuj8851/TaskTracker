import { useEffect, } from 'react';
import { useNavigate } from "react-router-dom";

import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();



    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <p className="text-xl text-gray-600">Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                    <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold mb-4">
                        {user?.name[0].toUpperCase()}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800">{user?.name}</h2>
                </div>

                {/* Account Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">

                        <div className="p-4 border rounded-lg bg-blue-100">

                            <p className="text-gray-700">
                                <strong>Task Status:</strong> {user?.status}
                            </p>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default UserProfile;