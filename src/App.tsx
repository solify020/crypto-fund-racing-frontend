import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Header from './components/Header';
import Campaigns from './components/Campaigns';
import CreateCampaign from './components/CreateCampaign';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Web3Provider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col fade-in">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Campaigns />} />
              {/* <Route path="/campaigns" element={<Campaigns />} /> */}
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
