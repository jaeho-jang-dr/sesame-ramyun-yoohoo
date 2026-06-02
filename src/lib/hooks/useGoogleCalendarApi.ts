"use client";

import { useState, useEffect } from "react";

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";

// Type definitions for Google API
interface GoogleCalendarItem {
  id: string;
  summary?: string;
  colorId?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface GapiCalendarEvents {
  list: (request: Record<string, unknown>) => Promise<{ result: { items?: GoogleCalendarItem[] } }>;
  insert: (request: Record<string, unknown>) => Promise<unknown>;
  delete: (request: Record<string, unknown>) => Promise<unknown>;
}

interface GapiClient {
  init: (config: { apiKey: string | null; discoveryDocs: string[] }) => Promise<void>;
  getToken: () => { access_token: string } | null;
  setToken: (token: null) => void;
  calendar: { events: GapiCalendarEvents };
}

interface Gapi {
  load: (api: string, callback: () => void) => void;
  client: GapiClient;
}

interface GoogleTokenClient {
  requestAccessToken: (options: { prompt: string }) => void;
}

interface GoogleApi {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string | null;
        scope: string;
        callback: (resp: { error?: unknown }) => void;
      }) => GoogleTokenClient;
      revoke: (token: string, done: () => void) => void;
    };
  };
}

declare global {
  interface Window {
    gapi: Gapi;
    google: GoogleApi;
  }
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string; // Hex color
  colorId?: string; // Google color ID
  isGoogleEvent: boolean;
}

export function useGoogleCalendarApi() {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState<GoogleTokenClient | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Initialize config locally to retrieve from localStorage immediately if possible, 
  // but to avoid hydration mismatch, we must use useEffect or just accept the initial render is empty.
  // Using lazy initializer for useState can cause hydration issues if localStorage is read directly there in Next.js.
  // We will use a safe pattern: default empty, then effect to load.
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    // Correct way to sync with localStorage after mount
    const storedApiKey = localStorage.getItem("gcal_api_key");
    const storedClientId = localStorage.getItem("gcal_client_id");
    
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with localStorage after mount
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedClientId) setClientId(storedClientId);
  }, []);

  const saveConfig = (newApiKey: string, newClientId: string) => {
    setApiKey(newApiKey);
    setClientId(newClientId);
    localStorage.setItem("gcal_api_key", newApiKey);
    localStorage.setItem("gcal_client_id", newClientId);
    // Reload to re-init
    window.location.reload();
  };

  const gapiLoaded = () => {
    window.gapi.load("client", intializeGapiClient);
  };

  const intializeGapiClient = async () => {
    // If no API key, we can't really init effectively for private data, 
    // but we can still load the client structure.
    // However, if we wait for user input, we might need to re-trigger this.
    // For now, simpler to check inside.
    if (!localStorage.getItem("gcal_api_key")) return; 

    await window.gapi.client.init({
      apiKey: localStorage.getItem("gcal_api_key"),
      discoveryDocs: DISCOVERY_DOCS,
    });
    setGapiInited(true);
  };

  const gisLoaded = () => {
     if (!localStorage.getItem("gcal_client_id")) return;

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: localStorage.getItem("gcal_client_id"),
      scope: SCOPES,
      callback: (resp) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        setIsSignedIn(true);
        listUpcomingEvents();
      },
    });
    setTokenClient(client);
    setGisInited(true);
  };

  const handleAuthClick = () => {
    if (tokenClient === null) return;
    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        window.gapi.client.setToken(null);
        setIsSignedIn(false);
        setEvents([]);
      });
    }
  };

  const listUpcomingEvents = async () => {
    // Need to ensure gapi client is fully ready
    if (!window.gapi?.client?.calendar) return; 

    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0,0,0,0)).toISOString();
      const endOfDay = new Date(now.setHours(23,59,59,999)).toISOString();

      const request = {
        'calendarId': 'primary',
        'timeMin': startOfDay,
        'timeMax': endOfDay,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 50,
        'orderBy': 'startTime',
      };
      
      const response = await window.gapi.client.calendar.events.list(request);
      const items = response.result.items;
      
      // Map Google Events to our format
      const mappedEvents: CalendarEvent[] = (items || []).map((item: GoogleCalendarItem) => {
        // Handle full day events vs timed events
        const start = item.start.dateTime ? new Date(item.start.dateTime) : new Date(item.start.date ?? "");
        const end = item.end.dateTime ? new Date(item.end.dateTime) : new Date(item.end.date ?? "");
        
        return {
          id: item.id,
          title: item.summary || "제목 없음",
          start,
          end,
          colorId: item.colorId,
          isGoogleEvent: true
        };
      });

      setEvents(mappedEvents);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const addEvent = async (title: string, startTime: string, endTime: string) => {
    // startTime, endTime are HH:MM string in 24h format
    const today = new Date();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    // Create Date objects for today
    const startDt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startH, startM);
    const endDt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endH, endM);

    const event = {
      'summary': title,
      'start': {
        'dateTime': startDt.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': endDt.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
        await window.gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
        });
        // Refresh
        await listUpcomingEvents();
        return true;
    } catch (err) {
        console.error("Error adding event", err);
        return false;
    }
  };

  const deleteEvent = async (eventId: string) => {
      try {
          await window.gapi.client.calendar.events.delete({
              'calendarId': 'primary',
              'eventId': eventId
          });
          await listUpcomingEvents();
          return true;
      } catch (err) {
          console.error("Error deleting event", err);
          return false;
      }
  };

  return {
    gapiLoaded,
    gisLoaded,
    gapiInited,
    gisInited,
    isSignedIn,
    handleAuthClick,
    handleSignoutClick,
    events,
    refreshEvents: listUpcomingEvents,
    addGoogleEvent: addEvent,
    deleteGoogleEvent: deleteEvent,
    config: { apiKey, clientId, saveConfig }
  };
}
