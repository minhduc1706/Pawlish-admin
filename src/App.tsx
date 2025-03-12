import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./components/dashboard/Index";
import Customer from "./components/userManagement/Customer";
import Employee from "./components/userManagement/Employee";
import ServiceList from "./components/serviceManagement/ServiceList";
import AppointmentsList from "./components/serviceManagement/Appointments";
import RevenueReport from "./components/analytics/Revenue";
import ProductManagement from "./components/inventory/Product";
import RestockOrder from "./components/inventory/RestockOrder";
import { TransactionHistory } from "./components/settings/ListTransaction";
import { EmployeeSchedule } from "./components/settings/EmployeeSchedules";
import { PromotionHistory } from "./components/promotionManagement/Promotions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/revenue" element={<RevenueReport />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/restocks" element={<RestockOrder />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/employee-schedules" element={<EmployeeSchedule />} />
          <Route path="/promotions" element={<PromotionHistory />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
