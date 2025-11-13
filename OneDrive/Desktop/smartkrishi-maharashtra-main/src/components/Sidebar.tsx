import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, MapPin, Radio, Bell, FileText, MessageSquare, 
  Settings, Shield, TrendingUp, Leaf, Droplets, TestTube 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), roles: ['farmer', 'advisor', 'admin'] },
    { path: '/fields', icon: MapPin, label: t('nav.fields'), roles: ['farmer'] },
    { path: '/iot', icon: Radio, label: t('nav.iot'), roles: ['farmer'] },
    { path: '/weather', icon: Droplets, label: 'Weather', roles: ['farmer', 'advisor'] },
    { path: '/ai', icon: TrendingUp, label: 'AI Models', roles: ['farmer', 'advisor'] },
    { path: '/alerts', icon: Bell, label: t('nav.alerts'), roles: ['farmer'] },
    { path: '/soil', icon: TestTube, label: 'Soil', roles: ['farmer', 'advisor'] },
    { path: '/chat', icon: MessageSquare, label: t('nav.chat'), roles: ['farmer'] },
    { path: '/reports', icon: FileText, label: t('nav.reports'), roles: ['farmer', 'advisor'] },
    { path: '/settings', icon: Settings, label: 'Settings', roles: ['farmer', 'advisor', 'admin'] },
    { path: '/admin', icon: Shield, label: t('nav.admin'), roles: ['admin'] },
  ];

  const visibleItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r border-border h-screen overflow-y-auto sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">{t('app.name')}</h1>
        <p className="text-sm text-muted-foreground">{t('app.tagline')}</p>
      </div>
      
      <nav className="px-3 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
