import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PublishRide from "../pages/PublishRide";
import DriverDashboard from "../pages/DriverDashboard";
import PassengerDashboard from "../pages/PassengerDashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/publish-ride" element={<PublishRide />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
      <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
    </Routes>
  );
}
