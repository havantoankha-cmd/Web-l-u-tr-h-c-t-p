import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Edit3, 
  Sparkles, 
  Check, 
  X, 
  CalendarDays,
  Plus,
  Trash2,
  School,
  Layers
} from 'lucide-react';
import { DaySchedule, ScheduleItem } from '../types';
import { SUBJECT_COLORS, SUBJECT_OPTIONS } from '../data/initialData';
import { playClickSound, playSuccessChime, playToggleSound } from '../utils/sound';

interface ScheduleViewProps {
  schedule: DaySchedule[];
  onUpdateScheduleItem: (dayId: string, item: ScheduleItem) => void;
  onAddScheduleItem: (dayId: string, item: Omit<ScheduleItem, 'id'>) => void;
  onDeleteScheduleItem: (dayId: string, itemId: string) => void;
  currentClassName?: string;
  onOpenClassManager?: () => void;
  soundEnabled: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  onUpdateScheduleItem,
  onAddScheduleItem,
  onDeleteScheduleItem,
  currentClassName = '8A1',
  onOpenClassManager,
  soundEnabled
}) => {
  // Determine current day of week to auto-highlight
  const currentDayIndex = new Date().getDay(); // 0: Sun, 1: Mon, 2: Tue...
  const dayKeyMap: Record<number, string> = {
    1: 't2', 2: 't3', 3: 't4', 4: 't5', 5: 't6', 6: 't7', 0: 't2'
  };
  const systemTodayKey = dayKeyMap[currentDayIndex] || 't2';

  const [activeDayId, setActiveDayId] = useState<string>(systemTodayKey);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: ScheduleItem } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form state
  const [editTopic, setEditTopic] = useState('');
  const [editPrep, setEditPrep] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editTeacher, setEditTeacher] = useState('');

  // Add form state
  const [addDayId, setAddDayId] = useState<string>(systemTodayKey);
  const [addPeriod, setAddPeriod] = useState<number>(1);
  const [addTimeRange, setAddTimeRange] = useState<string>('07:15 - 08:00');
  const [addSubject, setAddSubject] = useState<string>('Toán học');
  const [addCustomSubject, setAddCustomSubject] = useState<string>('');
  const [addTopic, setAddTopic] = useState<string>('');
  const [addTeacher, setAddTeacher] = useState<string>('Thầy Hà Văn Toàn');
  const [addRoom, setAddRoom] = useState<string>('Phòng 204');
  const [addPrep, setAddPrep] = useState<string>('');

  const activeDay = schedule.find(d => d.dayId === activeDayId) || schedule[0];

  // Helper: standard period time presets
  const getPeriodTime = (p: number) => {
    switch (p) {
      case 1: return '07:15 - 08:00';
      case 2: return '08:05 - 08:50';
      case 3: return '09:05 - 09:50';
      case 4: return '09:55 - 10:40';
      case 5: return '10:45 - 11:30';
      case 6: return '13:30 - 14:15';
      case 7: return '14:20 - 15:05';
      default: return '07:15 - 08:00';
    }
  };

  const handleOpenAdd = (dayId?: string) => {
    playClickSound(soundEnabled);
    const targetDay = dayId || activeDayId;
    setAddDayId(targetDay);
    
    // Automatically find next available period number for that day
    const dayData = schedule.find(d => d.dayId === targetDay);
    const currentPeriods = dayData ? dayData.items.map(it => it.period) : [];
    let nextPeriod = 1;
    for (let i = 1; i <= 7; i++) {
      if (!currentPeriods.includes(i)) {
        nextPeriod = i;
        break;
      }
    }
    setAddPeriod(nextPeriod);
    setAddTimeRange(getPeriodTime(nextPeriod));
    setAddSubject('Toán học');
    setAddCustomSubject('');
    setAddTopic('');
    setAddTeacher('Thầy Hà Văn Toàn');
    setAddRoom('Phòng 204');
    setAddPrep('');
    setIsAddModalOpen(true);
  };

  const handlePeriodChange = (p: number) => {
    setAddPeriod(p);
    setAddTimeRange(getPeriodTime(p));
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTopic.trim()) return;

    const finalSubject = addSubject === 'Khác' ? (addCustomSubject.trim() || 'Môn học khác') : addSubject;

    onAddScheduleItem(addDayId, {
      period: Number(addPeriod),
      timeRange: addTimeRange.trim() || getPeriodTime(Number(addPeriod)),
      subject: finalSubject,
      teacher: addTeacher.trim() || 'Thầy Hà Văn Toàn',
      room: addRoom.trim() || 'Phòng 204',
      topic: addTopic.trim(),
      preparationNote: addPrep.trim()
    });

    playSuccessChime(soundEnabled);
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (dayId: string, item: ScheduleItem) => {
    if (window.confirm(`Xóa tiết ${item.period} (${item.subject} - "${item.topic}") khỏi thời khóa biểu?`)) {
      playToggleSound(soundEnabled);
      onDeleteScheduleItem(dayId, item.id);
    }
  };

  const handleOpenEdit = (dayId: string, item: ScheduleItem) => {
    playClickSound(soundEnabled);
    setEditingItem({ dayId, item });
    setEditTopic(item.topic);
    setEditPrep(item.preparationNote || '');
    setEditRoom(item.room);
    setEditTeacher(item.teacher);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    onUpdateScheduleItem(editingItem.dayId, {
      ...editingItem.item,
      topic: editTopic.trim(),
      preparationNote: editPrep.trim(),
      room: editRoom.trim(),
      teacher: editTeacher.trim()
    });

    playSuccessChime(soundEnabled);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Thời Khóa Biểu & Lịch Học Theo Tuần
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-slate-500">
              <span>Áp dụng Học kỳ I</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                <School className="w-3.5 h-3.5" />
                Lớp {currentClassName}
              </span>
              <span>•</span>
              <span>GVCN: <strong>Thầy Hà Văn Toàn</strong></span>
            </div>
          </div>

          {/* Action buttons: Class Manager, Add Period, View mode toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenClassManager && (
              <button
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  onOpenClassManager();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Quản lý danh sách lớp học hoặc thêm lớp mới"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Quản lý lớp học</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm tiết học</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setViewMode('single');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Theo ngày
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setViewMode('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cả tuần
            </button>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex overflow-x-auto gap-2 pt-2 border-t border-slate-100 no-scrollbar">
          {schedule.map((day) => {
            const isToday = day.dayId === systemTodayKey;
            const isSelected = day.dayId === activeDayId && viewMode === 'single';

            return (
              <button
                key={day.dayId}
                type="button"
                onClick={() => {
                  playClickSound(soundEnabled);
                  setActiveDayId(day.dayId);
                  setViewMode('single');
                }}
                className={`flex-1 min-w-[85px] py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                    : isToday
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="text-xs uppercase tracking-wider">{day.shortName}</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">{day.dayName}</div>
                
                {isToday && (
                  <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded-full font-extrabold mt-1 ${
                    isSelected ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                  }`}>
                    Hôm nay
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Schedule List View (Single Day Mode) */}
      {viewMode === 'single' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">
                Lịch học {activeDay.dayName}
              </h3>
              {activeDay.dayId === systemTodayKey && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ngày hiện tại 📍
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 mr-1">
                <strong>{activeDay.items.length}</strong> tiết
              </span>
              <button
                type="button"
                onClick={() => handleOpenAdd(activeDay.dayId)}
                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm tiết {activeDay.shortName}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeDay.items.map((item) => {
              const subjectColor = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS['Mặc định'];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Period Number and Subject Badge */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase text-blue-500 font-medium">Tiết</span>
                        <span>{item.period}</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${subjectColor.badge}`}>
                            {item.subject}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.timeRange}
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                          {item.topic}
                        </h4>
                      </div>
                    </div>

                    {/* Teacher & Room & Action */}
                    <div className="flex flex-wrap items-center sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-xs sm:text-right space-y-0.5">
                        <div className="flex items-center sm:justify-end gap-1.5 text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.teacher}</span>
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.room}</span>
                        </div>
                      </div>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(activeDay.dayId, item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Chỉnh sửa nội dung tiết học hoặc ghi chú chuẩn bị"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(activeDay.dayId, item)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs border border-slate-200 transition-colors cursor-pointer"
                          title="Xóa tiết học này khỏi thời khóa biểu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Notes / Requirements */}
                  {item.preparationNote && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Lưu ý chuẩn bị:</strong> {item.preparationNote}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. Full Week Table View */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 overflow-x-auto shadow-2xs">
            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span>Thời Khóa Biểu Tổng Hợp Cả Tuần (Thứ 2 - Thứ 7)</span>
            </h3>

            <div className="min-w-[700px]">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 w-16 text-center">Tiết</th>
                    <th className="py-2.5 px-3 w-28">Thời gian</th>
                    {schedule.map(d => (
                      <th 
                        key={d.dayId} 
                        className={`py-2.5 px-3 text-center ${d.dayId === systemTodayKey ? 'bg-blue-100 text-blue-900' : ''}`}
                      >
                        {d.dayName}
                        {d.dayId === systemTodayKey && <span className="block text-[10px] text-blue-600">Hôm nay</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[1, 2, 3, 4, 5].map((periodNum) => (
                    <tr key={periodNum} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 text-center font-bold bg-slate-50 text-slate-700 border-r border-slate-200">
                        Tiết {periodNum}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium border-r border-slate-200 whitespace-nowrap">
                        {periodNum === 1 ? '07:15 - 08:00' :
                         periodNum === 2 ? '08:05 - 08:50' :
                         periodNum === 3 ? '09:05 - 09:50' :
                         periodNum === 4 ? '09:55 - 10:40' : '10:45 - 11:30'}
                      </td>
                      {schedule.map(day => {
                        const item = day.items.find(i => i.period === periodNum);
                        if (!item) {
                          return (
                            <td key={day.dayId} className="py-3 px-3 text-center text-slate-300 italic border-r border-slate-200">
                              -
                            </td>
                          );
                        }

                        const subjectColor = SUBJECT_COLORS[item.subject] || SUBJECT_COLORS['Mặc định'];

                        return (
                          <td 
                            key={day.dayId} 
                            className={`py-2 px-2.5 border-r border-slate-200 align-top cursor-pointer hover:bg-blue-50/50 transition-colors ${
                              day.dayId === systemTodayKey ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => handleOpenEdit(day.dayId, item)}
                          >
                            <span className={`inline-block text-[11px] font-bold px-1.5 py-0.5 rounded ${subjectColor.badge} mb-1`}>
                              {item.subject}
                            </span>
                            <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                              {item.topic}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {item.room}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              💡 Thầy cô hoặc học sinh có thể bấm trực tiếp vào bất kỳ ô tiết học nào để sửa bài học hoặc ghi chú dặn dò.
            </p>
          </div>
        </div>
      )}

      {/* 4. Edit Schedule Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Chỉnh Sửa Tiết {editingItem.item.period}: {editingItem.item.subject}
                </h3>
                <p className="text-xs text-slate-500">
                  {schedule.find(d => d.dayId === editingItem.dayId)?.dayName} • {editingItem.item.timeRange}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung bài học / Chủ đề
                </label>
                <input
                  type="text"
                  required
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  placeholder="Ví dụ: Đại số: Phép cộng trừ đa thức"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lưu ý chuẩn bị (sách vở, đồ dùng, bài tập cũ)
                </label>
                <textarea
                  rows={2}
                  value={editPrep}
                  onChange={(e) => setEditPrep(e.target.value)}
                  placeholder="Ví dụ: Mang thước kẻ, compa, máy tính..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    placeholder="Phòng 204"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giáo viên phụ trách
                  </label>
                  <input
                    type="text"
                    value={editTeacher}
                    onChange={(e) => setEditTeacher(e.target.value)}
                    placeholder="Thầy Hà Văn Toàn"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Lưu tiết học
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Add Schedule Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveAdd}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Thêm Tiết Học / Lớp Học Mới Vào TKB</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lớp {currentClassName} • Thầy Hà Văn Toàn phụ trách
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ngày học trong tuần <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addDayId}
                    onChange={(e) => setAddDayId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {schedule.map(d => (
                      <option key={d.dayId} value={d.dayId}>
                        {d.dayName} ({d.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tiết học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addPeriod}
                    onChange={(e) => handlePeriodChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>
                        Tiết {num} ({getPeriodTime(num)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Khung thời gian
                  </label>
                  <input
                    type="text"
                    value={addTimeRange}
                    onChange={(e) => setAddTimeRange(e.target.value)}
                    placeholder="07:15 - 08:00"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Môn học <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addSubject}
                    onChange={(e) => setAddSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {SUBJECT_OPTIONS.filter(s => s !== 'Tất cả').map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                    <option value="Âm nhạc - Mỹ thuật">Âm nhạc - Mỹ thuật</option>
                    <option value="CLB Tin học & STEM">CLB Tin học & STEM</option>
                    <option value="Sinh hoạt lớp">Sinh hoạt lớp</option>
                    <option value="Khác">Môn học khác...</option>
                  </select>
                </div>
              </div>

              {addSubject === 'Khác' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nhập tên môn học
                  </label>
                  <input
                    type="text"
                    required
                    value={addCustomSubject}
                    onChange={(e) => setAddCustomSubject(e.target.value)}
                    placeholder="Ví dụ: Bồi dưỡng Toán, Kỹ năng sống..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung bài học / Chủ đề <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addTopic}
                  onChange={(e) => setAddTopic(e.target.value)}
                  placeholder="Ví dụ: Bài 4: Đơn thức đồng dạng và thu gọn"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giáo viên phụ trách
                  </label>
                  <input
                    type="text"
                    value={addTeacher}
                    onChange={(e) => setAddTeacher(e.target.value)}
                    placeholder="Thầy Hà Văn Toàn"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={addRoom}
                    onChange={(e) => setAddRoom(e.target.value)}
                    placeholder="Phòng 204"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Lưu ý chuẩn bị đồ dùng / dặn dò học sinh
                </label>
                <textarea
                  rows={2}
                  value={addPrep}
                  onChange={(e) => setAddPrep(e.target.value)}
                  placeholder="Ví dụ: Mang SGK, compa, thước kẻ, máy tính bỏ túi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm vào thời khóa biểu</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
