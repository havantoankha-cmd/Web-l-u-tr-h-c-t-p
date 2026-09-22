import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Award, 
  School, 
  Sparkles, 
  UserCheck, 
  RotateCcw,
  X,
  Download,
  FileUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ClassStudent, SchoolClass } from '../types';
import { ImportStudentsModal } from './ImportStudentsModal';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface ClassRosterViewProps {
  currentClass: SchoolClass;
  students: ClassStudent[];
  onAddStudent: (newStudent: Omit<ClassStudent, 'id'>) => void;
  onEditStudent: (student: ClassStudent) => void;
  onDeleteStudent: (studentId: string) => void;
  onImportStudents: (students: ClassStudent[], mode: 'replace' | 'append') => void;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'excused') => void;
  onOpenClassManager: () => void;
  soundEnabled: boolean;
}

export const ClassRosterView: React.FC<ClassRosterViewProps> = ({
  currentClass,
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onImportStudents,
  onUpdateAttendance,
  onOpenClassManager,
  soundEnabled
}) => {
  // Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<ClassStudent | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<ClassStudent | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'cadres'>('all');

  // Form states for Add / Edit
  const [fullName, setFullName] = useState('');
  const [stt, setStt] = useState<number>(students.length + 1);
  const [studentCode, setStudentCode] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [birthDate, setBirthDate] = useState('15/04/2011');
  const [group, setGroup] = useState('Tổ 1');
  const [role, setRole] = useState('Học sinh');
  const [parentPhone, setParentPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Filtered students for current class
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === currentClass.id || s.classId === 'cls-8a1');
  }, [students, currentClass.id]);

  // Applied filtered list
  const filteredStudents = useMemo(() => {
    return classStudents.filter(student => {
      const matchQuery = 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.parentPhone && student.parentPhone.includes(searchQuery));

      const matchGender = genderFilter === 'all' || student.gender === genderFilter;
      const matchGroup = groupFilter === 'all' || student.group === groupFilter;
      const matchRole = roleFilter === 'all' || (roleFilter === 'cadres' && student.role && student.role !== 'Học sinh');

      return matchQuery && matchGender && matchGroup && matchRole;
    }).sort((a, b) => a.stt - b.stt);
  }, [classStudents, searchQuery, genderFilter, groupFilter, roleFilter]);

  // Statistics
  const totalCount = classStudents.length;
  const maleCount = classStudents.filter(s => s.gender === 'Nam').length;
  const femaleCount = classStudents.filter(s => s.gender === 'Nữ').length;
  const cadresCount = classStudents.filter(s => s.role && s.role !== 'Học sinh').length;
  const presentCount = classStudents.filter(s => s.attendanceStatus === 'present' || !s.attendanceStatus).length;
  const absentCount = classStudents.filter(s => s.attendanceStatus === 'absent').length;
  const excusedCount = classStudents.filter(s => s.attendanceStatus === 'excused').length;

  const handleOpenAddModal = () => {
    playClickSound(soundEnabled);
    setEditingStudent(null);
    const nextStt = classStudents.length + 1;
    setStt(nextStt);
    setFullName('');
    setStudentCode(`TBH-${currentClass.name}-${String(nextStt).padStart(2, '0')}`);
    setGender('Nam');
    setBirthDate('15/04/2011');
    setGroup(`Tổ ${((nextStt - 1) % 4) + 1}`);
    setRole('Học sinh');
    setParentPhone('');
    setNotes('');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (student: ClassStudent) => {
    playClickSound(soundEnabled);
    setEditingStudent(student);
    setStt(student.stt);
    setFullName(student.fullName);
    setStudentCode(student.studentCode);
    setGender(student.gender);
    setBirthDate(student.birthDate || '15/04/2011');
    setGroup(student.group || 'Tổ 1');
    setRole(student.role || 'Học sinh');
    setParentPhone(student.parentPhone || '');
    setNotes(student.notes || '');
    setIsAddEditModalOpen(true);
  };

  const handleSubmitStudentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingStudent) {
      onEditStudent({
        ...editingStudent,
        stt: Number(stt) || editingStudent.stt,
        studentCode: studentCode.trim() || editingStudent.studentCode,
        fullName: fullName.trim(),
        gender,
        birthDate: birthDate.trim(),
        group,
        role: role.trim() || 'Học sinh',
        parentPhone: parentPhone.trim(),
        notes: notes.trim()
      });
      playSuccessChime(soundEnabled);
    } else {
      onAddStudent({
        classId: currentClass.id,
        stt: Number(stt) || classStudents.length + 1,
        studentCode: studentCode.trim() || `TBH-${currentClass.name}-${String(stt).padStart(2, '0')}`,
        fullName: fullName.trim(),
        gender,
        birthDate: birthDate.trim(),
        group,
        role: role.trim() || 'Học sinh',
        parentPhone: parentPhone.trim(),
        attendanceStatus: 'present',
        conduct: 'Tốt',
        notes: notes.trim()
      });
      playSuccessChime(soundEnabled);
    }

    setIsAddEditModalOpen(false);
  };

  const handleCopyRosterToClipboard = () => {
    playClickSound(soundEnabled);
    const header = `DANH SÁCH HỌC SINH LỚP ${currentClass.name} - TRƯỜNG THCS TĂNG BẠT HỔ\nGVCN: ${currentClass.homeroomTeacher}\nSĩ số: ${classStudents.length} học sinh\n\nSTT\tMã học sinh\tHọ và tên\tGiới tính\tNgày sinh\tTổ\tChức vụ\tSĐT Phụ huynh\n`;
    const rows = classStudents
      .sort((a, b) => a.stt - b.stt)
      .map(s => `${s.stt}\t${s.studentCode}\t${s.fullName}\t${s.gender}\t${s.birthDate || ''}\t${s.group || ''}\t${s.role || 'Học sinh'}\t${s.parentPhone || ''}`)
      .join('\n');

    navigator.clipboard.writeText(header + rows);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleExportExcel = () => {
    playToggleSound(soundEnabled);
    const exportData = [
      ['TRƯỜNG THCS TĂNG BẠT HỔ', '', '', '', '', '', '', '', ''],
      [`DANH SÁCH HỌC SINH LỚP ${currentClass.name} - NĂM HỌC ${currentClass.academicYear}`, '', '', '', '', '', '', '', ''],
      [`GVCN: ${currentClass.homeroomTeacher} - Phòng học: ${currentClass.room}`, '', '', '', '', '', '', '', ''],
      ['STT', 'Mã học sinh', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Phân tổ', 'Chức vụ', 'SĐT Phụ huynh', 'Điểm danh', 'Ghi chú'],
      ...classStudents.sort((a, b) => a.stt - b.stt).map(s => [
        s.stt,
        s.studentCode,
        s.fullName,
        s.gender,
        s.birthDate || '',
        s.group || '',
        s.role || 'Học sinh',
        s.parentPhone || '',
        s.attendanceStatus === 'present' ? 'Có mặt' : s.attendanceStatus === 'excused' ? 'Có phép' : 'Vắng',
        s.notes || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 24 },
      { wch: 10 },
      { wch: 14 },
      { wch: 10 },
      { wch: 18 },
      { wch: 16 },
      { wch: 14 },
      { wch: 22 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Lop_${currentClass.name}`);
    XLSX.writeFile(wb, `Danh_Sach_Hoc_Sinh_Lop_${currentClass.name}_THCS_TangBatHo.xlsx`);
  };

  const handleMarkAllPresent = () => {
    playSuccessChime(soundEnabled);
    classStudents.forEach(s => {
      onUpdateAttendance(s.id, 'present');
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-blue-100">
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>Trường THCS Tăng Bạt Hổ • Năm học {currentClass.academicYear}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <span>Danh Sách Học Sinh Lớp {currentClass.name}</span>
              <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Sĩ số: {totalCount} học sinh
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 flex flex-wrap items-center gap-3">
              <span>GVCN: <strong className="text-white">{currentClass.homeroomTeacher}</strong></span>
              <span>•</span>
              <span>Phòng học: <strong className="text-white">{currentClass.room}</strong></span>
              <span>•</span>
              <span className="text-blue-200">{currentClass.description || 'Lớp trọng điểm, phong trào học tập tốt'}</span>
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-400/20 transition-all cursor-pointer hover:scale-102"
              title="Nhập danh sách học sinh từ file Excel (.xlsx, .xls, .csv)"
            >
              <FileUp className="w-4 h-4 text-slate-950" />
              <span>Nhập file Excel / CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              title="Xuất danh sách học sinh ra file Excel (.xlsx)"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Xuất Excel</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-700" />
              <span>Thêm học sinh</span>
            </button>

            <button
              type="button"
              onClick={handleCopyRosterToClipboard}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              title="Sao chép toàn bộ danh sách lớp vào clipboard"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-blue-200" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statistical Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng sĩ số lớp</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{totalCount}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{maleCount} Nam • {femaleCount} Nữ</p>
        </div>

        {/* Gender breakdown */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỉ lệ Giới tính</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs font-bold">
            <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              Nam: {maleCount} ({totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0}%)
            </span>
            <span className="text-pink-700 bg-pink-50 px-2 py-1 rounded-md border border-pink-200">
              Nữ: {femaleCount} ({totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Cơ cấu học sinh đồng đều</p>
        </div>

        {/* Class Cadres (Ban cán sự) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Ban cán sự lớp</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{cadresCount}</span>
            <span className="text-xs text-amber-700/80 font-medium">bạn phụ trách</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Lớp trưởng, phó, tổ trưởng</p>
        </div>

        {/* Attendance status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Chuyên cần hôm nay</span>
            <button
              type="button"
              onClick={handleMarkAllPresent}
              title="Điểm danh tất cả có mặt"
              className="text-[10px] text-blue-700 hover:text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
            >
              Điểm danh tất cả
            </button>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{presentCount}</span>
            <span className="text-xs text-emerald-600/80 font-medium">/{totalCount} có mặt</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {absentCount > 0 ? <span className="text-rose-600 font-semibold">{absentCount} vắng</span> : 'Đầy đủ'}
            {excusedCount > 0 && <span className="text-amber-600 font-semibold"> • {excusedCount} có phép</span>}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Tool Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã số, SĐT..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          {/* Gender Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                genderFilter === 'all' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('Nam')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                genderFilter === 'Nam' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nam ({maleCount})
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('Nữ')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                genderFilter === 'Nữ' ? 'bg-white text-pink-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nữ ({femaleCount})
            </button>
          </div>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Tất cả các tổ</option>
            <option value="Tổ 1">Tổ 1</option>
            <option value="Tổ 2">Tổ 2</option>
            <option value="Tổ 3">Tổ 3</option>
            <option value="Tổ 4">Tổ 4</option>
          </select>

          {/* Cadres Filter */}
          <button
            type="button"
            onClick={() => setRoleFilter(roleFilter === 'all' ? 'cadres' : 'all')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
              roleFilter === 'cadres'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ban cán sự ({cadresCount})</span>
          </button>
        </div>
      </div>

      {/* 4. Student Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-3 w-28">Mã học sinh</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-3 w-20 text-center">Giới tính</th>
                <th className="py-3 px-3 w-24">Ngày sinh</th>
                <th className="py-3 px-3 w-20 text-center">Tổ</th>
                <th className="py-3 px-3 w-36">Chức vụ</th>
                <th className="py-3 px-3 w-32">SĐT Phụ huynh</th>
                <th className="py-3 px-3 w-32 text-center">Điểm danh</th>
                <th className="py-3 px-3 w-20 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Không tìm thấy học sinh nào</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Thử thay đổi bộ lọc hoặc bấm nút &quot;Nhập danh sách&quot; để thêm học sinh cho lớp 8A1
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isCadre = student.role && student.role !== 'Học sinh';

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* STT */}
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        {student.stt}
                      </td>

                      {/* Student Code */}
                      <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                        {student.studentCode}
                      </td>

                      {/* Full Name & Avatar Initial */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            student.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {student.fullName.split(' ').pop()?.charAt(0) || 'H'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs sm:text-sm">
                              {student.fullName}
                            </div>
                            {student.notes && (
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {student.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.gender === 'Nữ'
                            ? 'bg-pink-50 text-pink-700 border border-pink-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {student.gender}
                        </span>
                      </td>

                      {/* Birthdate */}
                      <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {student.birthDate || '15/04/2011'}
                      </td>

                      {/* Group */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {student.group || 'Tổ 1'}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        {isCadre ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>{student.role}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Học sinh</span>
                        )}
                      </td>

                      {/* Parent Phone */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {student.parentPhone ? (
                          <a
                            href={`tel:${student.parentPhone}`}
                            className="hover:text-blue-700 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{student.parentPhone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300">Chưa có</span>
                        )}
                      </td>

                      {/* Attendance Quick Toggle */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => onUpdateAttendance(student.id, 'present')}
                            title="Có mặt"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                              student.attendanceStatus === 'present' || !student.attendanceStatus
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'text-slate-500 hover:text-emerald-700'
                            }`}
                          >
                            Có mặt
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateAttendance(student.id, 'absent')}
                            title="Vắng mặt"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                              student.attendanceStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'text-slate-500 hover:text-rose-700'
                            }`}
                          >
                            Vắng
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateAttendance(student.id, 'excused')}
                            title="Có phép"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                              student.attendanceStatus === 'excused'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'text-slate-500 hover:text-amber-700'
                            }`}
                          >
                            Phép
                          </button>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(student)}
                            title="Chỉnh sửa thông tin học sinh"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setStudentToDelete(student)}
                            title="Xóa học sinh khỏi lớp"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <strong>{filteredStudents.length}</strong> / <strong>{totalCount}</strong> học sinh Lớp {currentClass.name}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
            >
              + Thêm học sinh lẻ
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="text-amber-700 hover:text-amber-800 font-semibold hover:underline"
            >
              Nhập danh sách hàng loạt (Excel)
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: Import Students */}
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        className={currentClass.name}
        classId={currentClass.id}
        currentStudentCount={classStudents.length}
        onImportStudents={onImportStudents}
        soundEnabled={soundEnabled}
      />

      {/* Modal 2: Add / Edit Single Student */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>{editingStudent ? `Chỉnh sửa học sinh: ${editingStudent.fullName}` : `Thêm học sinh mới vào Lớp ${currentClass.name}`}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStudentForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">STT</label>
                  <input
                    type="number"
                    value={stt}
                    onChange={(e) => setStt(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-center"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Mã học sinh</label>
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-semibold"
                    placeholder="VD: TBH-8A1-01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-sm"
                  placeholder="VD: Nguyễn Văn An"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="VD: 15/04/2011"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân tổ</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Tổ 1">Tổ 1</option>
                    <option value="Tổ 2">Tổ 2</option>
                    <option value="Tổ 3">Tổ 3</option>
                    <option value="Tổ 4">Tổ 4</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức vụ trong lớp</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="VD: Lớp trưởng, Tổ trưởng, Học sinh"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại phụ huynh</label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  placeholder="VD: 0912.345.678"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú rèn luyện</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="VD: Năng nổ, đội tuyển Toán, cần kèm thêm Tiếng Anh..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Lưu cập nhật' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Confirmation */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Xóa học sinh khỏi lớp?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa học sinh <strong>{studentToDelete.fullName}</strong> ({studentToDelete.studentCode}) khỏi danh sách Lớp {currentClass.name}?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
