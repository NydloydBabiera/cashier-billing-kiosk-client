import React from "react";
import BillingDashboard from "../pages/BillingDashboard";
import RFIDReader from "../components/RFIDReader";
import UserPage from "../pages/UserPage";
import AddUserForm from "../components/AddUserForm";
import StudentTuitionPage from "../pages/StudentTuitionPage";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <BillingDashboard />
      <AddUserForm />
      <UserPage />
      <StudentTuitionPage /> */}
    </>
  );
};

export default MainLayout;
