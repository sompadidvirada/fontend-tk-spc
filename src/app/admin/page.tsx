import { getAllBranch } from "../api/server/branchs";
import Dashboard from "./dashboard/page";

export default async function  AdminDashboard () {

  return (
    <div>
      {/* Your dashboard stats and charts go here */}
      <Dashboard />
    </div>
  );
}
