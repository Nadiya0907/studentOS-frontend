import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
export default function ProtectedRoute({children, role}){const {user,loading}=useAuth();if(loading)return <div className="grid min-h-screen place-items-center bg-bg"><Spinner size={34}/></div>;if(!user)return <Navigate to="/login" replace/>;if(role&&user.role!==role)return <Navigate to="/dashboard" replace/>;return children;}
