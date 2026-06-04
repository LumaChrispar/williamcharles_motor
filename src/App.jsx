import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import ChatWidget from './components/ChatWidget';
import WelcomeOnboarding from './components/WelcomeOnboarding';
import Home from './pages/Home';
import Showroom from './pages/Showroom';
import VehicleDetail from './pages/VehicleDetail';
import PreviouslySold from './pages/PreviouslySold';
import SellYourCar from './pages/SellYourCar';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Vehicle-to-chat state — lifted up so VehicleDetail can trigger the ChatWidget
  const [vehicleToChat, setVehicleToChat] = useState(null);

  // Listen for custom events from VehicleDetail
  useEffect(() => {
    const handler = (e) => {
      setVehicleToChat(e.detail);
    };
    window.addEventListener('openChatWithVehicle', handler);
    return () => window.removeEventListener('openChatWithVehicle', handler);
  }, []);

  // Hidden Keyboard Shortcut (Ctrl+Shift+A or Cmd+Shift+A) to access Admin Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/previously-sold" element={<PreviouslySold />} />
        <Route path="/sell-your-car" element={<SellYourCar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieConsent />}
      {!isAdminRoute && (
        <ChatWidget
          vehicleToChat={vehicleToChat}
          onChatOpened={() => setVehicleToChat(null)}
        />
      )}
      {!isAdminRoute && <WelcomeOnboarding />}
    </>
  );
}
