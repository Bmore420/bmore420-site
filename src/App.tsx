import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeVerificationModal from './components/AgeVerificationModal';
import Effects from './components/Effects';
import Home from './pages/Home';
import Events from './pages/Events';
import Blog from './pages/Blog';
import BlogPostBeginning from './pages/BlogPostBeginning';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Shop from './pages/Shop';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCanceled from './pages/CheckoutCanceled';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative text-white selection:bg-primary selection:text-white">
        <Effects />
        <AgeVerificationModal />
        
        <Navbar />
        
        <main id="main-content" className="flex-grow z-10 w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/the-beginning-of-bmore420" element={<BlogPostBeginning />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCanceled />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
