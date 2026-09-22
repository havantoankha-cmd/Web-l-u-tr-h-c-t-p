import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  BarChart3, 
  UserCircle,
  Users
} from 'lucide-react';
import { ActiveTab } from '../types';
import { playClickSound } from '../utils/sound';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingAssignmentsCount: number;
  soundEnabled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingAssignmentsCount,
  soundEnabled
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Tổng quan học tập',
      shortLabel: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'assignments' as ActiveTab,
      label: 'Bài tập / Nhiệm vụ',
      shortLabel: 'Bài tập',
      icon: CheckSquare,
      badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : null
    },
    {
      id: 'schedule' as ActiveTab,
      label: 'Lịch học',
      shortLabel: 'Lịch học',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'students' as ActiveTab,
      label: 'Danh sách Lớp 8A1',
      shortLabel: 'Danh sách lớp',
      icon: Users,
      badge: null
    },
    {
      id: 'progress' as ActiveTab,
      label: 'Theo dõi tiến độ',
      shortLabel: 'Tiến độ',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Hồ sơ học sinh',
      shortLabel: 'Hồ sơ',
      icon: UserCircle,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex overflow-x-auto no-scrollbar py-2 sm:py-0 gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onTabChange(tab.id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-all shrink-0 relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-blue-700 bg-blue-50/70 border-b-2 border-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'text-blue-600 scale-110' : 'text-slate-500'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {tab.badge !== null && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
