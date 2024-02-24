import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import AddCases from "./pages/AddCases";
import TotalProducts from "./pages/TotalProducts";

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
        </Routes>
      </Router>
    </>
  );
};

export default MainRouter;
