import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
