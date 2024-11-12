import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Authentication from "./pages/authentication";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
import Profile from "./pages/profile";
// import Alerts from "./pages/alerts";
import { UserProvider, useUser } from "./context/UserContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/OrdersContext";
import { SuppliersProvider } from "./context/SupplierContext";

const AppContent = () => {
  const { profile } = useUser();
  const storename = profile?.storename || "temp";
  return (
    <Router>
      <Routes>
        <Route path={`${storename}/dashboard`} element={<Dashboard />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path={`${storename}/products`} element={<Products />} />
        <Route path={`${storename}/suppliers`} element={<Suppliers />} />
        <Route path={`${storename}/profile`} element={<Profile />} />
        {/* <Route path="/alerts" element={<Alerts />} /> */}
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <UserProvider>
      <SuppliersProvider>
        <OrdersProvider>
          <ProductsProvider>
            <AppContent />
          </ProductsProvider>
        </OrdersProvider>
      </SuppliersProvider>
    </UserProvider>
  );
};

export default App;
