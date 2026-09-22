import React from 'react';
import { Volume2, VolumeX, RotateCcw, GraduationCap, School, Maximize, Minimize } from 'lucide-react';
import { StudentProfile } from '../types';
import { playClickSound, playToggleSound } from '../utils/sound';

interface HeaderProps {
  profile: StudentProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSelectProfileTab: () => void;
  onOpenClassModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onResetData,
  isFullscreen,
  onToggleFullscreen,
  onSelectProfileTab,
  onOpenClassModal
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner with educational institutional style */}
      <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 text-white px-4 py-2 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <School className="w-4 h-4 text-blue-200 shrink-0" />
            <span className="uppercase text-blue-100 font-bold">{profile.schoolName}</span>
            <span className="hidden sm:inline text-blue-300">•</span>
            <span className="hidden sm:inline text-blue-100">GV Quản lý: <strong className="text-white">{profile.teacherName}</strong></span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenClassModal ? (
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenClassModal();
                }}
                className="bg-blue-600/80 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-400/40 shadow-xs"
                title="Nhấn để đổi lớp học hoặc thêm lớp mới"
              >
                <span>🏫 Lớp {profile.className}</span>
                <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded">Đổi/Thêm lớp</span>
              </button>
            ) : (
              <span className="bg-blue-600/60 text-blue-100 px-2 py-0.5 rounded text-xs">
                Lớp {profile.className}
              </span>
            )}
            <span className="hidden md:inline text-blue-200 text-xs">
              {profile.academicYear}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* App Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              CỔNG QUẢN TRỊ HỌC TẬP
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              THCS TĂNG BẠT HỔ • Học sinh & Giáo viên quản lý
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              playToggleSound(!soundEnabled);
              onToggleSound();
            }}
            title={soundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              soundEnabled
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Âm thanh: Tắt</span>
              </>
            )}
          </button>

          {/* Class Manager Quick Button */}
          {onOpenClassModal && (
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onOpenClassModal();
              }}
              title="Quản lý danh sách lớp học hoặc thêm lớp mới"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer shadow-2xs"
            >
              <School className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Quản lý Lớp</span>
              <span className="sm:hidden font-bold">{profile.className}</span>
            </button>
          )}

          {/* Presentation / Fullscreen toggle for classroom projection */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onToggleFullscreen();
            }}
            title={isFullscreen ? 'Thu nhỏ giao diện' : 'Chế độ Trình chiếu lớp học'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Thu nhỏ</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Trình chiếu</span>
              </>
            )}
          </button>

          {/* Reset sample data */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onResetData();
            }}
            title="Đặt lại dữ liệu mẫu của Thầy Toàn"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Dữ liệu mẫu</span>
          </button>

          {/* Quick Student Badge */}
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onSelectProfileTab();
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {profile.fullName.charAt(profile.fullName.lastIndexOf(' ') + 1) || 'A'}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                {profile.fullName}
              </p>
              <p className="text-[10px] text-slate-500">
                Lớp {profile.className}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
