// src/App.js
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Authentication from "./pages/authentication";
import Products from "./pages/products";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
