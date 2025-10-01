import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import DashboardRedirect from './pages/DashboardRedirect';
import FertilityDashboard from './pages/FertilityDashboard';
import Footer from './components/Footer';
import Consultation from './pages/Consultation';

function App() {
  return (
    <div className="w-full h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/fertility" element={<FertilityDashboard />} />
          <Route path="/consultation" element={<Consultation />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
