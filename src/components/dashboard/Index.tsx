import DashboardCharts from "./DashboardChart";
import DashboardLowStock from "./DashboardLowStock";
import DashboardOverview from "./DashboardOverview";
import DashboardProductStats from "./DashboardProductStats";
import DashboardRecentActivity from "./DashboardRecentActivity";

const Index = () => {
  return (
    <>

<DashboardOverview/>
<DashboardCharts />
<DashboardProductStats />
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <DashboardLowStock />
  <DashboardRecentActivity />
</div>
    </>
  );
};

export default Index;
