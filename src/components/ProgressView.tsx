import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Assignment, ActiveTab } from '../types';
import { SUBJECT_OPTIONS, SUBJECT_COLORS } from '../data/initialData';
import { playClickSound } from '../utils/sound';

interface ProgressViewProps {
  assignments: Assignment[];
  onNavigateTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  assignments,
  onNavigateTab,
  soundEnabled
}) => {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'da_hoan_thanh').length;
  const inProgress = assignments.filter(a => a.status === 'dang_lam').length;
  const notStarted = assignments.filter(a => a.status === 'chua_lam').length;
  const overdue = assignments.filter(a => a.status === 'qua_han').length;
  const pending = inProgress + notStarted;

  const overallPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by subject
  const subjectList = SUBJECT_OPTIONS.filter(s => s !== 'Tất cả');
  const subjectStats = subjectList.map(subject => {
    const subjectAssignments = assignments.filter(a => a.subject === subject);
    const subTotal = subjectAssignments.length;
    const subCompleted = subjectAssignments.filter(a => a.status === 'da_hoan_thanh').length;
    const subPending = subjectAssignments.filter(a => a.status === 'dang_lam' || a.status === 'chua_lam').length;
    const subOverdue = subjectAssignments.filter(a => a.status === 'qua_han').length;
    const percent = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;

    return {
      subject,
      total: subTotal,
      completed: subCompleted,
      pending: subPending,
      overdue: subOverdue,
      percentage: percent
    };
  }).filter(stat => stat.total > 0); // Only subjects that have assignments

  // SVG Donut calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const completedStroke = (completed / (total || 1)) * circumference;
  const inProgressStroke = (inProgress / (total || 1)) * circumference;
  const notStartedStroke = (notStarted / (total || 1)) * circumference;
  const overdueStroke = (overdue / (total || 1)) * circumference;

  return (
    <div className="space-y-6">
      {/* 1. Header & Sample Data Notice */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Theo Dõi Tiến Độ Học Tập Cá Nhân
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thống kê tỷ lệ hoàn thành bài tập, nhiệm vụ học tập thực tế theo từng môn
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold self-start sm:self-auto">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Dữ liệu thực tế từ danh sách bài tập hiện tại</span>
          </div>
        </div>

        {/* Clear transparency banner as requested */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Ghi chú giáo dục:</strong> Bảng theo dõi tiến độ này phản ánh chính xác số bài tập em đã làm, đang làm và quá hạn. Hệ thống không tạo ra điểm số ảo. Khi em đánh dấu hoàn thành bài tập ở mục Bài tập, các thanh tiến trình bên dưới sẽ lập tức được cập nhật!
          </div>
        </div>
      </div>

      {/* 2. Top Summary: Circular Donut Chart & Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Donut Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-slate-800 text-sm mb-4">
            Tỷ lệ hoàn thành tổng thể
          </h3>

          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth="16"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Completed ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-emerald-500 transition-all duration-500 ease-out"
                strokeWidth="16"
                strokeDasharray={`${completedStroke} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
              {/* In Progress ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-amber-500 transition-all duration-500 ease-out"
                strokeWidth="16"
                strokeDasharray={`${inProgressStroke} ${circumference}`}
                strokeDashoffset={`-${completedStroke}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Overdue ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-rose-500 transition-all duration-500 ease-out"
                strokeWidth="16"
                strokeDasharray={`${overdueStroke} ${circumference}`}
                strokeDashoffset={`-${completedStroke + inProgressStroke}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                {overallPercent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                {completed}/{total} bài xong
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs w-full max-w-xs text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600">Đã xong: <strong>{completed}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600">Đang làm: <strong>{inProgress}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
              <span className="text-slate-600">Chưa làm: <strong>{notStarted}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-600">Quá hạn: <strong>{overdue}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Key Progress Indicators */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nhiệm vụ đã nộp</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{completed}</div>
              <p className="text-[11px] text-slate-400 mt-1">Đạt {overallPercent}% tổng số bài</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4" />
                <span>Đang chờ hoàn thành</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{pending}</div>
              <p className="text-[11px] text-slate-400 mt-1">Cần tập trung giải quyết</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>Cần nộp bổ sung</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{overdue}</div>
              <p className="text-[11px] text-slate-400 mt-1">
                {overdue > 0 ? 'Nộp sớm cho thầy cô' : 'Đúng hạn 100%!'}
              </p>
            </div>
          </div>

          {/* Effort Assessment Card */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Đánh giá nỗ lực rèn luyện của Thầy Hà Văn Toàn
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {overallPercent >= 75
                    ? 'Em có ý thức tự giác học tập rất cao, nộp bài đầy đủ và đúng hẹn. Hãy tiếp tục duy trì tinh thần xuất sắc này!'
                    : overallPercent >= 50
                    ? 'Em đang có sự tiến bộ rất tốt! Hãy dành thêm thời gian hoàn thành các bài tập đang chờ để đạt phong độ cao nhất nhé.'
                    : 'Em cần chủ động hơn trong việc sắp xếp thời gian làm bài tập. Hãy xem lại danh sách bài cần làm hôm nay và bắt đầu từ các bài đơn giản trước.'}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound(soundEnabled);
                      onNavigateTab('assignments');
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    Xem danh sách bài tập cần làm ngay <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Breakdown by Subject */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Thống Kê Tiến Độ Theo Từng Môn Học
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Tổng cộng <strong>{subjectStats.length}</strong> môn đang có bài tập
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectStats.map((item) => {
            const subjectColor = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS['Mặc định'];

            return (
              <div 
                key={item.subject}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${subjectColor.badge}`}>
                      {item.subject}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-slate-800">{item.percentage}%</span>
                    <span className="text-[11px] text-slate-400">hoàn thành</span>
                  </div>
                </div>

                {/* Progress bar for subject */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-linear-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Đã hoàn thành: <strong className="text-emerald-700">{item.completed}/{item.total}</strong> bài
                  </span>
                  {item.overdue > 0 ? (
                    <span className="text-rose-600 font-bold">
                      {item.overdue} bài quá hạn
                    </span>
                  ) : item.pending > 0 ? (
                    <span className="text-amber-700 font-medium">
                      {item.pending} bài đang chờ
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">
                      Đã xong 100% ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
