import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';import {Toaster} from 'react-hot-toast';import {AuthProvider} from './context/AuthContext';import ProtectedRoute from './routes/ProtectedRoute';import AppLayout from './layouts/AppLayout';import AuthLayout from './layouts/AuthLayout';import Landing from './pages/Landing';import PublicPage from './pages/PublicPage';import Login from './pages/Login';import Signup from './pages/Signup';import ForgotPassword from './pages/ForgotPassword';import VerifyEmail from './pages/VerifyEmail';import Dashboard from './pages/Dashboard';import Learning from './pages/Learning';import Placement from './pages/Placement';import Community from './pages/Community';import AiAssistant from './pages/AiAssistant';import Profile from './pages/Profile';import ResumeBuilder from './pages/ResumeBuilder';import Settings from './pages/Settings';import Notifications from './pages/Notifications';import NotFound from './pages/NotFound';import AdminLayout from './pages/admin/AdminLayout';import AdminDashboard from './pages/admin/AdminDashboard';import Users from './pages/admin/Users';import Reports from './pages/admin/Reports';import Analytics from './pages/admin/Analytics';import Feedback from './pages/admin/Feedback';
import ResetPassword from "./pages/ResetPassword";
import Attendance from "./pages/admin/Attendance";
import FileManagement from "./pages/FileManagement";
import Companies from "./pages/admin/Companies";
import Internships from "./pages/admin/Internships";
export default function App(){return <AuthProvider><Toaster position="top-right" toastOptions={{style:{background:'#151823',color:'#e5e7eb',border:'1px solid #272b39'}}}/><BrowserRouter><Routes><Route path="/" element={<Landing/>}/><Route path="/about" element={<PublicPage type="about"/>}/><Route path="/features" element={<PublicPage type="features"/>}/><Route path="/contact" element={<PublicPage type="contact"/>}/><Route element={<AuthLayout/>}><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/>
<Route path="/reset-password" element={<ResetPassword/>}/>
<Route path="/verify-email" element={<VerifyEmail/>}/></Route><Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/learning" element={<Learning/>}/><Route path="/placement" element={<Placement/>}/><Route path="/community" element={<Community/>}/><Route path="/ai" element={<AiAssistant/>}/><Route path="/resume-builder" element={<ResumeBuilder/>}/>
<Route
  path="/files"
  element={<FileManagement />}
/><Route path="/profile" element={<Profile/>}/><Route path="/settings" element={<Settings/>}/><Route path="/notifications" element={<Notifications/>}/></Route><Route element={<ProtectedRoute role="admin"><AdminLayout/></ProtectedRoute>}><Route path="/admin" element={<AdminDashboard/>}/><Route path="/admin/users" element={<Users/>}/><Route path="/admin/reports" element={<Reports/>}/><Route path="/admin/analytics" element={<Analytics/>}/><Route path="/admin/feedback" element={<Feedback/>}/><Route path="/admin/attendance" element={<Attendance/>}/>
<Route
  path="/admin/companies"
  element={<Companies />}
/>

<Route
  path="/admin/internships"
  element={<Internships />}
/></Route><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter></AuthProvider>}
