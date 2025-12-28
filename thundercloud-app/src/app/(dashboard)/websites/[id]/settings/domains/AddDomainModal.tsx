import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddDomainModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Add Custom Domain</h3>
          <Button variant="ghost" size="icon">x</Button>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="domain">Domain Name</Label>
            <Input id="domain" placeholder="mycompany.com" />
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your domain without http:// or www
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isPrimary" />
            <Label htmlFor="isPrimary">Set as primary domain</Label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
