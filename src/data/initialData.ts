/**
 * ============================================================================
 * DỮ LIỆU MẪU - CỔNG QUẢN TRỊ HỌC TẬP THCS TĂNG BẠT HỔ
 * Người phụ trách / Giáo viên: Thầy HÀ VĂN TOÀN
 * Đơn vị: Trường THCS Tăng Bạt Hổ
 * 
 * HƯỚNG DẪN DÀNH CHO GIÁO VIÊN:
 * Thầy cô có thể dễ dàng thay đổi thông tin học sinh, danh sách môn học,
 * lịch học từng tiết và các bài tập tại các khối dữ liệu dưới đây.
 * ============================================================================
 */

import { Assignment, DaySchedule, StudentProfile, SchoolClass, ClassStudent } from '../types';

/**
 * 1. THÔNG TIN HỒ SƠ HỌC SINH MẪU
 */
export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: 'Nguyễn Văn An',
  studentId: 'TBH-2024-8A1-02',
  className: '8A1',
  schoolName: 'Trường THCS Tăng Bạt Hổ',
  teacherName: 'Hà Văn Toàn',
  academicYear: 'Năm học 2024 - 2025',
  birthDate: '15/04/2011',
  avatarColor: 'from-blue-600 to-indigo-700',
  studyMotto: 'Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.',
  goals: [
    { id: 'g1', text: 'Hoàn thành 100% bài tập về nhà đúng thời hạn hàng tuần', completed: true },
    { id: 'g2', text: 'Nâng điểm trung bình môn Tiếng Anh và Toán lên trên 8.5', completed: false },
    { id: 'g3', text: 'Tích cực chuẩn bị bài Khoa học Tự nhiên trước khi lên lớp', completed: true },
    { id: 'g4', text: 'Tham gia sôi nổi vào Câu lạc bộ Tin học & STEM của trường', completed: false },
    { id: 'g5', text: 'Ôn tập tốt chuẩn bị cho kỳ kiểm tra giữa học kỳ', completed: false }
  ],
  achievements: [
    {
      id: 'a1',
      title: 'Chiến Binh Chuyên Cần',
      category: 'Khen thưởng chuyên cần',
      date: 'Tháng 09/2024',
      iconName: 'Award',
      description: 'Hoàn thành 15 nhiệm vụ học tập liên tục không trễ hạn.'
    },
    {
      id: 'a2',
      title: 'Sao Sáng Môn Tin Học',
      category: 'Học tập bộ môn',
      date: 'Tháng 10/2024',
      iconName: 'Sparkles',
      description: 'Đạt điểm tối đa bài thực hành Lập trình khối & giải thuật cơ bản.'
    },
    {
      id: 'a3',
      title: 'Tinh Thần Học Hỏi Tích Cực',
      category: 'Thái độ học tập',
      date: 'Tháng 11/2024',
      iconName: 'ThumbsUp',
      description: 'Được Thầy Hà Văn Toàn khen ngợi về tinh thần phát biểu trong giờ học.'
    }
  ]
};

/**
 * 2. DANH SÁCH CÁC MÔN HỌC CHÍNH (THCS)
 */
export const SUBJECT_OPTIONS = [
  'Tất cả',
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Khoa học Tự nhiên',
  'Tin học',
  'Lịch sử & Địa lý',
  'Giáo dục công dân',
  'Công nghệ',
  'Giáo dục thể chất'
];

/**
 * Màu sắc nhận diện đại diện cho từng môn học
 */
export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  'Toán học': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  'Ngữ văn': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
  'Tiếng Anh': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
  'Khoa học Tự nhiên': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-800' },
  'Tin học': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-800' },
  'Lịch sử & Địa lý': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' },
  'Giáo dục công dân': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
  'Công nghệ': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
  'Giáo dục thể chất': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', badge: 'bg-lime-100 text-lime-800' },
  'Mặc định': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-800' }
};

/**
 * 3. DANH SÁCH BÀI TẬP / NHIỆM VỤ HỌC TẬP MẪU
 */
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'bt-01',
    title: 'Giải bài tập Đơn thức và Đa thức (Bài 1 -> 5 SGK trang 18)',
    subject: 'Toán học',
    deadline: '2026-09-23',
    deadlineTime: '21:00',
    status: 'dang_lam',
    priority: 'quan_trong',
    description: 'Thực hiện phép tính thu gọn đa thức nhiều biến, tìm bậc của đa thức và tính giá trị của đa thức tại x = 1, y = -2.',
    teacherNote: 'Thầy Hà Văn Toàn lưu ý các em chú ý dấu trừ trước ngoặc khi đổi dấu.',
    maxScore: 10
  },
  {
    id: 'bt-02',
    title: 'Soạn bài: Lão Hạc - Nhà văn Nam Cao',
    subject: 'Ngữ văn',
    deadline: '2026-09-24',
    deadlineTime: '17:00',
    status: 'chua_lam',
    priority: 'binh_thuong',
    description: 'Đọc kỹ văn bản, trả lời các câu hỏi phần Đọc hiểu trong SGK. Viết đoạn văn ngắn 5-7 câu nêu cảm nghĩ về nhân vật Lão Hạc.',
    teacherNote: 'Chuẩn bị kỹ để thảo luận nhóm trên lớp.',
    maxScore: 10
  },
  {
    id: 'bt-03',
    title: 'Unit 2: Life in the Countryside - Vocabulary & Grammar Practice',
    subject: 'Tiếng Anh',
    deadline: '2026-09-22',
    deadlineTime: '20:00',
    status: 'chua_lam',
    priority: 'khan_cap',
    description: 'Hoàn thành bài tập so sánh hơn của trạng từ (comparative adverbs) và học thuộc 15 từ vựng về chủ đề nông thôn.',
    teacherNote: 'Hạn chót tối nay! Các em nộp ảnh chụp vở bài tập hoặc làm trên link Google Forms của cô.',
    maxScore: 10
  },
  {
    id: 'bt-04',
    title: 'Báo cáo thực hành: Phản ứng hóa học và Định luật bảo toàn khối lượng',
    subject: 'Khoa học Tự nhiên',
    deadline: '2026-09-20',
    deadlineTime: '18:00',
    status: 'da_hoan_thanh',
    priority: 'quan_trong',
    description: 'Ghi chép hiện tượng thí nghiệm giữa dung dịch Bari clorua và Natri sunfat. Viết phương trình chữ và giải thích kết quả cân khối lượng.',
    teacherNote: 'Bài nộp chất lượng, chữ viết rõ ràng, trình bày mạch lạc. Đạt 9.5/10 điểm.',
    maxScore: 10,
    completedAt: '2026-09-20 16:30'
  },
  {
    id: 'bt-05',
    title: 'Thực hành Lập trình Scratch: Mô phỏng bài toán cộng trừ số nguyên',
    subject: 'Tin học',
    deadline: '2026-09-25',
    deadlineTime: '16:00',
    status: 'dang_lam',
    priority: 'binh_thuong',
    description: 'Tạo nhân vật hỏi đáp, sử dụng biến số để lưu điểm và biến kết quả, có vòng lặp kiểm tra đáp án đúng/sai.',
    teacherNote: 'Thầy Toàn sẽ hỗ trợ sửa lỗi thuật toán vào tiết thực hành phòng máy thứ 5.',
    maxScore: 10
  },
  {
    id: 'bt-06',
    title: 'Vẽ sơ đồ tư duy: Cuộc kháng chiến chống thực dân Pháp (1858-1884)',
    subject: 'Lịch sử & Địa lý',
    deadline: '2026-09-26',
    deadlineTime: '12:00',
    status: 'chua_lam',
    priority: 'binh_thuong',
    description: 'Tóm tắt các mốc sự kiện chính qua các hiệp ước: Nhâm Tuất (1862), Giáp Tuất (1874), Hác-măng (1883) và Pa-tơ-nốt (1884).',
    teacherNote: 'Khuyến khích dùng bút màu và hình minh họa để dễ ghi nhớ.',
    maxScore: 10
  },
  {
    id: 'bt-07',
    title: 'Tìm hiểu gương người tốt việc tốt về đức tính Liêm khiết quanh em',
    subject: 'Giáo dục công dân',
    deadline: '2026-09-18',
    deadlineTime: '17:00',
    status: 'da_hoan_thanh',
    priority: 'binh_thuong',
    description: 'Viết bài thu hoạch 1 trang giấy về tấm gương giữ gìn đức tính liêm khiết trong học đường hoặc địa phương.',
    teacherNote: 'Đã hoàn thành đúng hạn. Đạt 9.0 điểm.',
    maxScore: 10,
    completedAt: '2026-09-17 19:45'
  },
  {
    id: 'bt-08',
    title: 'Bài tập ôn tập Hình học: Định lý Pythagore và ứng dụng thực tế',
    subject: 'Toán học',
    deadline: '2026-09-15',
    deadlineTime: '21:00',
    status: 'qua_han',
    priority: 'quan_trong',
    description: 'Giải các bài tập tính độ dài cạnh huyền trong tam giác vuông và bài toán tính chiều cao cây thông bằng bóng nắng.',
    teacherNote: 'Bài tập này em chưa nộp. Cần hoàn thành bổ sung sớm để Thầy Toàn kiểm tra!',
    maxScore: 10
  }
];

/**
 * 4. THỜI KHÓA BIỂU HỌC TẬP THEO TUẦN (LỚP 8A1 - THCS TĂNG BẠT HỔ)
 */
export const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    dayId: 't2',
    dayName: 'Thứ Hai',
    shortName: 'T2',
    items: [
      { id: 's-t2-1', period: 1, timeRange: '07:15 - 08:00', subject: 'Chào cờ & HĐTN', teacher: 'Thầy Hà Văn Toàn (GVCN)', room: 'Sân trường', topic: 'Sinh hoạt dưới cờ đầu tuần: An toàn giao thông', preparationNote: 'Mặc đồng phục đúng quy định, đeo khăn quàng' },
      { id: 's-t2-2', period: 2, timeRange: '08:05 - 08:50', subject: 'Toán học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng 204', topic: 'Đại số: Phép cộng trừ đa thức nhiều biến', preparationNote: 'Mang theo SGK, vở bài tập và máy tính bỏ túi' },
      { id: 's-t2-3', period: 3, timeRange: '09:05 - 09:50', subject: 'Ngữ văn', teacher: 'Cô Trần Thị Mai', room: 'Phòng 204', topic: 'Văn bản: Lão Hạc (Tiết 1)', preparationNote: 'Đọc trước truyện ngắn và trả lời câu hỏi bài cũ' },
      { id: 's-t2-4', period: 4, timeRange: '09:55 - 10:40', subject: 'Tiếng Anh', teacher: 'Cô Nguyễn Hoàng Lan', room: 'Phòng Lab 1', topic: 'Unit 2: Getting Started & Vocabulary', preparationNote: 'Học thuộc từ mới Unit 1' },
      { id: 's-t2-5', period: 5, timeRange: '10:45 - 11:30', subject: 'Giáo dục thể chất', teacher: 'Thầy Lê Văn Hùng', room: 'Nhà đa năng', topic: 'Chạy cự ly ngắn & Thể dục nhịp điệu', preparationNote: 'Mang giày thể thao và nước uống' }
    ]
  },
  {
    dayId: 't3',
    dayName: 'Thứ Ba',
    shortName: 'T3',
    items: [
      { id: 's-t3-1', period: 1, timeRange: '07:15 - 08:00', subject: 'Khoa học Tự nhiên', teacher: 'Cô Phạm Thị Thu', room: 'Phòng thí nghiệm KHTN', topic: 'Hóa học: Tốc độ phản ứng & chất xúc tác', preparationNote: 'Đọc kỹ quy tắc an toàn phòng thí nghiệm' },
      { id: 's-t3-2', period: 2, timeRange: '08:05 - 08:50', subject: 'Khoa học Tự nhiên', teacher: 'Cô Phạm Thị Thu', room: 'Phòng thí nghiệm KHTN', topic: 'Thực hành: Khảo sát ảnh hưởng của nhiệt độ', preparationNote: 'Làm việc theo nhóm 4 bạn' },
      { id: 's-t3-3', period: 3, timeRange: '09:05 - 09:50', subject: 'Tin học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng máy số 2', topic: 'Lập trình thuật toán điều kiện trong Scratch', preparationNote: 'Lưu bài vào thư mục cá nhân máy tính' },
      { id: 's-t3-4', period: 4, timeRange: '09:55 - 10:40', subject: 'Lịch sử & Địa lý', teacher: 'Thầy Đỗ Văn Minh', room: 'Phòng 204', topic: 'Lịch sử: Phong trào Cần Vương cuối thế kỷ XIX', preparationNote: 'Chuẩn bị lược đồ tư liệu' },
      { id: 's-t3-5', period: 5, timeRange: '10:45 - 11:30', subject: 'Giáo dục công dân', teacher: 'Cô Hoàng Minh Nguyệt', room: 'Phòng 204', topic: 'Bài 3: Lao động cần cù và sáng tạo', preparationNote: 'Sưu tầm 1 câu chuyện về sự sáng tạo' }
    ]
  },
  {
    dayId: 't4',
    dayName: 'Thứ Tư',
    shortName: 'T4',
    items: [
      { id: 's-t4-1', period: 1, timeRange: '07:15 - 08:00', subject: 'Ngữ văn', teacher: 'Cô Trần Thị Mai', room: 'Phòng 204', topic: 'Văn bản: Lão Hạc (Tiết 2 - Phân tích nhân vật)', preparationNote: 'Ghi chú các dẫn chứng về số phận người nông dân' },
      { id: 's-t4-2', period: 2, timeRange: '08:05 - 08:50', subject: 'Ngữ văn', teacher: 'Cô Trần Thị Mai', room: 'Phòng 204', topic: 'Thực hành Tiếng Việt: Trợ từ và Thán từ', preparationNote: 'Làm bài tập nhận biết trong SGK' },
      { id: 's-t4-3', period: 3, timeRange: '09:05 - 09:50', subject: 'Toán học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng 204', topic: 'Hình học: Hình thang cân và tính chất', preparationNote: 'Mang theo thước thẳng, compa và ê-ke' },
      { id: 's-t4-4', period: 4, timeRange: '09:55 - 10:40', subject: 'Tiếng Anh', teacher: 'Cô Nguyễn Hoàng Lan', room: 'Phòng Lab 1', topic: 'Unit 2: A Closer Look 1 (Grammar)', preparationNote: 'Ôn cấu trúc so sánh hơn của trạng từ' },
      { id: 's-t4-5', period: 5, timeRange: '10:45 - 11:30', subject: 'Công nghệ', teacher: 'Thầy Vũ Văn Quyền', room: 'Xưởng thực hành', topic: 'Mạch điện cơ bản trong gia đình', preparationNote: 'Mang vở ghi chép' }
    ]
  },
  {
    dayId: 't5',
    dayName: 'Thứ Năm',
    shortName: 'T5',
    items: [
      { id: 's-t5-1', period: 1, timeRange: '07:15 - 08:00', subject: 'Toán học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng 204', topic: 'Đại số: Luyện tập phép nhân đa thức', preparationNote: 'Kiểm tra 15 phút đầu giờ phần thu gọn đa thức' },
      { id: 's-t5-2', period: 2, timeRange: '08:05 - 08:50', subject: 'Tin học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng máy số 2', topic: 'Thực hành dự án Game giáo dục toán học', preparationNote: 'Tiếp tục phát triển bài tập lớn' },
      { id: 's-t5-3', period: 3, timeRange: '09:05 - 09:50', subject: 'Khoa học Tự nhiên', teacher: 'Thầy Bùi Trọng Nghĩa', room: 'Phòng 204', topic: 'Vật lý: Áp suất chất lỏng và bình thông nhau', preparationNote: 'Xem trước video thí nghiệm bình thông nhau' },
      { id: 's-t5-4', period: 4, timeRange: '09:55 - 10:40', subject: 'Lịch sử & Địa lý', teacher: 'Thầy Đỗ Văn Minh', room: 'Phòng 204', topic: 'Địa lý: Đặc điểm khí hậu nhiệt đới gió mùa Việt Nam', preparationNote: 'Mang theo tập bản đồ Địa lý lớp 8' },
      { id: 's-t5-5', period: 5, timeRange: '10:45 - 11:30', subject: 'Âm nhạc - Mỹ thuật', teacher: 'Cô Đặng Thùy Dương', room: 'Phòng nghệ thuật', topic: 'Mỹ thuật: Thiết kế bưu thiếp tri ân thầy cô', preparationNote: 'Chuẩn bị giấy A4, màu sáp/màu nước' }
    ]
  },
  {
    dayId: 't6',
    dayName: 'Thứ Sáu',
    shortName: 'T6',
    items: [
      { id: 's-t6-1', period: 1, timeRange: '07:15 - 08:00', subject: 'Tiếng Anh', teacher: 'Cô Nguyễn Hoàng Lan', room: 'Phòng Lab 1', topic: 'Unit 2: Skills 1 (Reading & Speaking)', preparationNote: 'Luyện tập phát âm theo cặp' },
      { id: 's-t6-2', period: 2, timeRange: '08:05 - 08:50', subject: 'Toán học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng 204', topic: 'Hình học: Luyện tập chứng minh hình bình hành', preparationNote: 'Sửa bài tập về nhà số 3, 4' },
      { id: 's-t6-3', period: 3, timeRange: '09:05 - 09:50', subject: 'Khoa học Tự nhiên', teacher: 'Cô Nguyễn Thu Hằng', room: 'Phòng 204', topic: 'Sinh học: Hệ tuần hoàn máu và nguyên lý vận chuyển', preparationNote: 'Đọc trước cấu tạo tim và mạch máu' },
      { id: 's-t6-4', period: 4, timeRange: '09:55 - 10:40', subject: 'Giáo dục thể chất', teacher: 'Thầy Lê Văn Hùng', room: 'Sân bóng rổ', topic: 'Kỹ thuật dẫn bóng và ném rổ cơ bản', preparationNote: 'Khởi động kỹ trước khi tập' },
      { id: 's-t6-5', period: 5, timeRange: '10:45 - 11:30', subject: 'Sinh hoạt lớp', teacher: 'Thầy Hà Văn Toàn (GVCN)', room: 'Phòng 204', topic: 'Đánh giá nề nếp tuần và Kế hoạch học tập tuần mới', preparationNote: 'Ban cán sự lớp báo cáo tình hình các tổ' }
    ]
  },
  {
    dayId: 't7',
    dayName: 'Thứ Bảy',
    shortName: 'T7',
    items: [
      { id: 's-t7-1', period: 1, timeRange: '07:30 - 09:00', subject: 'CLB Tin học & STEM', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng STEM Lab', topic: 'Chế tạo robot tránh vật cản và lập trình vi điều khiển', preparationNote: 'Hoạt động ngoại khóa tự chọn' },
      { id: 's-t7-2', period: 2, timeRange: '09:15 - 10:45', subject: 'Bồi dưỡng Toán học', teacher: 'Thầy Hà Văn Toàn', room: 'Phòng 204', topic: 'Chuyên đề: Bất đẳng thức và giá trị nhỏ nhất', preparationNote: 'Dành cho đội tuyển học sinh giỏi và học sinh yêu thích Toán' }
    ]
  }
];

/**
 * 5. DANH SÁCH LỚP HỌC MẪU - TRƯỜNG THCS TĂNG BẠT HỔ
 */
export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-8a1',
    name: '8A1',
    grade: 'Khối 8',
    room: 'Phòng 204 (Tầng 2 - Dãy A)',
    homeroomTeacher: 'Thầy Hà Văn Toàn',
    totalStudents: 42,
    academicYear: 'Năm học 2024 - 2025',
    description: 'Lớp trọng điểm Toán - Tin học, nề nếp tốt, phong trào học tập sôi nổi.',
    createdAt: '2024-09-01'
  },
  {
    id: 'cls-8a2',
    name: '8A2',
    grade: 'Khối 8',
    room: 'Phòng 205 (Tầng 2 - Dãy A)',
    homeroomTeacher: 'Cô Trần Thị Mai',
    totalStudents: 40,
    academicYear: 'Năm học 2024 - 2025',
    description: 'Lớp chuyên cần, đạt nhiều thành tích trong phong trào Văn học và Ngoại khóa.',
    createdAt: '2024-09-01'
  },
  {
    id: 'cls-9a1',
    name: '9A1',
    grade: 'Khối 9',
    room: 'Phòng 301 (Tầng 3 - Dãy B)',
    homeroomTeacher: 'Thầy Hà Văn Toàn',
    totalStudents: 38,
    academicYear: 'Năm học 2024 - 2025',
    description: 'Lớp bồi dưỡng học sinh giỏi khối 9 môn Tin học & Toán, chuẩn bị thi vào lớp 10.',
    createdAt: '2024-09-01'
  }
];

/**
 * 6. DANH SÁCH HỌC SINH MẪU LỚP 8A1 - TRƯỜNG THCS TĂNG BẠT HỔ
 * GVCN: Thầy Hà Văn Toàn - Năm học 2024 - 2025
 */
export const INITIAL_STUDENTS_8A1: ClassStudent[] = [
  { id: 'stu-8a1-01', classId: 'cls-8a1', stt: 1, studentCode: 'TBH-8A1-01', fullName: 'Nguyễn Văn An', gender: 'Nam', birthDate: '15/04/2011', group: 'Tổ 1', role: 'Lớp trưởng', parentPhone: '0912.345.671', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Gương mẫu, phụ trách chung' },
  { id: 'stu-8a1-02', classId: 'cls-8a1', stt: 2, studentCode: 'TBH-8A1-02', fullName: 'Trần Thị Bích Châu', gender: 'Nữ', birthDate: '22/08/2011', group: 'Tổ 1', role: 'Lớp phó học tập', parentPhone: '0912.345.672', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Học giỏi Toán, trợ giảng bài tập' },
  { id: 'stu-8a1-03', classId: 'cls-8a1', stt: 3, studentCode: 'TBH-8A1-03', fullName: 'Lê Hoàng Cường', gender: 'Nam', birthDate: '09/01/2011', group: 'Tổ 1', role: 'Tổ trưởng', parentPhone: '0912.345.673', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Phụ trách nề nếp Tổ 1' },
  { id: 'stu-8a1-04', classId: 'cls-8a1', stt: 4, studentCode: 'TBH-8A1-04', fullName: 'Phạm Minh Đức', gender: 'Nam', birthDate: '11/11/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0912.345.674', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Yêu thích môn Khoa học tự nhiên' },
  { id: 'stu-8a1-05', classId: 'cls-8a1', stt: 5, studentCode: 'TBH-8A1-05', fullName: 'Đỗ Thúy Hằng', gender: 'Nữ', birthDate: '03/06/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0912.345.675', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Chăm chỉ, vở sạch chữ đẹp' },
  { id: 'stu-8a1-06', classId: 'cls-8a1', stt: 6, studentCode: 'TBH-8A1-06', fullName: 'Hoàng Quốc Hưng', gender: 'Nam', birthDate: '19/02/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0912.345.676', attendanceStatus: 'present', conduct: 'Khá', notes: 'Cần chú ý chuẩn bị bài môn Địa lí' },
  { id: 'stu-8a1-07', classId: 'cls-8a1', stt: 7, studentCode: 'TBH-8A1-07', fullName: 'Vũ Hải Đăng', gender: 'Nam', birthDate: '30/05/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0912.345.677', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tham gia CLB Tin học' },
  { id: 'stu-8a1-08', classId: 'cls-8a1', stt: 8, studentCode: 'TBH-8A1-08', fullName: 'Ngô Phương Linh', gender: 'Nữ', birthDate: '14/09/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0912.345.678', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Hăng hái phát biểu' },
  { id: 'stu-8a1-09', classId: 'cls-8a1', stt: 9, studentCode: 'TBH-8A1-09', fullName: 'Bùi Anh Khoa', gender: 'Nam', birthDate: '08/07/2011', group: 'Tổ 2', role: 'Lớp phó kỷ luật', parentPhone: '0913.456.781', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Theo dõi chuyên cần giờ truy bài' },
  { id: 'stu-8a1-10', classId: 'cls-8a1', stt: 10, studentCode: 'TBH-8A1-10', fullName: 'Đinh Mai Lan', gender: 'Nữ', birthDate: '27/03/2011', group: 'Tổ 2', role: 'Tổ trưởng', parentPhone: '0913.456.782', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tổ trưởng Tổ 2' },
  { id: 'stu-8a1-11', classId: 'cls-8a1', stt: 11, studentCode: 'TBH-8A1-11', fullName: 'Dương Gia Huy', gender: 'Nam', birthDate: '18/10/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.783', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Thành viên đội tuyển bóng đá' },
  { id: 'stu-8a1-12', classId: 'cls-8a1', stt: 12, studentCode: 'TBH-8A1-12', fullName: 'Huỳnh Ngọc Diệp', gender: 'Nữ', birthDate: '05/12/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.784', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Năng nổ trong các phong trào văn nghệ' },
  { id: 'stu-8a1-13', classId: 'cls-8a1', stt: 13, studentCode: 'TBH-8A1-13', fullName: 'Lý Quốc Trung', gender: 'Nam', birthDate: '25/08/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.785', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Có tinh thần hỗ trợ bạn bè' },
  { id: 'stu-8a1-14', classId: 'cls-8a1', stt: 14, studentCode: 'TBH-8A1-14', fullName: 'Mai Thanh Thảo', gender: 'Nữ', birthDate: '12/04/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.786', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Học lực Khá giỏi' },
  { id: 'stu-8a1-15', classId: 'cls-8a1', stt: 15, studentCode: 'TBH-8A1-15', fullName: 'Phan Bảo Long', gender: 'Nam', birthDate: '01/09/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.787', attendanceStatus: 'present', conduct: 'Khá', notes: 'Cần tăng cường rèn luyện môn Văn' },
  { id: 'stu-8a1-16', classId: 'cls-8a1', stt: 16, studentCode: 'TBH-8A1-16', fullName: 'Tạ Minh Tú', gender: 'Nữ', birthDate: '16/06/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0913.456.788', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Giữ vở sạch chữ đẹp' },
  { id: 'stu-8a1-17', classId: 'cls-8a1', stt: 17, studentCode: 'TBH-8A1-17', fullName: 'Trịnh Hoàng Nam', gender: 'Nam', birthDate: '29/01/2011', group: 'Tổ 3', role: 'Lớp phó lao động', parentPhone: '0914.567.891', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Phụ trách vệ sinh phòng học' },
  { id: 'stu-8a1-18', classId: 'cls-8a1', stt: 18, studentCode: 'TBH-8A1-18', fullName: 'Võ Thị Hồng Nhung', gender: 'Nữ', birthDate: '10/05/2011', group: 'Tổ 3', role: 'Tổ trưởng', parentPhone: '0914.567.892', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tổ trưởng Tổ 3' },
  { id: 'stu-8a1-19', classId: 'cls-8a1', stt: 19, studentCode: 'TBH-8A1-19', fullName: 'Cao Văn Thành', gender: 'Nam', birthDate: '04/03/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.893', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Chăm chỉ môn Lịch sử' },
  { id: 'stu-8a1-20', classId: 'cls-8a1', stt: 20, studentCode: 'TBH-8A1-20', fullName: 'Đặng Ngọc Uyên', gender: 'Nữ', birthDate: '23/11/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.894', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Cây văn nghệ của lớp' },
  { id: 'stu-8a1-21', classId: 'cls-8a1', stt: 21, studentCode: 'TBH-8A1-21', fullName: 'Hà Thế Vinh', gender: 'Nam', birthDate: '17/08/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.895', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Yêu thích thực hành STEM' },
  { id: 'stu-8a1-22', classId: 'cls-8a1', stt: 22, studentCode: 'TBH-8A1-22', fullName: 'Lê Quỳnh Nga', gender: 'Nữ', birthDate: '02/10/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.896', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tham gia ban Báo tường' },
  { id: 'stu-8a1-23', classId: 'cls-8a1', stt: 23, studentCode: 'TBH-8A1-23', fullName: 'Nguyễn Tấn Phát', gender: 'Nam', birthDate: '14/07/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.897', attendanceStatus: 'present', conduct: 'Khá', notes: 'Cần chú ý bài tập về nhà Tiếng Anh' },
  { id: 'stu-8a1-24', classId: 'cls-8a1', stt: 24, studentCode: 'TBH-8A1-24', fullName: 'Trần Yến Nhi', gender: 'Nữ', birthDate: '26/04/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0914.567.898', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Chăm ngoan lễ phép' },
  { id: 'stu-8a1-25', classId: 'cls-8a1', stt: 25, studentCode: 'TBH-8A1-25', fullName: 'Bùi Đức Trọng', gender: 'Nam', birthDate: '06/02/2011', group: 'Tổ 4', role: 'Tổ trưởng', parentPhone: '0915.678.901', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tổ trưởng Tổ 4' },
  { id: 'stu-8a1-26', classId: 'cls-8a1', stt: 26, studentCode: 'TBH-8A1-26', fullName: 'Chu Thu Hà', gender: 'Nữ', birthDate: '19/09/2011', group: 'Tổ 4', role: 'Thủ quỹ', parentPhone: '0915.678.902', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Thủ quỹ lớp 8A1' },
  { id: 'stu-8a1-27', classId: 'cls-8a1', stt: 27, studentCode: 'TBH-8A1-27', fullName: 'Đào Quang Khải', gender: 'Nam', birthDate: '31/05/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.903', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Học sinh tích cực' },
  { id: 'stu-8a1-28', classId: 'cls-8a1', stt: 28, studentCode: 'TBH-8A1-28', fullName: 'Hồ Kim Ngân', gender: 'Nữ', birthDate: '13/12/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.904', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Điểm tổng kết kỳ trước xuất sắc' },
  { id: 'stu-8a1-29', classId: 'cls-8a1', stt: 29, studentCode: 'TBH-8A1-29', fullName: 'Lâm Tuấn Kiệt', gender: 'Nam', birthDate: '21/08/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.905', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Đội cờ đỏ nhà trường' },
  { id: 'stu-8a1-30', classId: 'cls-8a1', stt: 30, studentCode: 'TBH-8A1-30', fullName: 'Nguyễn Thảo Nguyên', gender: 'Nữ', birthDate: '07/03/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.906', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Gương mẫu trong giờ học' },
  { id: 'stu-8a1-31', classId: 'cls-8a1', stt: 31, studentCode: 'TBH-8A1-31', fullName: 'Phan Tấn Lộc', gender: 'Nam', birthDate: '11/06/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.907', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Học đều các môn' },
  { id: 'stu-8a1-32', classId: 'cls-8a1', stt: 32, studentCode: 'TBH-8A1-32', fullName: 'Tạ Khánh Vy', gender: 'Nữ', birthDate: '28/10/2011', group: 'Tổ 4', role: 'Học sinh', parentPhone: '0915.678.908', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Thành viên ban Phát thanh măng non' },
  { id: 'stu-8a1-33', classId: 'cls-8a1', stt: 33, studentCode: 'TBH-8A1-33', fullName: 'Vương Gia Bảo', gender: 'Nam', birthDate: '05/01/2011', group: 'Tổ 1', role: 'Học sinh', parentPhone: '0916.789.011', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Tích cực hoạt động nhóm' },
  { id: 'stu-8a1-34', classId: 'cls-8a1', stt: 34, studentCode: 'TBH-8A1-34', fullName: 'Đỗ Hải Yến', gender: 'Nữ', birthDate: '18/07/2011', group: 'Tổ 2', role: 'Học sinh', parentPhone: '0916.789.012', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Cẩn thận, tỉ mỉ' },
  { id: 'stu-8a1-35', classId: 'cls-8a1', stt: 35, studentCode: 'TBH-8A1-35', fullName: 'Trần Gia Hưng', gender: 'Nam', birthDate: '24/09/2011', group: 'Tổ 3', role: 'Học sinh', parentPhone: '0916.789.013', attendanceStatus: 'present', conduct: 'Tốt', notes: 'Năng động, lễ phép' }
];

/**
 * Đoạn văn bản mẫu chuẩn để Thầy Toàn sao chép/dán thử nghiệm tính năng Nhập danh sách
 */
export const RAW_SAMPLE_STUDENT_IMPORT_TEXT = `1	Nguyễn Văn An	Nam	15/04/2011	Lớp trưởng	0912.345.671
2	Trần Thị Bích Châu	Nữ	22/08/2011	Lớp phó học tập	0912.345.672
3	Lê Hoàng Cường	Nam	09/01/2011	Tổ trưởng	0912.345.673
4	Phạm Minh Đức	Nam	11/11/2011	Học sinh	0912.345.674
5	Đỗ Thúy Hằng	Nữ	03/06/2011	Học sinh	0912.345.675
6	Hoàng Quốc Hưng	Nam	19/02/2011	Học sinh	0912.345.676
7	Vũ Hải Đăng	Nam	30/05/2011	Học sinh	0912.345.677
8	Ngô Phương Linh	Nữ	14/09/2011	Học sinh	0912.345.678
9	Bùi Anh Khoa	Nam	08/07/2011	Lớp phó kỷ luật	0913.456.781
10	Đinh Mai Lan	Nữ	27/03/2011	Tổ trưởng	0913.456.782
11	Dương Gia Huy	Nam	18/10/2011	Học sinh	0913.456.783
12	Huỳnh Ngọc Diệp	Nữ	05/12/2011	Học sinh	0913.456.784
13	Lý Quốc Trung	Nam	25/08/2011	Học sinh	0913.456.785
14	Mai Thanh Thảo	Nữ	12/04/2011	Học sinh	0913.456.786
15	Phan Bảo Long	Nam	01/09/2011	Học sinh	0913.456.787
16	Tạ Minh Tú	Nữ	16/06/2011	Học sinh	0913.456.788
17	Trịnh Hoàng Nam	Nam	29/01/2011	Lớp phó lao động	0914.567.891
18	Võ Thị Hồng Nhung	Nữ	10/05/2011	Tổ trưởng	0914.567.892
19	Cao Văn Thành	Nam	04/03/2011	Học sinh	0914.567.893
20	Đặng Ngọc Uyên	Nữ	23/11/2011	Học sinh	0914.567.894`;

/**
 * 7. TRÍCH XUẤT THỐNG KÊ VÀ LƯU TRỮ VÀO LOCALSTORAGE
 */
export const STORAGE_KEYS = {
  ASSIGNMENTS: 'tbh_portal_assignments_v1',
  SCHEDULE: 'tbh_portal_schedule_v1',
  PROFILE: 'tbh_portal_profile_v1',
  CLASSES: 'tbh_portal_classes_v1',
  SELECTED_CLASS_ID: 'tbh_portal_selected_class_id_v1',
  STUDENTS: 'tbh_portal_students_v1',
  SOUND_ENABLED: 'tbh_portal_sound_v1'
};
