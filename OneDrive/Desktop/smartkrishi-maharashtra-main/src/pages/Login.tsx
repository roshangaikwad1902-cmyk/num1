import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { Smartphone, Mail, Sprout, Languages } from 'lucide-react';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore(state => state.login);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    // Normalize phone number (remove spaces, handle with/without +91)
    const normalized = phoneNumber.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^91/, '');
    if (normalized === '9000011111' || phoneNumber === '+919000011111' || phoneNumber === '+91 90000 11111') {
      setOtpSent(true);
      toast({
        title: t('auth.otpSent'),
        description: 'OTP: 123456',
      });
    } else {
      toast({
        title: t('common.error'),
        description: t('auth.invalidCredentials'),
        variant: 'destructive',
      });
    }
  };

  const handlePhoneLogin = async () => {
    setLoading(true);
    // Normalize phone number for login
    const normalizedPhone = phoneNumber.replace(/\s+/g, '');
    const success = await login({ phone: normalizedPhone, otp });
    setLoading(false);

    if (success) {
      toast({ title: t('auth.loginSuccess') });
      navigate('/dashboard');
    } else {
      toast({
        title: t('common.error'),
        description: t('auth.invalidCredentials'),
        variant: 'destructive',
      });
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);

    if (success) {
      toast({ title: t('auth.loginSuccess') });
      navigate('/dashboard');
    } else {
      toast({
        title: t('common.error'),
        description: t('auth.invalidCredentials'),
        variant: 'destructive',
      });
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Language Selector */}
        <div className="flex justify-center">
          <Select defaultValue="mr" onValueChange={changeLanguage}>
            <SelectTrigger className="w-40 bg-background/90 backdrop-blur">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mr">मराठी</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-none shadow-2xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sprout className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{t('app.name')}</CardTitle>
            <CardDescription className="text-lg">{t('app.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  {t('auth.loginWithPhone')}
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('auth.loginWithEmail')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t('auth.phonePlaceholder')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={otpSent}
                    className="text-lg"
                  />
                </div>

                {!otpSent ? (
                  <Button 
                    onClick={handleSendOTP} 
                    className="w-full text-lg h-12"
                    size="lg"
                  >
                    {t('auth.sendOTP')}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">{t('auth.otp')}</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder={t('auth.otpPlaceholder')}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="text-lg text-center tracking-widest"
                      />
                    </div>
                    <Button 
                      onClick={handlePhoneLogin} 
                      disabled={loading || otp.length !== 6}
                      className="w-full text-lg h-12"
                      size="lg"
                    >
                      {loading ? t('common.loading') : t('auth.verify')}
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="farmer@smartkrishi.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button 
                  onClick={handleEmailLogin} 
                  disabled={loading}
                  className="w-full text-lg h-12"
                  size="lg"
                >
                  {loading ? t('common.loading') : t('auth.login')}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>📱 Phone: +91 90000 11111, OTP: 123456</p>
              <p>🌾 Farmer: farmer@smartkrishi.in / farmer123</p>
              <p>📧 Advisor: advisor@smartkrishi.in / advisor123</p>
              <p>🔑 Admin: admin@smartkrishi.in / admin123</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;
