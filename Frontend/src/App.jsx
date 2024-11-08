// src/App.js
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Authentication from "./pages/authentication";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
// import Profile from "./pages/profile";
// import Alerts from "./pages/alerts";
import { UserProvider } from "./context/UserContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/OrdersContext";

const App = () => {
  return (
    <OrdersProvider>
      <ProductsProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/alerts" element={<Alerts />} /> */}
          </Routes>
        </Router>
      </UserProvider>
    </ProductsProvider>
    </OrdersProvider>    
  );
};

export default App;
