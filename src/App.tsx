import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./components/dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="auth" element={<AuthLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
