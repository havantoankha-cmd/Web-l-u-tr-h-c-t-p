import React, { useState } from 'react';
import { 
  UserCircle, 
  Award, 
  Target, 
  BookOpen, 
  Sparkles, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  School, 
  UserCheck, 
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';
import { StudentProfile } from '../types';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface ProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updatedProfile: StudentProfile) => void;
  onOpenClassModal?: () => void;
  soundEnabled: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenClassModal,
  soundEnabled
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [className, setClassName] = useState(profile.className);
  const [schoolName, setSchoolName] = useState(profile.schoolName);
  const [teacherName, setTeacherName] = useState(profile.teacherName);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [studyMotto, setStudyMotto] = useState(profile.studyMotto);
  const [academicYear, setAcademicYear] = useState(profile.academicYear);

  // New Goal Input
  const [newGoalText, setNewGoalText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      fullName: fullName.trim(),
      className: className.trim(),
      schoolName: schoolName.trim(),
      teacherName: teacherName.trim(),
      studentId: studentId.trim(),
      birthDate: birthDate.trim(),
      studyMotto: studyMotto.trim(),
      academicYear: academicYear.trim()
    });
    playSuccessChime(soundEnabled);
    setIsEditing(false);
  };

  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = profile.goals.map(g => {
      if (g.id === goalId) {
        const nextState = !g.completed;
        if (nextState) {
          playSuccessChime(soundEnabled);
        } else {
          playToggleSound(soundEnabled);
        }
        return { ...g, completed: nextState };
      }
      return g;
    });

    onUpdateProfile({
      ...profile,
      goals: updatedGoals
    });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = {
      id: `g-${Date.now()}`,
      text: newGoalText.trim(),
      completed: false
    };

    onUpdateProfile({
      ...profile,
      goals: [...profile.goals, newGoal]
    });

    playSuccessChime(soundEnabled);
    setNewGoalText('');
  };

  const handleDeleteGoal = (goalId: string) => {
    playToggleSound(soundEnabled);
    onUpdateProfile({
      ...profile,
      goals: profile.goals.filter(g => g.id !== goalId)
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card with Student Avatar & Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-md shadow-blue-500/20 shrink-0">
              {profile.fullName.charAt(profile.fullName.lastIndexOf(' ') + 1) || 'A'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Học sinh THCS
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Mã số: {profile.studentId}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {profile.fullName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span>Lớp: <strong className="text-slate-800">{profile.className}</strong></span>
                <span>•</span>
                <span>{profile.schoolName}</span>
                <span>•</span>
                <span>GVCN: <strong className="text-blue-700">{profile.teacherName}</strong></span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenClassModal && (
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenClassModal();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm border border-indigo-200 transition-all cursor-pointer shadow-2xs"
                title="Quản lý danh sách lớp hoặc thêm lớp mới"
              >
                <School className="w-4 h-4 text-indigo-600" />
                <span>Quản lý Lớp</span>
              </button>
            )}

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setIsEditing(!isEditing);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Đóng form sửa</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa thông tin mẫu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Châm ngôn học tập */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 not-italic font-bold">Châm ngôn rèn luyện: </strong>
            &ldquo;{profile.studyMotto}&rdquo;
          </div>
        </div>

        {/* Inline Edit Form when toggled */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-200 space-y-4 bg-blue-50/40 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Chỉnh sửa thông tin học sinh & giáo viên</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lớp</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã học sinh</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trường học</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giáo viên phụ trách/chủ nhiệm</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Niên khóa</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Châm ngôn học tập</label>
                <input
                  type="text"
                  value={studyMotto}
                  onChange={(e) => setStudyMotto(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Lưu cập nhật
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Hai cột: Mục tiêu học tập & Thành tích / Khen thưởng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Mục tiêu học tập cá nhân */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Mục Tiêu Rèn Luyện & Học Tập
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {profile.goals.filter(g => g.completed).length}/{profile.goals.length} đã đạt
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Học sinh tự đặt mục tiêu đầu tuần/học kỳ và đánh dấu khi hoàn thành:
          </p>

          <div className="space-y-2">
            {profile.goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  goal.completed 
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleToggleGoal(goal.id)}
                >
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                      goal.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-emerald-500'
                    }`}
                  >
                    {goal.completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`text-xs sm:text-sm font-medium ${goal.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {goal.text}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteGoal(goal.id)}
                  title="Xóa mục tiêu này"
                  className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Goal Form */}
          <form onSubmit={handleAddGoal} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Thêm mục tiêu học tập mới..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm</span>
            </button>
          </form>
        </div>

        {/* Cột phải: Thành tích & Khen thưởng */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">
                Thành Tích & Khen Thưởng
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Ghi nhận từ Nhà trường & Thầy Toàn
            </span>
          </div>

          <div className="space-y-3">
            {profile.achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60 transition-colors flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Award className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      {ach.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Ghi nhận: {ach.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dặn dò & Liên hệ từ Giáo viên */}
          <div className="mt-4 pt-4 border-t border-slate-100 p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-1">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Kênh trao đổi với Thầy Hà Văn Toàn (GVCN 8A1)</span>
            </div>
            <p className="leading-relaxed">
              Mọi vướng mắc về bài tập hoặc lịch học các em có thể trao đổi trực tiếp trong giờ sinh hoạt lớp hoặc tiết Tin học/Toán trên phòng bộ môn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
