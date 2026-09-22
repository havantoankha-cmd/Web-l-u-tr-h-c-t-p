/**
 * Định nghĩa kiểu dữ liệu cho Cổng Quản Trị Học Tập THCS Tăng Bạt Hổ
 * Đơn vị: Trường THCS Tăng Bạt Hổ - Giáo viên: Thầy Hà Văn Toàn
 */

export type AssignmentStatus = 'chua_lam' | 'dang_lam' | 'da_hoan_thanh' | 'qua_han';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string; // YYYY-MM-DD or readable string
  deadlineTime?: string; // HH:mm
  status: AssignmentStatus;
  priority: 'binh_thuong' | 'quan_trong' | 'khan_cap';
  description: string;
  teacherNote?: string;
  maxScore?: number;
  completedAt?: string;
}

export interface ScheduleItem {
  id: string;
  period: number; // Tiết 1, 2, 3, 4, 5...
  timeRange: string; // "07:15 - 08:00"
  subject: string;
  teacher: string;
  room: string;
  topic: string; // Tên bài học
  preparationNote?: string; // Lưu ý chuẩn bị đồ dùng, bài cũ
}

export interface DaySchedule {
  dayId: string; // 't2', 't3', 't4', 't5', 't6', 't7'
  dayName: string; // 'Thứ Hai', 'Thứ Ba', ...
  shortName: string; // 'T2', 'T3', ...
  items: ScheduleItem[];
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  iconName: string;
  description: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. '8A1', '8A2', '9A1'
  grade: string; // e.g. 'Khối 8'
  room: string; // e.g. 'Phòng 204'
  homeroomTeacher: string; // e.g. 'Thầy Hà Văn Toàn'
  totalStudents: number; // e.g. 42
  academicYear: string; // e.g. '2024 - 2025'
  description?: string;
  createdAt?: string;
}

export interface ClassStudent {
  id: string;
  classId: string; // e.g. 'cls-8a1' or '8A1'
  stt: number; // Số thứ tự: 1, 2, 3...
  studentCode: string; // e.g. 'TBH-8A1-01'
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate?: string; // e.g. '15/04/2011'
  group?: string; // e.g. 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'
  role?: string; // 'Lớp trưởng', 'Lớp phó học tập', 'Lớp phó lao động', 'Tổ trưởng', 'Học sinh'
  parentPhone?: string; // SĐT phụ huynh liên lạc
  attendanceStatus?: 'present' | 'absent' | 'excused'; // 'Có mặt' | 'Vắng' | 'Có phép'
  conduct?: 'Tốt' | 'Khá' | 'Đạt';
  notes?: string;
}

export interface StudentProfile {
  fullName: string;
  studentId: string;
  className: string;
  schoolName: string;
  teacherName: string;
  academicYear: string;
  birthDate: string;
  avatarColor: string;
  studyMotto: string;
  goals: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  achievements: Achievement[];
}

export type ActiveTab = 'overview' | 'assignments' | 'schedule' | 'students' | 'progress' | 'profile';
