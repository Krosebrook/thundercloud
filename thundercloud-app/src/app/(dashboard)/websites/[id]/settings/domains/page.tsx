import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Custom Domains</h3>
        <p className="text-sm text-muted-foreground">
          Connect your own domain to this website.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h4 className="text-base font-medium">Default Domain</h4>
          <p className="text-sm text-muted-foreground">https://mysite.thundercloud.app</p>
          <p className="text-sm text-green-500">✓ Active</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div>
            <h4 className="text-base font-medium">Custom Domains (0/3)</h4>
          </div>
          <Button>+ Add Domain</Button>
        </div>
        <div className="p-6 pt-0">
          <p className="text-sm text-muted-foreground">
            No custom domains yet. Add your first domain to make your site professional.
          </p>
        </div>
      </div>
    </div>
  );
}
