import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Showroom from './pages/Showroom';
import VehicleDetail from './pages/VehicleDetail';
import PreviouslySold from './pages/PreviouslySold';
import SellYourCar from './pages/SellYourCar';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/previously-sold" element={<PreviouslySold />} />
        <Route path="/sell-your-car" element={<SellYourCar />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <CookieConsent />
    </>
  );
}
