import React, { useState } from 'react';
import { 
  School, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  UserCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SchoolClass } from '../types';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface ClassManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  onAddClass: (newClass: Omit<SchoolClass, 'id'>, setActiveImmediately: boolean) => void;
  onEditClass: (updatedClass: SchoolClass) => void;
  onDeleteClass: (classId: string) => void;
  onOpenRoster?: (classId: string) => void;
  soundEnabled: boolean;
}

export const ClassManagerModal: React.FC<ClassManagerModalProps> = ({
  isOpen,
  onClose,
  classes,
  selectedClassId,
  onSelectClass,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onOpenRoster,
  soundEnabled
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  // Form states for Add / Edit
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Khối 8');
  const [room, setRoom] = useState('Phòng 204');
  const [homeroomTeacher, setHomeroomTeacher] = useState('Thầy Hà Văn Toàn');
  const [totalStudents, setTotalStudents] = useState<number>(40);
  const [academicYear, setAcademicYear] = useState('Năm học 2024 - 2025');
  const [description, setDescription] = useState('');
  const [setActiveImmediately, setSetActiveImmediately] = useState(true);

  // Quick grade presets
  const gradeOptions = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];

  if (!isOpen) return null;

  const handleStartAdd = () => {
    playClickSound(soundEnabled);
    setEditingClass(null);
    setName('');
    setGrade('Khối 8');
    setRoom('Phòng ' + (200 + Math.floor(Math.random() * 20)));
    setHomeroomTeacher('Thầy Hà Văn Toàn');
    setTotalStudents(40);
    setAcademicYear('Năm học 2024 - 2025');
    setDescription('');
    setSetActiveImmediately(true);
    setActiveTab('add');
  };

  const handleStartEdit = (cls: SchoolClass) => {
    playClickSound(soundEnabled);
    setEditingClass(cls);
    setName(cls.name);
    setGrade(cls.grade);
    setRoom(cls.room);
    setHomeroomTeacher(cls.homeroomTeacher);
    setTotalStudents(cls.totalStudents);
    setAcademicYear(cls.academicYear);
    setDescription(cls.description || '');
    setActiveTab('add');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClass) {
      onEditClass({
        ...editingClass,
        name: name.trim().toUpperCase(),
        grade,
        room: room.trim(),
        homeroomTeacher: homeroomTeacher.trim(),
        totalStudents: Number(totalStudents) || 40,
        academicYear: academicYear.trim(),
        description: description.trim()
      });
      playSuccessChime(soundEnabled);
      setEditingClass(null);
      setActiveTab('list');
    } else {
      onAddClass(
        {
          name: name.trim().toUpperCase(),
          grade,
          room: room.trim() || 'Phòng học chính',
          homeroomTeacher: homeroomTeacher.trim() || 'Thầy Hà Văn Toàn',
          totalStudents: Number(totalStudents) || 40,
          academicYear: academicYear.trim() || 'Năm học 2024 - 2025',
          description: description.trim(),
          createdAt: new Date().toISOString().split('T')[0]
        },
        setActiveImmediately
      );
      playSuccessChime(soundEnabled);
      setActiveTab('list');
    }
  };

  const handleDelete = (id: string, className: string) => {
    if (classes.length <= 1) {
      alert('Không thể xóa vì hệ thống cần duy trì ít nhất 1 lớp học!');
      return;
    }
    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa "${className}" khỏi danh sách quản lý không?`)) {
      playToggleSound(soundEnabled);
      onDeleteClass(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <School className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Quản Lý Lớp Học & Thêm Lớp Mới
              </h2>
              <p className="text-xs text-blue-200">
                Trường THCS Tăng Bạt Hổ • Phụ trách: <strong>Thầy Hà Văn Toàn</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 pt-3 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setEditingClass(null);
                setActiveTab('list');
              }}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách lớp ({classes.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                handleStartAdd();
              }}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingClass ? 'Sửa thông tin lớp' : 'Thêm lớp học mới'}</span>
            </button>
          </div>

          {activeTab === 'list' && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="mb-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lớp</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Chọn lớp để chuyển đổi giao diện học tập, hoặc bấm <strong>&ldquo;Thêm lớp&rdquo;</strong> để mở rộng quản lý cho các lớp học khác của Thầy Toàn:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classes.map((cls) => {
                  const isSelected = cls.id === selectedClassId;

                  return (
                    <div
                      key={cls.id}
                      className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400/50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Top card info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-lg bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                              {cls.name}
                            </span>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">
                                Lớp {cls.name}
                              </h3>
                              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                                {cls.grade}
                              </span>
                            </div>
                          </div>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <Check className="w-3 h-3" />
                              <span>Đang chọn</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                playSuccessChime(soundEnabled);
                                onSelectClass(cls.id);
                              }}
                              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors cursor-pointer"
                            >
                              Chọn lớp
                            </button>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{cls.room}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>GVCN: <strong>{cls.homeroomTeacher}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Sĩ số: <strong>{cls.totalStudents}</strong> học sinh</span>
                          </div>
                          {cls.description && (
                            <p className="text-[11px] text-slate-500 italic mt-1 pt-1 border-t border-slate-100/80 line-clamp-2">
                              {cls.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom actions */}
                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                        {onOpenRoster && (
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound(soundEnabled);
                              onSelectClass(cls.id);
                              onClose();
                              onOpenRoster(cls.id);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                            title={`Nhập và quản lý danh sách học sinh Lớp ${cls.name}`}
                          >
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>DS Học sinh</span>
                          </button>
                        )}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(cls)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Sửa thông tin lớp"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Sửa</span>
                          </button>
                          {classes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDelete(cls.id, cls.name)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Xóa lớp học này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Add / Edit Form */
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>{editingClass ? 'Cập nhật thông tin lớp học' : 'Thêm lớp học mới vào hệ thống THCS Tăng Bạt Hổ'}:</strong> Thầy cô có thể thiết lập tên lớp, khối, phòng học, giáo viên phụ trách để dễ dàng quản lý học sinh và thời khóa biểu.
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tên lớp học <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: 8A2, 8A3, 7A1, 9A2..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ví dụ: 8A2, 9A1, 7B...</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Khối lớp <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {gradeOptions.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          playClickSound(soundEnabled);
                          setGrade(g);
                        }}
                        className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                          grade === g
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phòng học bộ môn / Lớp
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Ví dụ: Phòng 205 (Tầng 2 - Dãy A)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giáo viên chủ nhiệm / Phụ trách
                  </label>
                  <input
                    type="text"
                    value={homeroomTeacher}
                    onChange={(e) => setHomeroomTeacher(e.target.value)}
                    placeholder="Thầy Hà Văn Toàn"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sĩ số học sinh
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={totalStudents}
                    onChange={(e) => setTotalStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Niên khóa học tập
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="Năm học 2024 - 2025"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Ghi chú / Đặc điểm nổi bật của lớp
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ví dụ: Lớp năng khiếu Tin học, phong trào học tập tích cực, CLB STEM..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {!editingClass && (
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setActiveImmediately}
                      onChange={(e) => setSetActiveImmediately(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>Chuyển sang lớp này làm lớp đang quản lý ngay sau khi thêm</span>
                  </label>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setEditingClass(null);
                    setActiveTab('list');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingClass ? 'Lưu thay đổi' : 'Thêm lớp học'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
