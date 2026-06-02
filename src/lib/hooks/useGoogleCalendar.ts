import { useState, useEffect, useCallback } from 'react';
import { ScheduleItem } from '@/components/school/CircularSchedule';

// 구글 캘린더 색상 ID를 예쁜 CSS 색상으로 매핑
const GOOGLE_COLOR_MAP: Record<string, string> = {
  '1': '#7986cb', // Lavender
  '2': '#33b679', // Sage
  '3': '#8e24aa', // Grape
  '4': '#e67c73', // Flamingo
  '5': '#f6c026', // Banana
  '6': '#f4511e', // Tangerine
  '7': '#039be5', // Peacock
  '8': '#616161', // Graphite
  '9': '#3f51b5', // Blueberry
  '10': '#0b8043', // Basil
  '11': '#d50000', // Tomato
};

interface GoogleEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  colorId?: string;
}

export function useGoogleCalendar(apiKey: string | null, calendarId: string) {
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Calculate Start and End of TODAY in RFC3339 format
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const timeMin = now.toISOString();
      
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const timeMax = endOfDay.toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('캘린더 데이터를 가져오는데 실패했습니다. API 키를 확인해주세요.');
      }

      const data = await response.json();
      
      const fetchedEvents: ScheduleItem[] = (data.items || []).map((event: GoogleEvent) => {
        // Parse time to HH:MM
        let startTime = '00:00';
        let endTime = '23:59';

        if (event.start.dateTime) {
          startTime = new Date(event.start.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
        if (event.end.dateTime) {
          endTime = new Date(event.end.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }

        // Color mapping
        const color = event.colorId && GOOGLE_COLOR_MAP[event.colorId] ? GOOGLE_COLOR_MAP[event.colorId] : '#EC4899'; // Default Pink

        return {
          id: event.id,
          title: event.summary,
          startTime,
          endTime,
          color,
          type: 'event'
        };
      });

      setEvents(fetchedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiKey, calendarId]);

  useEffect(() => {
    if (apiKey) {
      fetchEvents();
    }
  }, [apiKey, fetchEvents]);

  return { events, loading, error, refresh: fetchEvents };
}
