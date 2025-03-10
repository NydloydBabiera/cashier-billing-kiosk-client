import MainLayout from "./layouts/MainLayout";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import BillingDashboard from "./pages/BillingDashboard";
import TestPage from "./pages/TestPage";
import Navbar from "./components/Navbar";
import StudentTuitionPage from "./pages/StudentTuitionPage";
import LandingPage from "./pages/LandingPage";
import PromisoryPayments from "./pages/PromisoryPayments";
import PrintTable from "./components/common/PrintTable";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route index element={<LoginPage />} />
      {/* <Route index element={<LandingPage />} /> */}
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path="/users" element={<UserPage />} />
      <Route path="/tuition" element={<StudentTuitionPage />} />
      <Route path="/dashboard" element={<BillingDashboard />} />
      <Route path="/promisory" element={<PromisoryPayments />} />
      <Route path="/printTable" element={<PrintTable />} />
    </Route>
  )
);
const App = () => {
  // usestate hooks; 2 types of state; component state - relate to single component; app level or global state - relates to entire app and pass down to components
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
