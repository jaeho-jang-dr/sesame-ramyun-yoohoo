"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { CircularSchedule, ScheduleItem } from "./CircularSchedule";
import { Plus, Calendar as CalendarIcon, Clock, Settings, LogIn, LogOut, Trash2, X } from "lucide-react";
import { useGoogleCalendarApi } from "@/lib/hooks/useGoogleCalendarApi";

const DEFAULT_ROUTINE: ScheduleItem[] = [
    { id: 'sleep', title: '꿈나라 여행', startTime: '22:00', endTime: '07:00', color: '#A78BFA', type: 'basic' },
    { id: 'school', title: '설레는 학교', startTime: '08:30', endTime: '13:30', color: '#60A5FA', type: 'basic' },
    { id: 'breakfast', title: '맛있는 아침', startTime: '07:30', endTime: '08:00', color: '#FBBF24', type: 'basic' },
    { id: 'lunch', title: '점심시간', startTime: '12:30', endTime: '13:30', color: '#F472B6', type: 'basic' },
    { id: 'dinner', title: '가족과 저녁', startTime: '18:30', endTime: '19:30', color: '#34D399', type: 'basic' },
];

export function DailyPlanner() {
    // Date State
    const [currentDate, setCurrentDate] = useState("");

    // Google API Hook
    const { 
        gapiLoaded, gisLoaded, gapiInited, isSignedIn, 
        handleAuthClick, handleSignoutClick, events: googleEvents, 
        addGoogleEvent, deleteGoogleEvent, config 
    } = useGoogleCalendarApi();

    // Local manual items (when not signed in or for extra items)
    const [manualItems, setManualItems] = useState<ScheduleItem[]>([]);
    
    // UI States
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(config.apiKey);
    const [clientIdInput, setClientIdInput] = useState(config.clientId);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [startTime, setStartTime] = useState("14:00");
    const [endTime, setEndTime] = useState("15:00");
    const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

    // Initialize Date
    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        // eslint-disable-next-line
        setCurrentDate(now.toLocaleDateString('ko-KR', options));
    }, []);

    // Sync input states with fresh config
    useEffect(() => {
        if (config.apiKey) setApiKeyInput(config.apiKey);
        if (config.clientId) setClientIdInput(config.clientId);
    }, [config.apiKey, config.clientId]);

    // Combine Items
    // Map Google Events (CalendarEvent) to ScheduleItem
    const mappedGoogleItems: ScheduleItem[] = googleEvents.map(e => ({
        id: e.id,
        title: e.title,
        startTime: e.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        endTime: e.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        color: e.colorId ? '#FB7185' : '#8B5CF6', // Simplified color logic
        type: 'event'
    }));

    const allItems = [...DEFAULT_ROUTINE, ...manualItems, ...mappedGoogleItems];

    const sortItems = (a: ScheduleItem, b: ScheduleItem) => {
        return a.startTime.localeCompare(b.startTime);
    };

    const handleAddEvent = async () => {
        if (!newEventTitle) return;

        if (isSignedIn) {
            // Add to Google Calendar
            const success = await addGoogleEvent(newEventTitle, startTime, endTime);
            if (success) {
                setNewEventTitle("");
                // Google events will auto-refresh
            } else {
                alert("구글 캘린더에 일정을 추가하지 못했습니다.");
            }
        } else {
            // Add Locally
            const newItem: ScheduleItem = {
                id: Date.now().toString(),
                title: newEventTitle,
                startTime,
                endTime,
                color: '#FB7185',
                type: 'event'
            };
            setManualItems(prev => [...prev, newItem].sort(sortItems));
            setNewEventTitle("");
        }
    };

    const handleDelete = async (item: ScheduleItem) => {
        if (item.type === 'basic') return; // Cannot delete routine

        const isGoogle = googleEvents.some(e => e.id === item.id);
        
        if (isGoogle && isSignedIn) {
            if (confirm(`'${item.title}' 일정을 구글 캘린더에서 삭제할까요?`)) {
                await deleteGoogleEvent(item.id);
                setSelectedItem(null);
            }
        } else {
            // Local delete
            if (confirm(`'${item.title}' 일정을 삭제할까요?`)) {
                setManualItems(prev => prev.filter(i => i.id !== item.id));
                setSelectedItem(null);
            }
        }
    };

    return (
        <div className="space-y-8">
            <Script src="https://apis.google.com/js/api.js" onLoad={gapiLoaded} strategy="lazyOnload" />
            <Script src="https://accounts.google.com/gsi/client" onLoad={gisLoaded} strategy="lazyOnload" />

            {/* Header Date Display */}
            <div className="text-center bg-white p-4 rounded-full shadow-sm border border-gray-100 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                    {currentDate}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Circular Planner */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                오늘의 생활 계획표
                            </h3>
                            <div className="flex gap-2">
                                {isSignedIn ? (
                                    <button 
                                        onClick={handleSignoutClick}
                                        className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-full font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                                    >
                                        <LogOut className="w-3 h-3" /> 로그아웃
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleAuthClick}
                                        disabled={!apiKeyInput || !clientIdInput}
                                        className="text-xs bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                                    >
                                        <LogIn className="w-3 h-3" /> 구글 로그인
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                                    title="설정"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm animate-fade-in-down">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-700">⚙️ 구글 연동 설정</h4>
                                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4"/></button>
                                </div>
                                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                                    일정 연동을 위해 <strong>API Key</strong>와 <strong>Client ID</strong>가 필요합니다.
                                    <br/>(Google Cloud Console &gt; Credentials에서 생성 가능)
                                </p>
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="API Key" 
                                        value={apiKeyInput}
                                        onChange={(e) => setApiKeyInput(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Client ID (Web application)" 
                                        value={clientIdInput}
                                        onChange={(e) => setClientIdInput(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                                    />
                                    <button 
                                        onClick={() => { config.saveConfig(apiKeyInput, clientIdInput); setShowSettings(false); }}
                                        className="w-full py-2 bg-gray-800 text-white rounded-lg font-bold text-xs hover:bg-gray-900"
                                    >
                                        설정 저장 및 새로고침
                                    </button>
                                </div>
                            </div>
                        )}

                        <CircularSchedule 
                            items={allItems.sort(sortItems)} 
                            onItemClick={(item) => setSelectedItem(item)}
                        />
                        
                        {/* Selected Item Detail Modal/Panel */}
                        {selectedItem && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-purple-100 w-3/4 text-center z-20 animation-pop-in">
                                <h4 className="font-black text-xl text-gray-800 mb-1">{selectedItem.title}</h4>
                                <p className="text-purple-600 font-bold mb-4">{selectedItem.startTime} ~ {selectedItem.endTime}</p>
                                <div className="flex justify-center gap-2">
                                    <button 
                                        onClick={() => setSelectedItem(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200"
                                    >
                                        닫기
                                    </button>
                                    {selectedItem.type === 'event' && (
                                        <button 
                                            onClick={() => handleDelete(selectedItem)}
                                            className="px-4 py-2 bg-red-100 text-red-500 rounded-xl font-bold text-sm hover:bg-red-200 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> 삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Add Event Form */}
                        <div className="mt-8 p-4 bg-white border border-purple-100 shadow-sm rounded-2xl">
                            <h4 className="font-bold text-purple-800 mb-3 text-sm flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                {isSignedIn ? "구글 캘린더에 일정 추가" : "나만의 일정 추가"}
                            </h4>
                            <div className="space-y-3">
                                <input 
                                    type="text"
                                    placeholder={isSignedIn ? "일정 제목 입력 (구글 캘린더에 저장됨)" : "일정 제목 (예: 학원, 독서)"}
                                    value={newEventTitle}
                                    onChange={e => setNewEventTitle(e.target.value)}
                                    className="w-full p-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/50"
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="time" 
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        className="flex-1 p-2 border border-purple-200 rounded-lg text-sm bg-purple-50/50"
                                    />
                                    <span className="self-center text-purple-400">~</span>
                                    <input 
                                        type="time" 
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="flex-1 p-2 border border-purple-200 rounded-lg text-sm bg-purple-50/50"
                                    />
                                </div>
                                <button 
                                    onClick={handleAddEvent}
                                    disabled={!gapiInited && isSignedIn}
                                    className="w-full py-2 bg-purple-500 text-white rounded-lg font-bold text-sm hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg active:scale-95 transform duration-100 disabled:opacity-50"
                                >
                                    {isSignedIn ? "구글 캘린더에 추가하기" : "일정 추가하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Google Calendar Embed */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            구글 캘린더
                            <span className="text-xs font-normal text-gray-400 ml-auto bg-gray-50 px-2 py-1 rounded-md">
                                {isSignedIn ? "✅ 연동됨" : "🔒 읽기 전용 뷰"}
                            </span>
                        </h3>
                        
                        {/* Google Calendar Embed */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 h-[600px] shadow-inner relative">
                             {/* Overlay hint if not interactive */}
                             {!isSignedIn && (
                                <div className="absolute top-0 w-full bg-blue-500/10 text-blue-600 text-xs text-center py-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    로그인하면 여기서 직접 일정을 수정할 수 있어요
                                </div>
                             )}
                            <iframe 
                                src={`https://calendar.google.com/calendar/embed?src=49c43e1221d6eee107b35c759976a1b62c72354689a6bac5fac654dbef07d526%40group.calendar.google.com&ctz=Asia%2FSeoul`} 
                                style={{border: 0}} 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no"
                                title="Google Calendar"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
