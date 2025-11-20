import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PublishRide from "../pages/PublishRide";
import DriverDashboard from "../pages/DriverDashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/publish-ride" element={<PublishRide />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}
