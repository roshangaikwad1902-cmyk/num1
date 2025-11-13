import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Onboarding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Welcome to SmartKrishi</CardTitle></CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/dashboard')} className="w-full">Continue to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
