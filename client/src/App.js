import Home from './pages/Home'
import Dashboard from './pages/Dashboard';
import OnBoarding from './pages/OnBoarding';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onBoarding" element={<OnBoarding />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
