import React from 'react';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './presentation/features/auth/router/PrivateRouter';
import LoginPage from './presentation/features/auth/pages/LoginPage'
import OrdersPage from './presentation/features/order/pages/OrdersPage'

function App() {
  return (
   <Routes>
      <Route path="/" element={<LoginPage />} />
     <Route path="/orders" element={ <PrivateRoute> <OrdersPage /> </PrivateRoute> } />
    </Routes>
  );
}

export default App;
