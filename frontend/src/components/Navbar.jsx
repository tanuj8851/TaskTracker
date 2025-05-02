
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './../context/AuthContext';

const Navbar = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();


    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-blue-600 p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className=" text-white text-2xl font-bold">TASKY</Link>
                <div>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className=" text-white hover:text-blue-200 mx-2">Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className=" bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className=" text-white hover:text-blue-200 mx-2">Login</Link>
                            <Link to="/register" className=" bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar