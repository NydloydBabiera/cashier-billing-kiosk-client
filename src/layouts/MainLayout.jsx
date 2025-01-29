import React from "react";
import BillingDashboard from "../pages/BillingDashboard";
import RFIDReader from "../components/RFIDReader";
import UserPage from "../pages/UserPage";
import AddUserForm from "../components/AddUserForm";
import StudentTuitionPage from "../pages/StudentTuitionPage";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const noNavbarRoutes = ['/','/dashboard'];
  const hideNavbar = noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {/* <Navbar />
      <Outlet /> */}
       {!hideNavbar && <Navbar />}
      <main>
        <Outlet /> {/* Render the current page */}
      </main>
    </>
  );
};

export default MainLayout;
