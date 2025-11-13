import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Languages, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
          <SelectTrigger className="w-32">
            <Languages className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mr">मराठी</SelectItem>
            <SelectItem value="hi">हिन्दी</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          {t('common.logout')}
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
