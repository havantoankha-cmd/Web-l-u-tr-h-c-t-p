import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  X, 
  FileText, 
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { Assignment, AssignmentStatus } from '../types';
import { SUBJECT_OPTIONS, SUBJECT_COLORS } from '../data/initialData';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface AssignmentsViewProps {
  assignments: Assignment[];
  onToggleStatus: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: AssignmentStatus) => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  selectedAssignmentForDetail: Assignment | null;
  onSelectAssignmentForDetail: (assignment: Assignment | null) => void;
  soundEnabled: boolean;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  onToggleStatus,
  onUpdateStatus,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  selectedAssignmentForDetail,
  onSelectAssignmentForDetail,
  soundEnabled
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Toán học');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDeadlineTime, setFormDeadlineTime] = useState('21:00');
  const [formStatus, setFormStatus] = useState<AssignmentStatus>('chua_lam');
  const [formPriority, setFormPriority] = useState<'binh_thuong' | 'quan_trong' | 'khan_cap'>('binh_thuong');
  const [formDescription, setFormDescription] = useState('');
  const [formTeacherNote, setFormTeacherNote] = useState('');

  // Filter logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Subject match
      const matchSubject = selectedSubject === 'Tất cả' || item.subject === selectedSubject;

      // Status match
      const matchStatus = 
        selectedStatus === 'all' || 
        item.status === selectedStatus;

      // Query match
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = 
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchSubject && matchStatus && matchQuery;
    });
  }, [assignments, selectedSubject, selectedStatus, searchQuery]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    playClickSound(soundEnabled);
    setFormTitle('');
    setFormSubject('Toán học');
    // Default tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDeadline(tomorrow.toISOString().split('T')[0]);
    setFormDeadlineTime('21:00');
    setFormStatus('chua_lam');
    setFormPriority('binh_thuong');
    setFormDescription('');
    setFormTeacherNote('Thầy Hà Văn Toàn: Nhắc các em nộp bài đúng hạn.');
    setEditingAssignment(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (assignment: Assignment) => {
    playClickSound(soundEnabled);
    setFormTitle(assignment.title);
    setFormSubject(assignment.subject);
    setFormDeadline(assignment.deadline);
    setFormDeadlineTime(assignment.deadlineTime || '21:00');
    setFormStatus(assignment.status);
    setFormPriority(assignment.priority);
    setFormDescription(assignment.description);
    setFormTeacherNote(assignment.teacherNote || '');
    setEditingAssignment(assignment);
    setIsAddModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingAssignment) {
      onEditAssignment({
        ...editingAssignment,
        title: formTitle.trim(),
        subject: formSubject,
        deadline: formDeadline,
        deadlineTime: formDeadlineTime,
        status: formStatus,
        priority: formPriority,
        description: formDescription.trim(),
        teacherNote: formTeacherNote.trim()
      });
      playClickSound(soundEnabled);
    } else {
      onAddAssignment({
        title: formTitle.trim(),
        subject: formSubject,
        deadline: formDeadline,
        deadlineTime: formDeadlineTime,
        status: formStatus,
        priority: formPriority,
        description: formDescription.trim(),
        teacherNote: formTeacherNote.trim(),
        maxScore: 10
      });
      playSuccessChime(soundEnabled);
    }

    setIsAddModalOpen(false);
    setEditingAssignment(null);
  };

  // Status badge config
  const getStatusBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'da_hoan_thanh':
        return {
          label: 'Đã hoàn thành',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2
        };
      case 'dang_lam':
        return {
          label: 'Đang làm',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Clock
        };
      case 'qua_han':
        return {
          label: 'Quá hạn',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: AlertCircle
        };
      case 'chua_lam':
      default:
        return {
          label: 'Chưa làm',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Danh Sách Bài Tập & Nhiệm Vụ Học Tập
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Theo dõi hạn chót, chi tiết yêu cầu và đánh dấu bài đã hoàn thành
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập mới</span>
          </button>
        </div>

        {/* 2. Search & Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bài, môn học, từ khóa..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedSubject}
              onChange={(e) => {
                playToggleSound(soundEnabled);
                setSelectedSubject(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  Môn: {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                playToggleSound(soundEnabled);
                setSelectedStatus(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="chua_lam">⏳ Chưa làm</option>
              <option value="dang_lam">🔄 Đang làm</option>
              <option value="da_hoan_thanh">✅ Đã hoàn thành</option>
              <option value="qua_han">⚠️ Quá hạn</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Lọc nhanh:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'chua_lam', label: 'Chưa làm' },
            { id: 'dang_lam', label: 'Đang làm' },
            { id: 'da_hoan_thanh', label: 'Đã hoàn thành' },
            { id: 'qua_han', label: 'Quá hạn' },
          ].map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                playToggleSound(soundEnabled);
                setSelectedStatus(tag.id);
              }}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                selectedStatus === tag.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
          <span className="ml-auto text-slate-400">
            Hiển thị <strong>{filteredAssignments.length}</strong> bài tập
          </span>
        </div>
      </div>

      {/* 3. Assignment Cards Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Không tìm thấy bài tập nào</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Không có bài tập phù hợp với bộ lọc &quot;{selectedSubject}&quot; hoặc từ khóa hiện tại.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubject('Tất cả');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const subjectColor = SUBJECT_COLORS[assignment.subject] || SUBJECT_COLORS['Mặc định'];
            const statusInfo = getStatusBadge(assignment.status);
            const StatusIcon = statusInfo.icon;
            const isDone = assignment.status === 'da_hoan_thanh';

            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : assignment.status === 'qua_han'
                    ? 'border-rose-200 bg-rose-50/15'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Header Row: Subject, Priority & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${subjectColor.badge}`}>
                        {assignment.subject}
                      </span>
                      {assignment.priority === 'khan_cap' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                          Khẩn cấp
                        </span>
                      )}
                      {assignment.priority === 'quan_trong' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                          Quan trọng
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => {
                      playClickSound(soundEnabled);
                      onSelectAssignmentForDetail(assignment);
                    }}
                    className="font-bold text-slate-800 text-sm sm:text-base leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {assignment.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {assignment.description}
                  </p>

                  {/* Teacher Note preview */}
                  {assignment.teacherNote && (
                    <div className="mt-2.5 p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 italic">{assignment.teacherNote}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Deadline, Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn: <strong className="text-slate-700">{assignment.deadline}</strong> ({assignment.deadlineTime || '21:00'})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Detail button */}
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound(soundEnabled);
                        onSelectAssignmentForDetail(assignment);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>

                    {/* Quick Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(assignment)}
                      title="Chỉnh sửa bài tập"
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa bài tập "${assignment.title}"?`)) {
                          playToggleSound(soundEnabled);
                          onDeleteAssignment(assignment.id);
                        }
                      }}
                      title="Xóa bài tập"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Complete / Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!isDone) {
                          playSuccessChime(soundEnabled);
                        } else {
                          playClickSound(soundEnabled);
                        }
                        onToggleStatus(assignment.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Đã xong ✓' : 'Đánh dấu xong'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL CHI TIẾT BÀI TẬP */}
      {selectedAssignmentForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedAssignmentForDetail.subject}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedAssignmentForDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSelectAssignmentForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block">Thời hạn nộp:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAssignmentForDetail.deadline} ({selectedAssignmentForDetail.deadlineTime || '21:00'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Trạng thái hiện tại:</span>
                  <span className="font-bold text-slate-800">
                    {selectedAssignmentForDetail.status === 'da_hoan_thanh' ? '✅ Đã hoàn thành' :
                     selectedAssignmentForDetail.status === 'dang_lam' ? '🔄 Đang làm' :
                     selectedAssignmentForDetail.status === 'qua_han' ? '⚠️ Quá hạn' : '⏳ Chưa làm'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nội dung & Yêu cầu bài tập:
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                  {selectedAssignmentForDetail.description}
                </div>
              </div>

              {selectedAssignmentForDetail.teacherNote && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                    Lời dặn của Thầy Hà Văn Toàn / Giáo viên:
                  </h4>
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-blue-900 text-xs sm:text-sm leading-relaxed italic">
                    💡 &ldquo;{selectedAssignmentForDetail.teacherNote}&rdquo;
                  </div>
                </div>
              )}

              {/* Status Selector in Modal */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cập nhật trạng thái bài tập:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'chua_lam', label: 'Chưa làm' },
                    { id: 'dang_lam', label: 'Đang làm' },
                    { id: 'da_hoan_thanh', label: 'Đã xong' },
                    { id: 'qua_han', label: 'Quá hạn' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        if (st.id === 'da_hoan_thanh') {
                          playSuccessChime(soundEnabled);
                        } else {
                          playClickSound(soundEnabled);
                        }
                        onUpdateStatus(selectedAssignmentForDetail.id, st.id as AssignmentStatus);
                        onSelectAssignmentForDetail({
                          ...selectedAssignmentForDetail,
                          status: st.id as AssignmentStatus
                        });
                      }}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedAssignmentForDetail.status === st.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleOpenEditModal(selectedAssignmentForDetail);
                  onSelectAssignmentForDetail(null);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Chỉnh sửa bài này &rarr;
              </button>
              <button
                type="button"
                onClick={() => onSelectAssignmentForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL THÊM / SỬA BÀI TẬP */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmitForm}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {editingAssignment ? 'Chỉnh Sửa Bài Tập' : 'Thêm Bài Tập Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Tên bài */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên bài tập / Nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Bài tập Hình học trang 25..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Môn & Mức độ ưu tiên */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {SUBJECT_OPTIONS.filter(s => s !== 'Tất cả').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as 'binh_thuong' | 'quan_trong' | 'khan_cap')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="binh_thuong">Bình thường</option>
                    <option value="quan_trong">Quan trọng</option>
                    <option value="khan_cap">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Hạn nộp & Giờ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hạn hoàn thành (Ngày)
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                  </input>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giờ nộp
                  </label>
                  <input
                    type="time"
                    value={formDeadlineTime}
                    onChange={(e) => setFormDeadlineTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Trạng thái ban đầu
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AssignmentStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="chua_lam">⏳ Chưa làm</option>
                  <option value="dang_lam">🔄 Đang làm</option>
                  <option value="da_hoan_thanh">✅ Đã hoàn thành</option>
                  <option value="qua_han">⚠️ Quá hạn</option>
                </select>
              </div>

              {/* Mô tả chi tiết */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung chi tiết & hướng dẫn làm bài
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi rõ câu hỏi, số trang SGK hoặc yêu cầu chuẩn bị..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Lời dặn giáo viên */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lời dặn của Thầy Hà Văn Toàn / Giáo viên (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={formTeacherNote}
                  onChange={(e) => setFormTeacherNote(e.target.value)}
                  placeholder="Ví dụ: Lưu ý trình bày sạch đẹp, nộp đúng hạn."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                {editingAssignment ? 'Lưu thay đổi' : 'Thêm bài tập'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
