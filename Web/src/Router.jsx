import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import AddCases from "./pages/AddCases";
import TotalProducts from "./pages/TotalProducts";
import MyInventory from "./pages/MyInventory";

const MainRouter = () => {
  return (
    <>
      <Router>
        {/* <NewNavbar /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/addProduct" element={<AddCases />} />
          <Route path="/totalProducts" element={<TotalProducts />} />
          <Route path="/myInventory" element={<MyInventory />} />
        </Routes>
      </Router>
    </>
  );
};

export default MainRouter;
