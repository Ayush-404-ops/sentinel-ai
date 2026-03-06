import { DashboardLayout } from "@/components/layout/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">General Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">Risk Score Threshold (Critical)</label>
              <input type="number" defaultValue={70} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">Max Dwell Time (days)</label>
              <input type="number" defaultValue={10} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">Weight Discrepancy Alert (%)</label>
              <input type="number" defaultValue={15} className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <button className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
