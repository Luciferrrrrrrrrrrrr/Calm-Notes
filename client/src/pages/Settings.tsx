import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Shield, User, Bell } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile
            </CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                {user?.firstName?.[0] || "U"}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Button variant="destructive" onClick={() => logout()} className="w-full sm:w-auto gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Shield className="w-5 h-5 text-primary" /> Security & Privacy
            </CardTitle>
            <CardDescription>Configure application security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label className="text-base">Auto-Lock</Label>
                 <p className="text-sm text-muted-foreground">Lock application after 15 minutes of inactivity.</p>
               </div>
               <Switch defaultChecked />
             </div>
             
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label className="text-base">Mask Client Names</Label>
                 <p className="text-sm text-muted-foreground">Show initials only in dashboard view.</p>
               </div>
               <Switch />
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Bell className="w-5 h-5 text-primary" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between">
               <div className="space-y-0.5">
                 <Label className="text-base">Email Summaries</Label>
                 <p className="text-sm text-muted-foreground">Receive weekly summary of sessions.</p>
               </div>
               <Switch />
             </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
