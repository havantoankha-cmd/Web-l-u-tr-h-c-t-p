import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  HelpCircle, 
  ListOrdered,
  Users,
  Info,
  Download,
  FileText,
  CheckCircle2,
  FileUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ClassStudent } from '../types';
import { RAW_SAMPLE_STUDENT_IMPORT_TEXT } from '../data/initialData';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  classId: string;
  currentStudentCount: number;
  onImportStudents: (parsedStudents: ClassStudent[], mode: 'replace' | 'append') => void;
  soundEnabled: boolean;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  className,
  classId,
  currentStudentCount,
  onImportStudents,
  soundEnabled
}) => {
  // Input method tab: 'file' (Excel / CSV upload) or 'text' (Direct copy paste)
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  // File states
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Text state
  const [rawText, setRawText] = useState('');

  // Parsed and validation
  const [parsedList, setParsedList] = useState<ClassStudent[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const cleanClassName = className.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || '8A1';

  // Process rows from 2D Array (from Excel or CSV sheet)
  const processRawRows = (rows: any[][]) => {
    if (!rows || rows.length === 0) {
      setParsedList([]);
      setValidationError('Tệp không có dữ liệu.');
      return;
    }

    let headerRowIndex = -1;
    let nameCol = -1;
    let sttCol = -1;
    let codeCol = -1;
    let genderCol = -1;
    let birthDateCol = -1;
    let groupCol = -1;
    let roleCol = -1;
    let phoneCol = -1;
    let notesCol = -1;

    // Search for header row
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const row = rows[i];
      if (!Array.isArray(row)) continue;

      for (let j = 0; j < row.length; j++) {
        const cell = String(row[j] || '').trim().toLowerCase();
        if (
          cell.includes('họ và tên') || 
          cell.includes('họ tên') || 
          cell.includes('tên học sinh') ||
          cell === 'họ và tên học sinh'
        ) {
          headerRowIndex = i;
          nameCol = j;
          break;
        }
      }
      if (headerRowIndex !== -1) break;
    }

    // If found header row, find other column indexes
    if (headerRowIndex !== -1) {
      const headerRow = rows[headerRowIndex];
      for (let j = 0; j < headerRow.length; j++) {
        const cell = String(headerRow[j] || '').trim().toLowerCase();
        if (cell === 'stt' || cell.includes('số tt') || cell.includes('thứ tự')) {
          sttCol = j;
        } else if (cell.includes('mã') || cell.includes('mã hs') || cell.includes('mã định danh')) {
          codeCol = j;
        } else if (cell.includes('giới tính') || cell === 'phái' || cell === 'nam/nữ') {
          genderCol = j;
        } else if (cell.includes('ngày sinh') || cell.includes('năm sinh') || cell.includes('sinh ngày')) {
          birthDateCol = j;
        } else if (cell.includes('tổ') || cell.includes('nhóm')) {
          groupCol = j;
        } else if (cell.includes('chức vụ') || cell.includes('nhiệm vụ') || cell.includes('vai trò')) {
          roleCol = j;
        } else if (cell.includes('sđt') || cell.includes('điện thoại') || cell.includes('phụ huynh') || cell.includes('liên hệ')) {
          phoneCol = j;
        } else if (cell.includes('ghi chú') || cell.includes('nhận xét')) {
          notesCol = j;
        }
      }
    }

    const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;
    const results: ClassStudent[] = [];
    let indexCounter = importMode === 'append' ? currentStudentCount + 1 : 1;

    for (let r = startRow; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.length === 0) continue;

      let fullName = '';
      let stt = indexCounter;
      let studentCode = '';
      let gender: 'Nam' | 'Nữ' = 'Nam';
      let birthDate = '15/04/2011';
      let role = 'Học sinh';
      let parentPhone = '';
      let group = `Tổ ${((indexCounter - 1) % 4) + 1}`;
      let notes = 'Nhập từ tệp';

      if (nameCol !== -1 && row[nameCol]) {
        fullName = String(row[nameCol]).trim();
      } else {
        // Fallback: look for the first non-numeric cell with length > 2
        for (let c = 0; c < row.length; c++) {
          const val = String(row[c] || '').trim();
          if (val.length >= 2 && !/^\d+$/.test(val) && !val.includes('/') && !val.toLowerCase().includes('lớp')) {
            fullName = val;
            break;
          }
        }
      }

      if (!fullName || fullName.length < 2) continue;

      // Extract STT
      if (sttCol !== -1 && row[sttCol]) {
        const parsedStt = parseInt(String(row[sttCol]).replace(/\D/g, ''), 10);
        if (!isNaN(parsedStt)) stt = parsedStt;
      }

      // Extract Student Code
      if (codeCol !== -1 && row[codeCol]) {
        studentCode = String(row[codeCol]).trim();
      }

      // Extract Gender
      if (genderCol !== -1 && row[genderCol]) {
        const gStr = String(row[genderCol]).trim().toLowerCase();
        if (gStr.startsWith('nữ') || gStr === 'nu' || gStr === 'female') {
          gender = 'Nữ';
        } else {
          gender = 'Nam';
        }
      } else {
        if (/\b(thị|thao|nhung|lan|linh|ngân|châu|nhi|vy|thảo|hằng|ngọc)\b/i.test(fullName)) {
          gender = 'Nữ';
        }
      }

      // Extract BirthDate
      if (birthDateCol !== -1 && row[birthDateCol]) {
        const rawDate = row[birthDateCol];
        if (typeof rawDate === 'number') {
          // Excel serial date format
          try {
            const dateObj = XLSX.SSF.parse_date_code(rawDate);
            birthDate = `${String(dateObj.d).padStart(2, '0')}/${String(dateObj.m).padStart(2, '0')}/${dateObj.y}`;
          } catch {
            birthDate = String(rawDate);
          }
        } else {
          birthDate = String(rawDate).trim();
        }
      }

      // Extract Group
      if (groupCol !== -1 && row[groupCol]) {
        const grpVal = String(row[groupCol]).trim();
        if (grpVal) group = grpVal.toLowerCase().includes('tổ') ? grpVal : `Tổ ${grpVal}`;
      }

      // Extract Role
      if (roleCol !== -1 && row[roleCol]) {
        const roleVal = String(row[roleCol]).trim();
        if (roleVal) role = roleVal;
      }

      // Extract Phone
      if (phoneCol !== -1 && row[phoneCol]) {
        parentPhone = String(row[phoneCol]).trim();
      }

      // Extract Notes
      if (notesCol !== -1 && row[notesCol]) {
        notes = String(row[notesCol]).trim();
      }

      if (!studentCode) {
        studentCode = `TBH-${cleanClassName}-${String(stt).padStart(2, '0')}`;
      }

      results.push({
        id: `stu-${classId}-${stt}-${Date.now()}-${r}`,
        classId,
        stt,
        studentCode,
        fullName,
        gender,
        birthDate,
        group,
        role,
        parentPhone: parentPhone || `091${Math.floor(1000000 + Math.random() * 9000000)}`,
        attendanceStatus: 'present',
        conduct: 'Tốt',
        notes
      });

      indexCounter++;
    }

    setParsedList(results);
    if (results.length === 0) {
      setValidationError('Không nhận diện được học sinh nào từ tệp. Vui lòng kiểm tra lại cấu trúc bảng tính.');
    } else {
      setValidationError(null);
    }
  };

  // Handle uploaded file
  const handleFileChange = async (file: File) => {
    if (!file) return;

    playClickSound(soundEnabled);
    setSelectedFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setValidationError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
      processRawRows(rows);
    } catch (err) {
      setValidationError('Có lỗi khi đọc tệp. Vui lòng đảm bảo tệp đúng định dạng Excel (.xlsx, .xls) hoặc CSV.');
    }
  };

  // Parse text whenever rawText changes in text tab
  useEffect(() => {
    if (activeTab !== 'text') return;
    if (!rawText.trim()) {
      setParsedList([]);
      setValidationError(null);
      return;
    }

    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const rows: string[][] = lines.map(line => {
      if (line.includes('\t')) return line.split('\t').map(p => p.trim());
      if (line.includes('|')) return line.split('|').map(p => p.trim());
      if (line.includes(';') && !line.includes('&#')) return line.split(';').map(p => p.trim());
      if (line.includes(',') && !line.includes('THCS')) return line.split(',').map(p => p.trim());
      return [line];
    });

    processRawRows(rows);
  }, [rawText, activeTab, importMode, className, classId, currentStudentCount]);

  if (!isOpen) return null;

  // Handle Download Excel Template
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    playToggleSound(soundEnabled);
    const templateData = [
      ['TRƯỜNG THCS TĂNG BẠT HỔ', '', '', '', '', '', '', ''],
      [`DANH SÁCH HỌC SINH MẪU - LỚP ${className}`, '', '', '', '', '', '', ''],
      ['GVCN: Thầy Hà Văn Toàn - Năm học 2024 - 2025', '', '', '', '', '', '', ''],
      ['STT', 'Mã học sinh', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Phân tổ', 'Chức vụ', 'SĐT Phụ huynh', 'Ghi chú'],
      [1, `TBH-${cleanClassName}-01`, 'Nguyễn Văn An', 'Nam', '15/04/2011', 'Tổ 1', 'Lớp trưởng', '0912.345.671', 'Gương mẫu'],
      [2, `TBH-${cleanClassName}-02`, 'Trần Thị Bích Châu', 'Nữ', '22/08/2011', 'Tổ 1', 'Lớp phó học tập', '0912.345.672', 'Học giỏi Toán'],
      [3, `TBH-${cleanClassName}-03`, 'Lê Hoàng Cường', 'Nam', '09/01/2011', 'Tổ 1', 'Tổ trưởng', '0912.345.673', 'Phụ trách nề nếp Tổ 1'],
      [4, `TBH-${cleanClassName}-04`, 'Phạm Minh Đức', 'Nam', '11/11/2011', 'Tổ 1', 'Học sinh', '0912.345.674', 'Yêu thích KHTN'],
      [5, `TBH-${cleanClassName}-05`, 'Đỗ Thúy Hằng', 'Nữ', '03/06/2011', 'Tổ 1', 'Học sinh', '0912.345.675', 'Chăm chỉ'],
      [6, `TBH-${cleanClassName}-06`, 'Bùi Anh Khoa', 'Nam', '08/07/2011', 'Tổ 2', 'Lớp phó kỷ luật', '0913.456.781', 'Theo dõi nề nếp'],
      [7, `TBH-${cleanClassName}-07`, 'Đinh Mai Lan', 'Nữ', '27/03/2011', 'Tổ 2', 'Tổ trưởng', '0913.456.782', 'Tổ trưởng Tổ 2'],
      [8, `TBH-${cleanClassName}-08`, 'Huỳnh Ngọc Diệp', 'Nữ', '05/12/2011', 'Tổ 2', 'Học sinh', '0913.456.784', 'Cây văn nghệ'],
      [9, `TBH-${cleanClassName}-09`, 'Trịnh Hoàng Nam', 'Nam', '29/01/2011', 'Tổ 3', 'Lớp phó lao động', '0914.567.891', 'Phụ trách vệ sinh'],
      [10, `TBH-${cleanClassName}-10`, 'Võ Thị Hồng Nhung', 'Nữ', '10/05/2011', 'Tổ 3', 'Tổ trưởng', '0914.567.892', 'Tổ trưởng Tổ 3'],
      [11, `TBH-${cleanClassName}-11`, 'Chu Thu Hà', 'Nữ', '19/09/2011', 'Tổ 4', 'Thủ quỹ', '0915.678.902', 'Thủ quỹ lớp'],
      [12, `TBH-${cleanClassName}-12`, 'Lâm Tuấn Kiệt', 'Nam', '21/08/2011', 'Tổ 4', 'Học sinh', '0915.678.905', 'Đội cờ đỏ']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    // Set column widths
    ws['!cols'] = [
      { wch: 6 },  // STT
      { wch: 16 }, // Mã
      { wch: 24 }, // Họ và tên
      { wch: 10 }, // Giới tính
      { wch: 14 }, // Ngày sinh
      { wch: 10 }, // Tổ
      { wch: 18 }, // Chức vụ
      { wch: 16 }, // SĐT
      { wch: 20 }  // Ghi chú
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Lop_${cleanClassName}`);

    if (format === 'xlsx') {
      XLSX.writeFile(wb, `Mau_Danh_Sach_Lop_${cleanClassName}_THCS_TangBatHo.xlsx`);
    } else {
      XLSX.writeFile(wb, `Mau_Danh_Sach_Lop_${cleanClassName}_THCS_TangBatHo.csv`, { bookType: 'csv' });
    }
  };

  const handleConfirmImport = () => {
    if (parsedList.length === 0) return;
    playSuccessChime(soundEnabled);
    onImportStudents(parsedList, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Nhập danh sách học sinh bằng File</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Lớp {className}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hỗ trợ tải lên file Excel (.xlsx, .xls), CSV hoặc dán văn bản trực tiếp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: File vs Text Paste */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveTab('file');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Tải file Excel / CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setActiveTab('text');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Dán văn bản trực tiếp</span>
            </button>
          </div>

          {/* Download Template Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleDownloadTemplate('xlsx')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Tải file mẫu Excel chuẩn Trường THCS Tăng Bạt Hổ"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tải mẫu Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadTemplate('csv')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Tải file mẫu dạng CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Mẫu CSV</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FILE UPLOAD ZONE */}
        {activeTab === 'file' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls, .csv, .txt, .tsv"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) handleFileChange(files[0]);
              }}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files && files[0]) handleFileChange(files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-101'
                  : selectedFileName
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {selectedFileName ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {selectedFileName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Dung lượng: {fileSize} • Đã nhận diện: <strong className="text-emerald-700">{parsedList.length} học sinh</strong>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-2 text-xs font-semibold text-blue-700 bg-white px-3 py-1 rounded-md border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Chọn file khác từ máy tính
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Kéo thả file Excel hoặc bấm để chọn tệp từ máy tính
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Hỗ trợ tệp <strong>.xlsx, .xls, .csv</strong> (Bảng điểm danh, sổ gọi tên và ghi điểm THCS, file xuất từ VnEdu hoặc SMAS)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TEXT PASTE ZONE */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Dán dữ liệu từ bảng tính:</span>
              <button
                type="button"
                onClick={() => {
                  playToggleSound(soundEnabled);
                  setRawText(RAW_SAMPLE_STUDENT_IMPORT_TEXT);
                }}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-md cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Dán mẫu 20 học sinh Lớp 8A1</span>
              </button>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={6}
              placeholder={`Dán hàng loạt dòng từ Excel:\n1\tNguyễn Văn An\tNam\t15/04/2011\tLớp trưởng\t0912.345.671\n2\tTrần Thị Bích Châu\tNữ\t22/08/2011\tLớp phó học tập\t0912.345.672`}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        )}

        {/* Import Mode: Replace vs Append */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            importMode === 'replace' 
              ? 'bg-blue-50/70 border-blue-300 shadow-2xs' 
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}>
            <input
              type="radio"
              name="importMode"
              checked={importMode === 'replace'}
              onChange={() => setImportMode('replace')}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-bold text-xs text-slate-900">
                Thay thế toàn bộ danh sách lớp
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Cập nhật danh sách mới hoàn toàn từ file (ghi đè danh sách cũ)
              </div>
            </div>
          </label>

          <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            importMode === 'append' 
              ? 'bg-blue-50/70 border-blue-300 shadow-2xs' 
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}>
            <input
              type="radio"
              name="importMode"
              checked={importMode === 'append'}
              onChange={() => setImportMode('append')}
              className="mt-0.5 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-bold text-xs text-slate-900">
                Thêm tiếp vào danh sách hiện có
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Giữ nguyên {currentStudentCount} học sinh hiện tại và bổ sung học sinh mới
              </div>
            </div>
          </label>
        </div>

        {/* Live Preview Table */}
        {parsedList.length > 0 && (
          <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Xem trước kết quả nhận diện từ tệp: </span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  {parsedList.length} học sinh
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">
                {parsedList.filter(s => s.gender === 'Nam').length} Nam • {parsedList.filter(s => s.gender === 'Nữ').length} Nữ
              </span>
            </div>

            {/* Scrollable Mini Table */}
            <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-white text-xs shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-600 text-[11px] font-bold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2 w-12 text-center">STT</th>
                    <th className="p-2 w-28">Mã số</th>
                    <th className="p-2">Họ và tên</th>
                    <th className="p-2 w-16 text-center">Giới tính</th>
                    <th className="p-2 w-24">Ngày sinh</th>
                    <th className="p-2 w-24">Tổ</th>
                    <th className="p-2 w-28">Chức vụ</th>
                    <th className="p-2 w-28">SĐT Phụ huynh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedList.slice(0, 50).map((student) => (
                    <tr key={student.studentCode + '-' + student.stt} className="hover:bg-blue-50/40">
                      <td className="p-2 text-center font-bold text-slate-500">{student.stt}</td>
                      <td className="p-2 font-mono text-[11px] text-blue-700 font-semibold">{student.studentCode}</td>
                      <td className="p-2 font-bold text-slate-800">{student.fullName}</td>
                      <td className="p-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          student.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="p-2 text-slate-600">{student.birthDate}</td>
                      <td className="p-2 text-slate-600 font-medium">{student.group}</td>
                      <td className="p-2">
                        {student.role && student.role !== 'Học sinh' ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {student.role}
                          </span>
                        ) : (
                          <span className="text-slate-400">Học sinh</span>
                        )}
                      </td>
                      <td className="p-2 text-slate-500 font-mono text-[11px]">{student.parentPhone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error message */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Thầy/Cô có thể tải file mẫu Excel về chỉnh sửa rồi tải lên</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={parsedList.length === 0}
              onClick={handleConfirmImport}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                parsedList.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:scale-102'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận nhập {parsedList.length > 0 ? `${parsedList.length} học sinh` : 'tệp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
