import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'; 

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/services.jsx'));
const Education = lazy(() => import('./pages/Education.jsx'));
const Projects = lazy(() => import('./pages/Project.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const SignIn = lazy(() => import('./pages/SignIn.jsx'));
const AdminContacts = lazy(() => import('./pages/AdminContacts.jsx'));

function AuthStatus() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>
            Welcome, {user.name} Your role is {user.role}!
            <button onClick={logout}>Logout</button>
        </p>
      ) : (
          <p>You are not logged in.</p>
      )}
    </div>
  );
}

function App() { 
  return ( 
    <AuthProvider>
      <BrowserRouter> 
        <Link to="/">Home</Link> 
        <Link to="/about">About</Link> 
        <Link to="/services">Services</Link> 
        <Link to="/education">Education</Link> 
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link> 
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>

        <AuthStatus /> 

        <Suspense fallback={<div>Loading Page...</div>}>
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<About />} /> 
            <Route path="/services" element={<Services />} /> 
            <Route path="/education" element={<Education />} /> 
            <Route path="/projects" element={<Projects />} /> 
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/contacts" element={<AdminContacts />} />
            </Route>
          </Routes>
          </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App; 
