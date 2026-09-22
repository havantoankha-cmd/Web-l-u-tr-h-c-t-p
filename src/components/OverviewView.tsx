import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  CalendarDays,
  Target,
  Users
} from 'lucide-react';
import { Assignment, DaySchedule, StudentProfile, ActiveTab } from '../types';
import { SUBJECT_COLORS } from '../data/initialData';
import { playClickSound, playSuccessChime } from '../utils/sound';

interface OverviewViewProps {
  profile: StudentProfile;
  assignments: Assignment[];
  schedule: DaySchedule[];
  onToggleAssignmentStatus: (id: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectAssignmentForDetail: (assignment: Assignment) => void;
  onOpenClassModal?: () => void;
  soundEnabled: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  profile,
  assignments,
  schedule,
  onToggleAssignmentStatus,
  onNavigateTab,
  onSelectAssignmentForDetail,
  onOpenClassModal,
  soundEnabled
}) => {
  // Statistics calculations
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'da_hoan_thanh').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'dang_lam').length;
  const notStartedAssignments = assignments.filter(a => a.status === 'chua_lam').length;
  const overdueAssignments = assignments.filter(a => a.status === 'qua_han').length;
  const pendingAssignments = inProgressAssignments + notStartedAssignments;

  const completionPercentage = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  // Today's assignments or urgent tasks
  const todayDateStr = new Date().toISOString().split('T')[0];
  const urgentOrTodayAssignments = assignments
    .filter(a => a.status !== 'da_hoan_thanh')
    .slice(0, 4);

  // Today's schedule snapshot (find today or fallback to Thứ Ba/Thứ Hai)
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Mon, 2 is Tue...
  const dayKeyMap: Record<number, string> = {
    1: 't2', 2: 't3', 3: 't4', 4: 't5', 5: 't6', 6: 't7', 0: 't2'
  };
  const todayKey = dayKeyMap[currentDayIndex] || 't2';
  const todaySchedule = schedule.find(s => s.dayId === todayKey) || schedule[0];

  return (
    <div className="space-y-6">
      {/* 1. Lời chào học sinh & Trích dẫn giáo dục */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Chào mừng đến với Cổng học tập THCS Tăng Bạt Hổ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào em, {profile.fullName}! 👋
          </h2>

          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
            Thầy <strong className="text-white">{profile.teacherName}</strong> và nhà trường chúc em một tuần học tập thật nhiều hứng khởi, chủ động hoàn thành các bài học và rèn luyện thật tốt!
          </p>

          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-blue-200">
            {onOpenClassModal ? (
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenClassModal();
                }}
                className="flex items-center gap-1.5 font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xem hoặc chuyển lớp học"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Lớp {profile.className}</span>
                <span className="text-[10px] bg-black/20 px-1 py-0.2 rounded font-normal">Quản lý lớp</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Lớp {profile.className}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onNavigateTab('students');
              }}
              className="flex items-center gap-1.5 font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Nhập và xem danh sách học sinh Lớp 8A1"
            >
              <Users className="w-3.5 h-3.5 text-slate-950" />
              <span>Danh sách Lớp {profile.className}</span>
            </button>

            <span>•</span>
            <span>Hôm nay: {todaySchedule?.dayName || 'Thứ Ba'}</span>
            <span>•</span>
            <span className="text-amber-200 font-medium italic">
              &ldquo;{profile.studyMotto}&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* 2. Thẻ thống kê trực quan (4 Stat Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tổng bài tập */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500">Tổng số bài tập</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800">{totalAssignments}</span>
            <span className="text-xs text-slate-500 font-medium">nhiệm vụ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Toàn bộ môn học trong tuần</p>
        </div>

        {/* Card 2: Đã hoàn thành */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-emerald-700">Đã hoàn thành</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{completedAssignments}</span>
            <span className="text-xs text-emerald-600/80 font-medium">/{totalAssignments} bài</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">
            Đạt {completionPercentage}% kế hoạch
          </p>
        </div>

        {/* Card 3: Đang chờ xử lý */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-amber-700">Đang chờ xử lý</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingAssignments}</span>
            <span className="text-xs text-amber-700/80 font-medium">cần làm</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {inProgressAssignments} đang làm • {notStartedAssignments} chưa làm
          </p>
        </div>

        {/* Card 4: Quá hạn */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-rose-700">Cần nộp bù</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold ${overdueAssignments > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {overdueAssignments}
            </span>
            <span className="text-xs text-slate-500 font-medium">bài quá hạn</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {overdueAssignments > 0 ? 'Ưu tiên nộp sớm cho giáo viên' : 'Không có bài trễ hạn!'}
          </p>
        </div>
      </div>

      {/* 3. Thanh tiến độ học tập trực quan */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Tiến độ hoàn thành bài tập tổng thể
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Đã hoàn thành {completedAssignments} trên tổng số {totalAssignments} bài tập được giao
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-blue-700">{completionPercentage}%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {completionPercentage >= 75 ? 'Rất tốt 🌟' : completionPercentage >= 50 ? 'Khá 🚀' : 'Cần cố gắng 📚'}
            </span>
          </div>
        </div>

        {/* Progress Bar with smooth indicator */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full rounded-full bg-linear-to-r from-blue-600 to-emerald-500 transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Đã xong: {completedAssignments}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Đang làm: {inProgressAssignments}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Chưa làm: {notStartedAssignments}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onNavigateTab('progress');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            Chi tiết tiến độ theo môn <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Hai cột: Việc cần làm hôm nay & Lịch học hôm nay */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Việc cần làm hôm nay */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-800 text-base">Việc cần làm hôm nay & ưu tiên</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onNavigateTab('assignments');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                Xem tất cả ({assignments.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentOrTodayAssignments.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Tuyệt vời! Em đã hoàn thành hết nhiệm vụ!</p>
                <p className="text-xs text-slate-500 mt-1">Hãy nghỉ ngơi hoặc chuẩn bị bài cho ngày mai nhé.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentOrTodayAssignments.map((assignment) => {
                  const subjectColor = SUBJECT_COLORS[assignment.subject] || SUBJECT_COLORS['Mặc định'];
                  const isDone = assignment.status === 'da_hoan_thanh';

                  return (
                    <div
                      key={assignment.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all flex items-start gap-3 group"
                    >
                      {/* Checkbox button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDone) {
                            playSuccessChime(soundEnabled);
                          } else {
                            playClickSound(soundEnabled);
                          }
                          onToggleAssignmentStatus(assignment.id);
                        }}
                        title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                        className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white hover:border-emerald-500 text-transparent hover:text-emerald-500'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>

                      {/* Content */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          playClickSound(soundEnabled);
                          onSelectAssignmentForDetail(assignment);
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${subjectColor.badge}`}>
                            {assignment.subject}
                          </span>
                          {assignment.priority === 'khan_cap' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                              Khẩn cấp
                            </span>
                          )}
                          {assignment.status === 'qua_han' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                              Quá hạn
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mt-1 truncate group-hover:text-blue-700">
                          {assignment.title}
                        </h4>

                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Hạn: {assignment.deadline} ({assignment.deadlineTime || '21:00'})
                          </span>
                          <span className="text-blue-600 hover:underline">Chi tiết &rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>💡 Mẹo: Bấm ô vuông để đánh dấu hoàn thành nhanh</span>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onNavigateTab('assignments');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              + Thêm bài mới
            </button>
          </div>
        </div>

        {/* Cột phải: Lịch học hôm nay */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  Lịch học hôm nay ({todaySchedule?.dayName || 'Thứ Ba'})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onNavigateTab('schedule');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                Thời khóa biểu tuần <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todaySchedule?.items.map((period) => {
                const subjectColor = SUBJECT_COLORS[period.subject] || SUBJECT_COLORS['Mặc định'];

                return (
                  <div
                    key={period.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                        T{period.period}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {period.subject}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {period.room}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {period.topic}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-600">
                        {period.timeRange}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {period.teacher}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Phụ trách: <strong>Thầy Hà Văn Toàn</strong></span>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onNavigateTab('schedule');
              }}
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Xem cả tuần
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
