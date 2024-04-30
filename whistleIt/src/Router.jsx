import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import TotalCases from "./pages/TotalCases";
import Assigned from "./pages/Assigned";
import OnGoing from "./pages/OnGoing";
import Pending from "./pages/Pending";
import Completed from "./pages/Completed";
import AddCases from "./pages/AddCases";
import Details from "./pages/Details";

const MainRouter = () => {
  return (
    <>
      <Router>
        {/* <NewNavbar /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/details/:caseId" element={<Details />} /> */}
          <Route path="/add" element={<AddCases />} />
          <Route path="/totalCases" element={<TotalCases />} />
          <Route path="/assigned" element={<Assigned />} />
          <Route path="/onGoing" element={<OnGoing />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
};

export default MainRouter;
