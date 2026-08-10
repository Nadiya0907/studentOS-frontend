import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-bg-hover flex items-center justify-center text-gray-300">
          <Bell size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-xs text-white font-semibold">
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
      </div>
    </div>
  );
}
