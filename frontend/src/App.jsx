import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AuthForm from './components/AuthForm';
import DashboardRedirect from './pages/DashboardRedirect';
import FirebaseTest from './components/FirebaseTest';
import Footer from './components/Footer';

function App() {
  return (
    <div className="w-full h-full">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/test" element={<FirebaseTest />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
