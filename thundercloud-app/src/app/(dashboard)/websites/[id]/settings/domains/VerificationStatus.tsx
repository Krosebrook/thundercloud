import { Button } from "@/components/ui/button";

export function VerificationStatus() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Verifying mycompany.com...</h3>
          <Button variant="ghost" size="icon">x</Button>
        </div>
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">⏳ Checking DNS configuration...</p>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-green-500">✓ CNAME record found</p>
            <p className="text-sm text-green-500">✓ A record found</p>
            <p className="text-sm text-muted-foreground">⏳ SSL certificate provisioning...</p>
          </div>
          <p className="text-xs text-muted-foreground">
            This usually takes 1-5 minutes.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Refresh Status</Button>
        </div>
      </div>
    </div>
  );
}
