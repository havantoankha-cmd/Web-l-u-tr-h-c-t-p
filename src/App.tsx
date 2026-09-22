/**
 * CỔNG QUẢN TRỊ HỌC TẬP THCS TĂNG BẠT HỔ
 * Ứng dụng quản trị học tập dành cho học sinh THCS và Giáo viên
 * Phụ trách: Thầy Hà Văn Toàn - Trường THCS Tăng Bạt Hổ
 */

import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Assignment, 
  AssignmentStatus, 
  DaySchedule, 
  ScheduleItem, 
  StudentProfile,
  SchoolClass,
  ClassStudent
} from './types';
import { 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SCHEDULE, 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_CLASSES,
  INITIAL_STUDENTS_8A1,
  STORAGE_KEYS 
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewView } from './components/OverviewView';
import { AssignmentsView } from './components/AssignmentsView';
import { ScheduleView } from './components/ScheduleView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { ClassManagerModal } from './components/ClassManagerModal';
import { ClassRosterView } from './components/ClassRosterView';
import { 
  CheckCircle2, 
  RotateCcw, 
  Home, 
  BookOpen, 
  CalendarDays, 
  BarChart3, 
  UserCircle,
  X,
  Volume2
} from 'lucide-react';
import { playClickSound, playSuccessChime, playToggleSound } from './utils/sound';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Sound State (Off by default as required by prompt)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Presentation / Fullscreen Mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Core Data States with localStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CLASS_ID);
      return saved || (INITIAL_CLASSES[0]?.id || 'cls_8a1');
    } catch {
      return INITIAL_CLASSES[0]?.id || 'cls_8a1';
    }
  });

  const [students, setStudents] = useState<ClassStudent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS_8A1;
    } catch {
      return INITIAL_STUDENTS_8A1;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  // Modal / Detail state
  const [selectedAssignmentForDetail, setSelectedAssignmentForDetail] = useState<Assignment | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3200);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // Storage fallback
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch {
      // Storage fallback
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch {
      // Storage fallback
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch {
      // Storage fallback
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {
      // Storage fallback
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CLASS_ID, selectedClassId);
    } catch {
      // Storage fallback
    }
  }, [selectedClassId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
    } catch {
      // Storage fallback
    }
  }, [soundEnabled]);

  // Handler: Toggle sound
  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
    showToast(!soundEnabled ? '🔔 Đã bật âm thanh tương tác' : '🔕 Đã tắt âm thanh');
  };

  // Handler: Fullscreen presentation
  const handleToggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    showToast(!isFullscreen ? '📺 Đã bật chế độ Trình chiếu lớp học' : 'Đã trở lại chế độ xem thường');
  };

  // Handler: Toggle assignment status (Quick check)
  const handleToggleAssignmentStatus = (id: string) => {
    setAssignments(prev => prev.map(item => {
      if (item.id === id) {
        const isDone = item.status === 'da_hoan_thanh';
        const newStatus: AssignmentStatus = isDone ? 'chua_lam' : 'da_hoan_thanh';
        const updatedItem = {
          ...item,
          status: newStatus,
          completedAt: newStatus === 'da_hoan_thanh' ? new Date().toISOString() : undefined
        };

        if (newStatus === 'da_hoan_thanh') {
          showToast(`🎉 Tuyệt vời! Em đã hoàn thành "${item.title}"`);
        } else {
          showToast(`Đã chuyển bài "${item.title}" về Chưa làm`);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  // Handler: Specific update status
  const handleUpdateAssignmentStatus = (id: string, newStatus: AssignmentStatus) => {
    setAssignments(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          completedAt: newStatus === 'da_hoan_thanh' ? new Date().toISOString() : undefined
        };
      }
      return item;
    }));
    showToast('Đã cập nhật trạng thái bài tập!');
  };

  // Handler: Add assignment
  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const item: Assignment = {
      ...newAssignment,
      id: `bt-${Date.now()}`
    };
    setAssignments(prev => [item, ...prev]);
    showToast(`Đã thêm bài tập mới: ${item.title}`);
  };

  // Handler: Edit assignment
  const handleEditAssignment = (updated: Assignment) => {
    setAssignments(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast('Đã lưu nội dung bài tập!');
  };

  // Handler: Delete assignment
  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(item => item.id !== id));
    showToast('Đã xóa bài tập');
  };

  // Handler: Update Schedule Item
  const handleUpdateScheduleItem = (dayId: string, updatedItem: ScheduleItem) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayId === dayId) {
        return {
          ...day,
          items: day.items.map(it => it.id === updatedItem.id ? updatedItem : it)
        };
      }
      return day;
    }));
    showToast(`Đã cập nhật tiết ${updatedItem.period}: ${updatedItem.subject}`);
  };

  // Handler: Add Schedule Item (Period)
  const handleAddScheduleItem = (dayId: string, item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch_${Date.now()}`
    };
    setSchedule(prev => prev.map(day => {
      if (day.dayId === dayId) {
        const updatedItems = [...day.items, newItem].sort((a, b) => a.period - b.period);
        return {
          ...day,
          items: updatedItems
        };
      }
      return day;
    }));
    showToast(`Đã thêm tiết ${newItem.period}: ${newItem.subject} vào ${schedule.find(d => d.dayId === dayId)?.dayName || 'TKB'}`);
  };

  // Handler: Delete Schedule Item (Period)
  const handleDeleteScheduleItem = (dayId: string, itemId: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.dayId === dayId) {
        return {
          ...day,
          items: day.items.filter(it => it.id !== itemId)
        };
      }
      return day;
    }));
    showToast('Đã xóa tiết học khỏi thời khóa biểu');
  };

  // Handler: Update Profile
  const handleUpdateProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    showToast('Đã cập nhật hồ sơ học sinh thành công!');
  };

  // Handler: Select Class
  const handleSelectClass = (classId: string) => {
    const target = classes.find(c => c.id === classId);
    if (!target) return;
    setSelectedClassId(classId);
    setProfile(prev => ({
      ...prev,
      className: target.name,
      teacherName: target.homeroomTeacher || prev.teacherName
    }));
    showToast(`Đã chuyển sang quản lý lớp ${target.name}`);
  };

  // Handler: Add New Class
  const handleAddClass = (newClassData: Omit<SchoolClass, 'id'>, setActiveImmediately: boolean) => {
    const newClass: SchoolClass = {
      ...newClassData,
      id: `cls_${Date.now()}`
    };
    setClasses(prev => [...prev, newClass]);
    if (setActiveImmediately) {
      setSelectedClassId(newClass.id);
      setProfile(prev => ({
        ...prev,
        className: newClass.name,
        teacherName: newClass.homeroomTeacher || prev.teacherName
      }));
    }
    showToast(`Đã thêm thành công lớp ${newClass.name}!`);
  };

  // Handler: Update Class
  const handleUpdateClass = (updatedClass: SchoolClass) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    if (selectedClassId === updatedClass.id) {
      setProfile(prev => ({
        ...prev,
        className: updatedClass.name,
        teacherName: updatedClass.homeroomTeacher || prev.teacherName
      }));
    }
    showToast(`Đã cập nhật thông tin lớp ${updatedClass.name}`);
  };

  // Handler: Delete Class
  const handleDeleteClass = (classId: string) => {
    if (classes.length <= 1) {
      showToast('Cần giữ lại ít nhất một lớp học trong hệ thống!');
      return;
    }
    const remaining = classes.filter(c => c.id !== classId);
    setClasses(remaining);
    if (selectedClassId === classId) {
      const nextClass = remaining[0];
      setSelectedClassId(nextClass.id);
      setProfile(prev => ({
        ...prev,
        className: nextClass.name,
        teacherName: nextClass.homeroomTeacher || prev.teacherName
      }));
    }
    showToast('Đã xóa lớp học khỏi hệ thống');
  };

  // Handler: Add Single Student
  const handleAddStudent = (newStudent: Omit<ClassStudent, 'id'>) => {
    const student: ClassStudent = {
      ...newStudent,
      id: `stu_${Date.now()}`
    };
    setStudents(prev => [...prev, student]);
    setClasses(prev => prev.map(c => c.id === student.classId ? { ...c, totalStudents: c.totalStudents + 1 } : c));
    showToast(`Đã thêm học sinh "${student.fullName}" vào lớp!`);
  };

  // Handler: Edit Single Student
  const handleEditStudent = (updatedStudent: ClassStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    showToast(`Đã cập nhật thông tin học sinh "${updatedStudent.fullName}"`);
  };

  // Handler: Delete Single Student
  const handleDeleteStudent = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (target) {
      setClasses(prev => prev.map(c => c.id === target.classId ? { ...c, totalStudents: Math.max(0, c.totalStudents - 1) } : c));
    }
    showToast('Đã xóa học sinh khỏi danh sách lớp');
  };

  // Handler: Import Students Roster (Excel / Delimited Text)
  const handleImportStudents = (parsedStudents: ClassStudent[], mode: 'replace' | 'append') => {
    setStudents(prev => {
      let updated: ClassStudent[];
      if (mode === 'replace') {
        const otherClassStudents = prev.filter(s => s.classId !== selectedClassId);
        updated = [...otherClassStudents, ...parsedStudents];
      } else {
        updated = [...prev, ...parsedStudents];
      }
      return updated;
    });

    const targetClass = classes.find(c => c.id === selectedClassId) || classes[0];
    const currentClassCount = students.filter(s => s.classId === selectedClassId).length;
    const newCount = mode === 'replace' ? parsedStudents.length : (currentClassCount + parsedStudents.length);

    setClasses(prev => prev.map(c => c.id === selectedClassId ? { ...c, totalStudents: newCount } : c));
    showToast(`Đã nhập thành công ${parsedStudents.length} học sinh cho Lớp ${targetClass?.name || '8A1'}!`);
  };

  // Handler: Update student attendance status
  const handleUpdateAttendance = (studentId: string, status: 'present' | 'absent' | 'excused') => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s));
  };

  // Handler: Reset to Teacher defaults
  const handleConfirmReset = () => {
    setProfile(INITIAL_STUDENT_PROFILE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSchedule(INITIAL_SCHEDULE);
    setClasses(INITIAL_CLASSES);
    setSelectedClassId(INITIAL_CLASSES[0]?.id || 'cls_8a1');
    setStudents(INITIAL_STUDENTS_8A1);
    setIsResetModalOpen(false);
    playSuccessChime(soundEnabled);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu của Thầy Hà Văn Toàn!');
  };

  // Count pending assignments for badge
  const pendingCount = assignments.filter(a => a.status === 'chua_lam' || a.status === 'dang_lam').length;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${isFullscreen ? 'text-base sm:text-lg' : ''}`}>
      {/* 1. Header */}
      <Header
        profile={profile}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetData={() => setIsResetModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onSelectProfileTab={() => setActiveTab('profile')}
        onOpenClassModal={() => setIsClassModalOpen(true)}
      />

      {/* 2. Navigation Bar (5 Core Features) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        pendingAssignmentsCount={pendingCount}
        soundEnabled={soundEnabled}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <OverviewView
            profile={profile}
            assignments={assignments}
            schedule={schedule}
            onToggleAssignmentStatus={handleToggleAssignmentStatus}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectAssignmentForDetail={(a) => setSelectedAssignmentForDetail(a)}
            onOpenClassModal={() => setIsClassModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={assignments}
            onToggleStatus={handleToggleAssignmentStatus}
            onUpdateStatus={handleUpdateAssignmentStatus}
            onAddAssignment={handleAddAssignment}
            onEditAssignment={handleEditAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            selectedAssignmentForDetail={selectedAssignmentForDetail}
            onSelectAssignmentForDetail={(a) => setSelectedAssignmentForDetail(a)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            schedule={schedule}
            onUpdateScheduleItem={handleUpdateScheduleItem}
            onAddScheduleItem={handleAddScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
            currentClassName={selectedClass?.name || profile.className}
            onOpenClassManager={() => setIsClassModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'students' && (
          <ClassRosterView
            currentClass={selectedClass || classes[0]}
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onImportStudents={handleImportStudents}
            onUpdateAttendance={handleUpdateAttendance}
            onOpenClassManager={() => setIsClassModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            assignments={assignments}
            onNavigateTab={(tab) => setActiveTab(tab)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenClassModal={() => setIsClassModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* 4. Quick Return to Overview / Home Floating Button (When not on overview) */}
      {activeTab !== 'overview' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('overview');
            }}
            className="flex items-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-blue-700/30 border border-blue-600 transition-all hover:scale-105 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Trang Tổng quan</span>
          </button>
        </div>
      )}

      {/* 5. Educational Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CỔNG QUẢN TRỊ HỌC TẬP</span>
            <span>•</span>
            <span>Trường THCS Tăng Bạt Hổ</span>
          </div>

          <div>
            Phụ trách học tập & Quản lý: <strong className="text-slate-700">Thầy Hà Văn Toàn</strong>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Phiên bản 1.0 (Giáo dục THCS)</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 font-medium"
            >
              Lên đầu trang ↑
            </button>
          </div>
        </div>
      </footer>

      {/* 6. Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-semibold backdrop-blur-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 7. Modal Xác nhận khôi phục dữ liệu mẫu */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Khôi phục dữ liệu mẫu ban đầu?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Thao tác này sẽ đặt lại bài tập, thời khóa biểu và hồ sơ học sinh về dữ liệu mẫu chuẩn của <strong>Thầy Hà Văn Toàn - Lớp 8A1</strong>.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  playToggleSound(soundEnabled);
                  setIsResetModalOpen(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Đồng ý khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Quản lý và Thêm Lớp học */}
      <ClassManagerModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        classes={classes}
        selectedClassId={selectedClassId}
        onSelectClass={handleSelectClass}
        onAddClass={handleAddClass}
        onEditClass={handleUpdateClass}
        onDeleteClass={handleDeleteClass}
        onOpenRoster={(clsId) => {
          setSelectedClassId(clsId);
          setActiveTab('students');
        }}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
