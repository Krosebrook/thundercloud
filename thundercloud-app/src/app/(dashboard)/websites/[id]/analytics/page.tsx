import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Analytics</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline">7 days</Button>
          <Button variant="outline">30 days</Button>
          <Button variant="outline">All time</Button>
          <Button>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-sm font-medium text-muted-foreground">Visitors</h4>
          <p className="text-2xl font-bold">1,234</p>
          <p className="text-xs text-muted-foreground">+15% from last period</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-sm font-medium text-muted-foreground">Page Views</h4>
          <p className="text-2xl font-bold">2,567</p>
          <p className="text-xs text-muted-foreground">+23% from last period</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-sm font-medium text-muted-foreground">Bounce Rate</h4>
          <p className="text-2xl font-bold">45%</p>
          <p className="text-xs text-muted-foreground">-5% from last period</p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-sm font-medium text-muted-foreground">Avg. Time on Site</h4>
          <p className="text-2xl font-bold">2m 34s</p>
          <p className="text-xs text-muted-foreground">+12% from last period</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h4 className="text-base font-medium">Traffic Sources</h4>
        <div className="mt-4 h-64"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-base font-medium">Top Pages</h4>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-base font-medium">Geographic Distribution</h4>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h4 className="text-base font-medium">🔴 Real-time: 12 active visitors</h4>
      </div>
    </div>
  );
}
