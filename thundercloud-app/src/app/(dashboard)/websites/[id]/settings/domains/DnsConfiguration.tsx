import { Button } from "@/components/ui/button";

export function DnsConfiguration() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Configure DNS for mycompany.com</h3>
          <Button variant="ghost" size="icon">x</Button>
        </div>
        <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Add these records to your DNS provider:
            </p>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium">1. CNAME Record</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Name: www</p>
                <p className="text-xs text-muted-foreground">Value: cname.vercel-dns.com</p>
              </div>
              <Button variant="outline" size="sm">Copy</Button>
            </div>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-medium">2. A Record</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Name: @</p>
                <p className="text-xs text-muted-foreground">Value: 76.76.21.21</p>
              </div>
              <Button variant="outline" size="sm">Copy</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Need help? <a href="#" className="underline">GoDaddy</a> | <a href="#" className="underline">Namecheap</a> | <a href="#" className="underline">Cloudflare</a>
          </p>
        </div>
        <div className="mt-6 flex justify-between">
            <Button variant="outline">I'll do this later</Button>
            <Button>Verify DNS →</Button>
        </div>
      </div>
    </div>
  );
}
