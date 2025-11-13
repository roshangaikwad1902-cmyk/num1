import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const Settings = () => {
  const user = useAuthStore(state => state.user);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <Button variant="outline" className="mt-4">Reset Demo Data</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
