if (!document.getElementById('ai-pomodoro-widget')) {
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = `
    <div id="ai-pomodoro-widget">
      <style>
        #ai-pomodoro-widget {
          position: fixed; top: 40px; right: 20px; width: 440px;
          background: rgba(18, 18, 24, 0.94);
          backdrop-filter: blur(16px);
          color: #e2e2e9; font-family: 'Inter', 'Google Sans', 'Segoe UI', Roboto, sans-serif;
          padding: 18px; border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 15px rgba(255, 117, 143, 0.15);
          z-index: 10000; border: 1px solid rgba(255, 117, 143, 0.25);
          max-height: 88vh; overflow-y: auto; scrollbar-width: thin;
          scrollbar-color: #ff758f #1a1a24;
        }
        #ai-pomodoro-widget::-webkit-scrollbar { width: 5px; }
        #ai-pomodoro-widget::-webkit-scrollbar-track { background: #14141c; border-radius: 4px; }
        #ai-pomodoro-widget::-webkit-scrollbar-thumb { background: #ff758f; border-radius: 4px; }

        #ai-pomodoro-widget h3 {
          margin-top: 0; color: #ff758f; font-size: 16px; font-weight: 700;
          text-align: center; letter-spacing: 0.5px; margin-bottom: 14px;
        }
        #ai-pomodoro-widget label {
          font-size: 11px; font-weight: 600; display: block; margin-top: 10px;
          color: #ffb3c1; text-transform: uppercase; letter-spacing: 0.5px;
        }
        
        #ai-pomodoro-widget input[type="text"],
        #ai-pomodoro-widget input[type="email"],
        #ai-pomodoro-widget input[type="password"],
        #ai-pomodoro-widget input[type="number"],
        #ai-pomodoro-widget input[type="date"],
        #ai-pomodoro-widget input[type="time"],
        #ai-pomodoro-widget select {
          width: 100% !important; padding: 8px 11px !important; box-sizing: border-box !important;
          border: 1px solid #2e2e3d !important; border-radius: 8px !important;
          font-size: 12px !important; margin-top: 4px !important; background: #161622 !important;
          color: #f1f1f6 !important; display: block !important; transition: border-color 0.2s ease;
        }
        #ai-pomodoro-widget input:focus, #ai-pomodoro-widget select:focus {
          border-color: #ff758f !important; outline: none; box-shadow: 0 0 6px rgba(255, 117, 143, 0.3);
        }
        
        .shiny-btn {
          position: relative; background: linear-gradient(135deg, #ff4d6d, #c9184a);
          color: white; border: none; padding: 10px; margin-top: 8px;
          border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 11.5px;
          overflow: hidden; box-shadow: 0 4px 14px rgba(255, 77, 109, 0.35);
          transition: all 0.25s ease; width: 100%; text-align: center;
        }
        .shiny-btn::after {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(30deg); transition: transform 0.6s ease;
        }
        .shiny-btn:hover::after { transform: translate(100%, 100%) rotate(30deg); }
        .shiny-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(255, 77, 109, 0.5); }

        #startTimerBtn { background: linear-gradient(135deg, #2b9348, #007200); }
        #resumeTimerBtn { background: linear-gradient(135deg, #0077b6, #03045e); }
        #stopTimerBtn { background: linear-gradient(135deg, #d90429, #9b021c); }
        
        .timer-display { font-size: 28px; font-weight: 800; text-align: center; margin: 10px 0; color: #ff758f; letter-spacing: 1px; }
        .row-group { display: flex; gap: 8px; }
        .row-group > div { flex: 1; }
        .guest-dropdown { position: relative; margin-top: 4px; }
        .guest-dropdown summary { cursor: pointer; background: #161622; border: 1px solid #2e2e3d; border-radius: 8px; padding: 8px 11px; font-size: 12px; color: #f1f1f6; list-style: none; }
        .guest-dropdown summary::-webkit-details-marker { display: none; }
        .guest-options { position: absolute; left: 0; right: 0; z-index: 2; background: #161622; border: 1px solid #2e2e3d; border-radius: 8px; padding: 6px; margin-top: 4px; box-shadow: 0 8px 20px rgba(0,0,0,0.45); }
        .guest-option { display: block; padding: 6px; font-size: 11px; color: #f1f1f6; cursor: pointer; }
        .guest-option input { margin-right: 6px; accent-color: #ff758f; }
        
        /* Glass Panel Cards */
        .auth-card, .timezone-card, .notification-box, .chat-box, .pomodoro-drawer {
          background: rgba(22, 22, 32, 0.85); border: 1px solid rgba(255, 117, 143, 0.2);
          border-radius: 10px; padding: 12px; margin-top: 10px;
        }

        /* Time Zone Panel Styles */
        .tz-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 6px;
        }
        .tz-card-item {
          background: #101018; border: 1px solid #282838; border-radius: 6px;
          padding: 6px 8px; text-align: center;
        }
        .tz-card-item span { display: block; font-size: 9.5px; color: #a0a0b0; font-weight: 600; }
        .tz-card-item strong { display: block; font-size: 12px; color: #ff758f; margin-top: 2px; }

        #aiResultsPanel {
          margin-top: 10px; background: #161622; border: 1px solid #2e2e3d;
          border-radius: 8px; padding: 10px; font-size: 11.5px; color: #c4c4d0;
          max-height: 280px; overflow-y: auto; display: none; text-align: left;
        }
        #aiResultsPanel h4 { margin: 0 0 6px 0; color: #ff758f; font-size: 12.5px; }

        .ai-task-btn {
          display: block; width: 100%; text-align: left; background: #101018; border: 1px solid #282838;
          padding: 9px 12px; margin-top: 6px; border-radius: 6px; cursor: pointer; color: #fff; font-size: 11.5px;
          transition: all 0.2s; box-sizing: border-box;
        }
        .ai-task-btn:hover { border-color: #ff758f; background: #1a1a28; transform: translateX(2px); }
        .task-high { border-left: 5px solid #ef4444; }
        .task-med { border-left: 5px solid #f59e0b; }
        .task-low { border-left: 5px solid #10b981; }

        #cornerToastContainer {
          position: fixed; top: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 8px;
        }
        .corner-toast {
          background: #1a1a24; border: 1px solid #ff758f; color: #fff; padding: 12px 16px;
          border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); font-size: 12px; width: 280px;
          animation: slideIn 0.3s ease; border-left: 5px solid #ff4d6d;
        }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .chat-messages {
          max-height: 95px; overflow-y: auto; margin-bottom: 6px; padding: 8px;
          background: #101018; border-radius: 6px; color: #d0d0dc; line-height: 1.4; border: 1px solid #222230;
        }
        .chat-input-container { display: flex; gap: 6px; margin-top: 6px; align-items: center; }
        .chat-input-container input[type="text"] { flex: 1 !important; margin-top: 0 !important; }
        .chat-send-btn {
          width: 65px !important; margin-top: 0 !important; background-color: #7209b7 !important;
          height: 32px; border-radius: 6px; color:white; border:none; font-weight:600; cursor:pointer;
        }
        
        .typing-indicator { font-size: 10px; color: #ffb3c1; font-style: italic; height: 14px; margin-top: 2px; }
        hr { border: 0; border-top: 1px solid #2b2b3d; margin: 12px 0; }
        a.chat-link { color: #4cc9f0; text-decoration: underline; font-weight: 600; word-break: break-all; }
      </style>

      <div id="cornerToastContainer"></div>

      <h3>Sakura Enterprise AI</h3>

      <!-- Sign-In / Authentication Panel -->
      <div class="auth-card" id="authCardContainer">
        <label style="margin-top:0; color:#ff758f;">Live User Sign-In</label>
        <div id="authStatusMsg" style="font-size: 11px; color: #a0a0b0; margin-bottom: 6px;">Sign in with your credentials to enable live tracking.</div>
        <div id="authFormSection">
          <input type="text" id="authUsernameInput" placeholder="Enter your name..." style="margin-bottom:6px;" />
          <input type="email" id="authEmailInput" placeholder="Google email address..." autocomplete="email" style="margin-bottom:6px;" />
          <input type="password" id="authPasswordInput" placeholder="Enter password..." style="margin-bottom:6px;" />
          <button class="shiny-btn" id="authSignInBtn" style="margin-top:0;">Sign In / Register</button>
        </div>
      </div>

      <!-- Time Zone Panel -->
      <div class="timezone-card" id="timezoneCard">
        <label style="margin-top:0; color:#ff758f;">World Clocks & Time Zones</label>
        <div class="tz-grid">
          <div class="tz-card-item"><span>UTC</span><strong id="tzClockUTC">--:--:--</strong></div>
          <div class="tz-card-item"><span>EST (New York)</span><strong id="tzClockEST">--:--:--</strong></div>
          <div class="tz-card-item"><span>CST (Chicago)</span><strong id="tzClockCST">--:--:--</strong></div>
          <div class="tz-card-item"><span>PST (Los Angeles)</span><strong id="tzClockPST">--:--:--</strong></div>
        </div>
        
        <label style="margin-top:8px;">Convert Time:</label>
        <div class="row-group">
          <div>
            <input type="time" id="tzConvertTime" value="12:00" />
          </div>
          <div>
            <select id="tzConvertFrom">
              <option value="America/Chicago">CST (Local)</option>
              <option value="America/New_York">EST</option>
              <option value="America/Los_Angeles">PST</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">GMT / BST</option>
              <option value="Asia/Tokyo">JST</option>
            </select>
          </div>
        </div>
        <div id="tzConversionOutput" style="font-size:10.5px; color:#ffb3c1; margin-top:6px; line-height:1.4;">
          Converted times will display here...
        </div>
      </div>
      
      <label>Enter Tasks (comma-separated):</label>
      <input type="text" id="multiTasksInput" placeholder="Walk Dog, Linear Algebra, Do Laundry" value="Walk Dog, Linear Algebra, Do Laundry" />

      <button class="shiny-btn" id="aiAnalyzeBtn">Generate AI Prioritized Tasks</button>
      
      <div id="aiResultsPanel" style="display:block;">
        <h4 id="panelTitle">AI Intelligent Prioritized Task Queue</h4>
        <div id="panelContent">
          <div style="color: #888899; font-style: italic;">Enter tasks above. AI automatically organizes them into High (Red), Medium (Yellow), and Low (Green) priority tiers.</div>
        </div>
      </div>

      <div class="pomodoro-drawer" id="pomodoroDrawer" style="display:none;">
        <label style="color:#ff758f; margin-top:0;">Active Session: <span id="activeTaskTitleLabel">None</span></label>
        <div class="row-group">
          <div>
            <label>Focus (Mins):</label>
            <input type="number" id="focusTimeInput" value="25" min="1" max="120" />
          </div>
          <div>
            <label>Break (Mins):</label>
            <input type="number" id="breakTimeInput" value="0" min="0" max="60" />
          </div>
        </div>
        <div class="timer-display" id="timerDisplay">25:00</div>
        <div class="row-group" style="margin-top: 6px;">
          <button class="shiny-btn" id="startTimerBtn" style="margin-top:0;">Start</button>
          <button class="shiny-btn" id="resumeTimerBtn" style="margin-top:0; display:none;">Resume</button>
          <button class="shiny-btn" id="stopTimerBtn" style="margin-top:0;">Stop</button>
        </div>
      </div>

      <hr>

      <label>Session Agenda / Topic:</label>
      <input type="text" id="meetingTitleInput" value="Sprint Planning Sync" />

      <div class="row-group">
        <div>
          <label>Date:</label>
          <input type="date" id="meetingDateInput" />
        </div>
        <div>
          <label>Timezone:</label>
          <select id="timezoneSelect">
            <option value="UTC">UTC</option>
            <option value="America/New_York">EST (-5)</option>
            <option value="America/Chicago" selected>CST (-6)</option>
            <option value="America/Los_Angeles">PST (-8)</option>
            <option value="Europe/Berlin">CET (+1)</option>
          </select>
        </div>
      </div>

      <div class="row-group">
        <div>
          <label>Start Time:</label>
          <input type="time" id="meetingStartTime" value="12:00" />
        </div>
        <div>
          <label>End Time:</label>
          <input type="time" id="meetingEndTime" value="12:30" />
        </div>
      </div>

      <div class="notification-box" id="calendarInviteBox">
        <label style="margin-top:0; color:#ff758f;">Calendar Invitees</label>
        <input type="email" id="inviteeEmailInput" placeholder="Guest email address (add more with commas)" autocomplete="email" />
        <label class="guest-option" style="margin-top:8px; text-transform:none; letter-spacing:0; color:#f1f1f6;">
          <input type="checkbox" id="noGuestsOption"> None — create a Calendar task without guests or a Meet link
        </label>
        <div style="font-size: 10.5px; color: #a0a0b0; margin-top: 6px; line-height: 1.4;">
          Type one or more guest email addresses, separated by commas. Choose None for a Calendar task without a Meet link.
        </div>
        <button class="shiny-btn" id="aiMeetingBtn" style="background: linear-gradient(135deg, #4b2a73, #24113d);">Schedule Meeting & Generate Room</button>
        <div id="calendarSyncStatus" style="font-size: 10.5px; color: #a0a0b0; margin-top: 6px;">Calendar is not connected.</div>
      </div>

      <!-- Real-Time Performance Summary -->
      <div class="notification-box">
        <label style="margin-top:0; color:#ff758f;">Performance & Efficiency Summary</label>
        <div style="font-size: 11px; color: #c4c4d0; margin-top: 4px; line-height: 1.4;" id="privateRecapContent">
          • <b>Status:</b> Please sign in to begin tracking live metrics.<br>
          • <b>Timer Efficiency Score:</b> 100%<br>
          • <b>Strengths:</b> Organized scheduling.<br>
          • <b>Next Steps:</b> Complete your top priority tasks.
        </div>
      </div>

      <!-- Email Reminder Settings -->
      <div class="notification-box" id="reminderSettingsBox">
        <label style="margin-top:0; color:#ff758f;">Email Reminders</label>
        <div style="font-size: 10.5px; color: #a0a0b0; margin: 4px 0 6px; line-height: 1.4;">
          Get a reminder before meetings and task deadlines.
        </div>
        <input type="email" id="reminderEmailInput" placeholder="Sign in above to use your Google email" autocomplete="email" readonly />
        <div class="row-group">
          <div>
            <label>Meeting reminder (mins):</label>
            <input type="number" id="meetingReminderMinutesInput" value="10" min="0" max="1440" />
          </div>
          <div>
            <label>Task reminder (mins):</label>
            <input type="number" id="taskReminderMinutesInput" value="30" min="0" max="1440" />
          </div>
        </div>
        <button class="shiny-btn" id="saveReminderSettingsBtn">Save Reminder Settings</button>
        <div id="reminderStatusMsg" style="font-size: 10.5px; color: #a0a0b0; margin-top: 6px;">Reminders are off until an email is saved.</div>
      </div>

      <!-- AI Assistant Section -->
      <div class="chat-box">
        <label style="margin-top:0; color:#ff758f;">Sakura AI Assistant</label>
        <div class="chat-messages" id="chatMessages">
          <div><b>Sakura AI:</b> Hello, user! If you have questions about this, let me know. I can answer that part : )</div>
        </div>
        <div class="typing-indicator" id="aiTypingIndicator"></div>
        <div class="chat-input-container">
          <input type="text" id="chatUserInput" placeholder="Ask AI or say 'book me a google meet'..." />
          <button class="chat-send-btn" id="aiChatSendBtn">Send</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  const todayStr = new Date().toISOString().split('T')[0];
  document.getElementById('meetingDateInput').value = todayStr;
 
  window.currentUser = null;
  window.userEmail = '';
  window.googleCalendarEvents = [];
  window.scheduledSessionsStore = [];
  window.activeTaskSession = null;
  window.userMetrics = {
    completedTasks: 0,
    interruptions: 0,
    efficientSeconds: 0,
    inefficientSeconds: 0
  };

  localStorage.removeItem('sakuraReminderEmail');
  const storedMeetingMinutes = parseInt(localStorage.getItem('sakuraMeetingReminderMinutes'), 10);
  const storedTaskMinutes = parseInt(localStorage.getItem('sakuraTaskReminderMinutes'), 10);
  const reminderSettings = {
    email: '',
    meetingMinutes: Number.isNaN(storedMeetingMinutes) ? 10 : Math.max(0, Math.min(1440, storedMeetingMinutes)),
    taskMinutes: Number.isNaN(storedTaskMinutes) ? 30 : Math.max(0, Math.min(1440, storedTaskMinutes))
  };
  const reminderTimers = [];
  const reminderEmailInput = document.getElementById('reminderEmailInput');
  const meetingReminderMinutesInput = document.getElementById('meetingReminderMinutesInput');
  const taskReminderMinutesInput = document.getElementById('taskReminderMinutesInput');
  const reminderStatusMsg = document.getElementById('reminderStatusMsg');
  const inviteeEmailInput = document.getElementById('inviteeEmailInput');
  const noGuestsOption = document.getElementById('noGuestsOption');
  const calendarSyncStatus = document.getElementById('calendarSyncStatus');
  let pendingCalendarAction = 'book';

  reminderEmailInput.value = reminderSettings.email;
  meetingReminderMinutesInput.value = reminderSettings.meetingMinutes;
  taskReminderMinutesInput.value = reminderSettings.taskMinutes;

  function saveReminderSettings() {
    const email = window.userEmail;
    const meetingMinutes = Math.min(1440, Math.max(0, parseInt(meetingReminderMinutesInput.value, 10) || 0));
    const taskMinutes = Math.min(1440, Math.max(0, parseInt(taskReminderMinutesInput.value, 10) || 0));

    if (!email || !email.includes('@')) {
      showCornerToast('Email Required', 'Enter a valid email address to enable reminders.');
      return false;
    }

    reminderSettings.email = email;
    reminderSettings.meetingMinutes = meetingMinutes;
    reminderSettings.taskMinutes = taskMinutes;
    localStorage.setItem('sakuraMeetingReminderMinutes', meetingMinutes);
    localStorage.setItem('sakuraTaskReminderMinutes', taskMinutes);
    reminderEmailInput.value = email;
    meetingReminderMinutesInput.value = meetingMinutes;
    taskReminderMinutesInput.value = taskMinutes;
    reminderStatusMsg.innerText = `Reminders enabled for ${email}.`;
    reminderStatusMsg.style.color = '#7ee787';
    return true;
  }

  function scheduleReminder(type, title, startAt, minutesBefore) {
    if (!reminderSettings.email || minutesBefore <= 0) return;
    const reminderAt = new Date(startAt).getTime() - minutesBefore * 60000;
    const delay = reminderAt - Date.now();
    if (delay <= 0) {
      showCornerToast('Reminder Not Scheduled', `${title} starts too soon for this reminder window.`);
      return;
    }

    const timer = setTimeout(() => {
      const message = `${title} starts in ${minutesBefore} minute${minutesBefore === 1 ? '' : 's'}.`;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Sakura AI Reminder', { body: message });
      }
      showCornerToast(`${type} Reminder`, message);
    }, delay);
    reminderTimers.push(timer);
    showCornerToast('Reminder Scheduled', `${type} reminder set for ${reminderSettings.email}.`);
  }

  document.getElementById('saveReminderSettingsBtn').addEventListener('click', () => {
    if (saveReminderSettings() && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  });
  if (reminderSettings.email) reminderStatusMsg.innerText = `Reminders enabled for ${reminderSettings.email}.`;

  function getSelectedInvitees() {
    if (noGuestsOption.checked) return [];
    return [...new Set(inviteeEmailInput.value
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0))];
  }

  noGuestsOption.addEventListener('change', () => {
    inviteeEmailInput.disabled = noGuestsOption.checked;
    if (noGuestsOption.checked) inviteeEmailInput.value = '';
  });
  inviteeEmailInput.addEventListener('input', () => {
    if (inviteeEmailInput.value.trim()) noGuestsOption.checked = false;
  });

  // --- GOOGLE OAUTH & CALENDAR API CONFIGURATION ---
  const GOOGLE_CLIENT_ID = '591106372392-elt5e39788sp2l0q6raq92gnpbmf7obj.apps.googleusercontent.com';
  let tokenClient;

  function initGoogleOAuth() {
    if (window.google && window.google.accounts) {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: async (tokenResponse) => {
          if (tokenResponse.access_token) {
            if (pendingCalendarAction === 'sync') {
              await syncGoogleCalendar(tokenResponse.access_token);
            } else if (pendingCalendarAction === 'schedule') {
              await syncGoogleCalendar(tokenResponse.access_token);
              await createGoogleMeetEvent(tokenResponse.access_token);
            } else {
              await createGoogleMeetEvent(tokenResponse.access_token);
            }
            pendingCalendarAction = 'book';
          } else if (tokenResponse.error) {
            showCornerToast('Google Access Denied', tokenResponse.error_description || tokenResponse.error);
          }
        },
        error_callback: (error) => {
          showCornerToast('Google Access Denied', error.message || 'Add this Google account as an OAuth test user.');
        }
      });
    }
  }
  setTimeout(initGoogleOAuth, 1000);

  async function syncGoogleCalendar(accessToken) {
    try {
      const timeMin = new Date().toISOString();
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=100`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error(`Calendar sync failed (${response.status})`);
      const data = await response.json();
      window.googleCalendarEvents = data.items || [];
      window.scheduledSessionsStore = window.googleCalendarEvents
        .filter(event => event.start && event.end)
        .map(event => ({
          title: event.summary || 'Untitled event',
          startDate: new Date(event.start.dateTime || event.start.date),
          endDate: new Date(event.end.dateTime || event.end.date)
        }));
      const date = document.getElementById('meetingDateInput').value;
      const start = document.getElementById('meetingStartTime').value;
      const end = document.getElementById('meetingEndTime').value;
      const proposedStart = new Date(`${date}T${start}:00`);
      const proposedEnd = new Date(`${date}T${end}:00`);
      const hasConflict = window.scheduledSessionsStore.some(event => proposedStart < event.endDate && proposedEnd > event.startDate);
      calendarSyncStatus.innerText = hasConflict
        ? 'Synced. The selected meeting time conflicts with an existing event.'
        : `Synced ${window.scheduledSessionsStore.length} upcoming Calendar events. No conflict found.`;
      calendarSyncStatus.style.color = hasConflict ? '#ffb3c1' : '#7ee787';
      showCornerToast('Calendar Synced', 'Existing meetings are now included in conflict checks.');
    } catch (error) {
      calendarSyncStatus.innerText = error.message;
      showCornerToast('Calendar Sync Failed', 'Check Google Calendar permissions and try again.');
    }
  }

  async function createGoogleMeetEvent(accessToken) {
    const title = document.getElementById('meetingTitleInput').value.trim() || window.activeTaskSession || 'Sakura AI Scheduled Sync';
    const date = document.getElementById('meetingDateInput').value;
    const start = document.getElementById('meetingStartTime').value;
    const end = document.getElementById('meetingEndTime').value;
    const timeZone = document.getElementById('timezoneSelect').value;
    const startDate = new Date(`${date}T${start}:00`);
    const endDate = new Date(`${date}T${end}:00`);

    if (!date || !start || !end || Number.isNaN(startDate.getTime()) || startDate <= new Date()) {
      showCornerToast('Choose a Future Time', 'The meeting start time has passed. Please choose an appropriate future time.');
      return;
    }
    if (endDate <= startDate) {
      showCornerToast('Invalid Meeting Time', 'The end time must be after the start time.');
      return;
    }

    const startTime = `${date}T${start}:00`;
    const endTime = `${date}T${end}:00`;
    const taskDetails = document.getElementById('multiTasksInput').value.trim() || 'None provided';
    const taskDeadline = date || 'None provided';
    const selectedInvitees = getSelectedInvitees();
    const invalidInvitee = selectedInvitees.find(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (invalidInvitee) {
      showCornerToast('Invalid Guest Email', `Please check this guest email: ${invalidInvitee}`);
      return;
    }
    const isTask = selectedInvitees.length === 0;
    const reminderMinutes = isTask ? reminderSettings.taskMinutes : reminderSettings.meetingMinutes;
    const description = `Scheduled by Sakura AI. Agenda/topic: ${title}. Tasks: ${taskDetails}. Task deadline: ${taskDeadline}.`;

    if (!window.userEmail) {
      showCornerToast('Sign-In Required', 'Sign in with your Google email before booking a Google Meet.');
      return;
    }

    const hasConflict = window.scheduledSessionsStore.some(event => startDate < event.endDate && endDate > event.startDate);
    if (hasConflict) {
      showCornerToast('Schedule Conflict', 'This time is already occupied in Google Calendar. Choose another time.');
      return;
    }
    scheduleReminder(isTask ? 'Task' : 'Google Meet', title, startDate, reminderMinutes);

    const eventPayload = {
      summary: title,
      description,
      start: { dateTime: startTime, timeZone },
      end: { dateTime: endTime, timeZone }
    };
    if (reminderMinutes > 0) {
      eventPayload.reminders = {
        useDefault: false,
        overrides: [{ method: 'email', minutes: reminderMinutes }, { method: 'popup', minutes: reminderMinutes }]
      };
    }
    if (selectedInvitees.length > 0) {
      eventPayload.attendees = selectedInvitees.map(email => ({ email }));
      eventPayload.conferenceData = {
        createRequest: {
          requestId: 'sakura-' + Date.now(),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      };
    }

    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });

      if (!res.ok) throw new Error(`Calendar event creation failed (${res.status})`);
      const data = await res.json();
      const acceptedGuests = (data.attendees || [])
        .filter(attendee => selectedInvitees.includes(attendee.email) && attendee.responseStatus !== 'declined')
        .map(attendee => attendee.email);
      const missingGuests = selectedInvitees.filter(email => !acceptedGuests.includes(email));
      window.scheduledSessionsStore.push({
        title: data.summary || title,
        startDate,
        endDate
      });
      const meetUrl = data.hangoutLink;
      const msgs = document.getElementById('chatMessages');

      if (meetUrl) {
        const guestStatus = missingGuests.length > 0
          ? `Google did not accept invitations for: ${missingGuests.join(', ')}.`
          : `Calendar invitations were sent to ${selectedInvitees.length} guest${selectedInvitees.length === 1 ? '' : 's'}.`;
        msgs.innerHTML += `<div style="margin-top: 4px; color: #4cc9f0;"><b>Sakura AI:</b> Done! Your Google Meet is booked: <a class="chat-link" href="${meetUrl}" target="_blank">${meetUrl}</a><br>${guestStatus}${reminderMinutes > 0 ? ` The organizer reminder is set for ${reminderMinutes} minutes before the meeting.` : ' No organizer reminder was set.'}</div>`;
        showCornerToast("Google Meet Created!", `Calendar invitation sent to ${selectedInvitees.length} guest${selectedInvitees.length === 1 ? '' : 's'}.`);
      } else {
        msgs.innerHTML += `<div style="margin-top: 4px; color: #7ee787;"><b>Sakura AI:</b> Calendar task created without a Google Meet link${reminderMinutes > 0 ? ` with a ${reminderMinutes}-minute email reminder` : ' and no email reminder'}.</div>`;
      }
      calendarSyncStatus.innerText = 'Calendar event created and reminder configured.';
      calendarSyncStatus.style.color = '#7ee787';
      msgs.scrollTop = msgs.scrollHeight;
    } catch (err) {
      console.error(err);
      showCornerToast("Calendar Error", err.message || "Failed to book Google Meet event.");
    }
  }

  function triggerGoogleBooking(action = 'book') {
    pendingCalendarAction = action;
    if (!tokenClient) {
      showCornerToast("Google Auth Error", "Google SDK not initialized or Client ID missing.");
      return;
    }
    tokenClient.requestAccessToken();
  }

  // --- UI & TIME UTILITIES ---
  function updateWorldClocks() {
    const now = new Date();
    const formatOpts = (timeZone) => new Intl.DateTimeFormat('en-US', {
      timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);

    document.getElementById('tzClockUTC').innerText = formatOpts('UTC');
    document.getElementById('tzClockEST').innerText = formatOpts('America/New_York');
    document.getElementById('tzClockCST').innerText = formatOpts('America/Chicago');
    document.getElementById('tzClockPST').innerText = formatOpts('America/Los_Angeles');
  }
  setInterval(updateWorldClocks, 1000);
  updateWorldClocks();

  function convertTimeZone() {
    const timeVal = document.getElementById('tzConvertTime').value;
    const sourceZone = document.getElementById('tzConvertFrom').value;
    const outputDiv = document.getElementById('tzConversionOutput');

    if (!timeVal) return;
    const [hours, minutes] = timeVal.split(':');
    const today = new Date();
    const refDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes)));

    const getFormattedTime = (tz) => new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true
    }).format(refDate);

    outputDiv.innerHTML = `
      • <b>UTC:</b> ${getFormattedTime('UTC')} | <b>EST:</b> ${getFormattedTime('America/New_York')}<br>
      • <b>CST:</b> ${getFormattedTime('America/Chicago')} | <b>PST:</b> ${getFormattedTime('America/Los_Angeles')}<br>
      • <b>GMT:</b> ${getFormattedTime('Europe/London')} | <b>JST:</b> ${getFormattedTime('Asia/Tokyo')}
    `;
  }
  document.getElementById('tzConvertTime').addEventListener('change', convertTimeZone);
  document.getElementById('tzConvertFrom').addEventListener('change', convertTimeZone);
  convertTimeZone();

  function playAmbientChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log("Audio Context requires user gesture.");
    }
  }

  function showCornerToast(title, message) {
    playAmbientChime();
    const container = document.getElementById('cornerToastContainer');
    const toast = document.createElement('div');
    toast.className = 'corner-toast';
    toast.innerHTML = `<b>${title}</b><br>${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  function updateRealTimePerformance(statusText, strengthMsg, nextStepMsg) {
    const recap = document.getElementById('privateRecapContent');
    const totalSecs = window.userMetrics.efficientSeconds + window.userMetrics.inefficientSeconds;
    const efficiencyPct = totalSecs > 0 ? Math.round((window.userMetrics.efficientSeconds / totalSecs) * 100) : 100;

    if (recap) {
      recap.innerHTML = `
        • <b>User:</b> ${window.currentUser ? window.currentUser : 'Guest'}<br>
        • <b>Status:</b> ${statusText}<br>
        • <b>Timer Efficiency Score:</b> ${efficiencyPct}%<br>
        • <b>Strengths:</b> ${strengthMsg}<br>
        • <b>Next Steps:</b> ${nextStepMsg}
      `;
    }
  }

  // --- USER AUTHENTICATION ---
  document.getElementById('authSignInBtn').addEventListener('click', () => {
    const uName = document.getElementById('authUsernameInput').value.trim();
    const email = document.getElementById('authEmailInput').value.trim();
    const pWord = document.getElementById('authPasswordInput').value.trim();

    if (!uName || !email || !email.includes('@') || !pWord) {
      showCornerToast("Sign-In Required", "Please enter your name, a valid Google email, and password.");
      return;
    }

    window.currentUser = uName;
    window.userEmail = email;
    reminderEmailInput.value = email;
    reminderSettings.email = email;
    document.getElementById('authFormSection').style.display = 'none';
    document.getElementById('authStatusMsg').innerHTML = `Signed in as <b>${uName}</b> (${email}). Session active!`;
    reminderStatusMsg.innerText = `Reminders enabled for ${email}.`;
    reminderStatusMsg.style.color = '#7ee787';
    showCornerToast("Welcome, " + uName + "!", "Your account is connected.");
    updateRealTimePerformance("Logged in and ready", "Account authenticated", "Generate prioritized tasks or join a meeting.");
  });

  // --- TASK PRIORITIZATION ---
  document.getElementById('aiAnalyzeBtn').addEventListener('click', () => {
    const rawInput = document.getElementById('multiTasksInput').value.trim();
    const deadline = document.getElementById('meetingDateInput').value;
    const panelContent = document.getElementById('panelContent');
    const panelTitle = document.getElementById('panelTitle');

    if (!rawInput) {
      panelContent.innerHTML = `<span style="color:#ef4444;">Please enter tasks.</span>`;
      return;
    }

    const tasks = rawInput.split(',').map(t => t.trim()).filter(Boolean);
    const scoredTasks = tasks.map(task => {
      const lower = task.toLowerCase();
      let priority = 50;
      let reason = 'A useful task with a moderate impact.';
      const highImpact = ['project', 'exam', 'final', 'assignment', 'homework', 'algebra', 'calculus', 'school', 'college', 'class', 'job', 'work', 'career', 'client', 'deadline', 'report', 'presentation', 'code'];
      const lowValue = ['laundry', 'clean', 'chores', 'organize', 'browse', 'scroll', 'game', 'tv', 'watch', 'shopping'];

      if (highImpact.some(keyword => lower.includes(keyword))) {
        priority = 90;
        reason = 'High impact on an important school, college, job, or project goal.';
      } else if (lowValue.some(keyword => lower.includes(keyword))) {
        priority = 20;
        reason = 'Lower-value routine work or a distraction that can wait.';
      }

      const today = new Date().toISOString().split('T')[0];
      if (deadline && deadline <= today && priority >= 50) {
        priority = Math.min(100, priority + 10);
        reason += ' It is due today, so it needs extra attention.';
      }
      return { name: task, priority, reason };
    });

    scoredTasks.sort((a, b) => b.priority - a.priority);
    panelTitle.innerText = `AI Prioritized Task Queue (${scoredTasks.length} tasks)`;
    
    let html = `<span style="font-size:10px; color:#ffb3c1;">AI sorted tasks into priority tiers:</span>`;
    scoredTasks.forEach((tObj, index) => {
      let priorityClass = tObj.priority >= 80 ? "task-high" : tObj.priority >= 40 ? "task-med" : "task-low";
      let badgeLabel = tObj.priority >= 80 ? "High Priority" : tObj.priority >= 40 ? "Medium Priority" : "Low Priority";

      html += `
        <button class="ai-task-btn ${priorityClass}" data-task-name="${tObj.name}">
          <b>${index + 1}. ${badgeLabel}:</b> ${tObj.name}<br>
          <span style="font-size: 10px; color: #a0a0b0;">Deadline: ${deadline || 'Not set'}<br>Why: ${tObj.reason}</span>
        </button>
      `;
    });

    panelContent.innerHTML = html;

    document.querySelectorAll('.ai-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskName = e.currentTarget.getAttribute('data-task-name');
        window.activeTaskSession = taskName;
        document.getElementById('activeTaskTitleLabel').innerText = taskName;
        document.getElementById('pomodoroDrawer').style.display = 'block';
        playAmbientChime();
      });
    });
  });

  // --- POMODORO TIMER ---
  let timerInterval, initialMins = 25, timeLeft = 1500, isPaused = false, timerPhase = 'focus';
  const timerDisplay = document.getElementById('timerDisplay');
  const focusInput = document.getElementById('focusTimeInput');
  const breakInput = document.getElementById('breakTimeInput');

  function finishTimerPhase() {
    if (timerPhase === 'focus') {
      const breakMinutes = Math.max(0, parseInt(breakInput.value, 10) || 0);
      if (breakMinutes === 0) {
        clearInterval(timerInterval);
        window.userMetrics.completedTasks++;
        showCornerToast("Pomodoro Complete!", "Focus session complete. No break was set.");
        updateRealTimePerformance("Focus session finished", "Strong stamina", "Start another focus session when ready.");
        return;
      }
      timerPhase = 'break';
      timeLeft = breakMinutes * 60;
      showCornerToast("Focus Complete", "Break timer started.");
      updateRealTimePerformance("Break in progress", "Strong stamina", "Return when the break ends.");
      return;
    }

    clearInterval(timerInterval);
    window.userMetrics.completedTasks++;
    showCornerToast("Break Complete", "Pomodoro cycle complete. Ready for the next task.");
    updateRealTimePerformance("Pomodoro cycle finished", "Consistent focus", "Start another focus session when ready.");
  }

  focusInput.addEventListener('change', () => {
    if (!isPaused) {
      initialMins = parseInt(focusInput.value) || 25;
      timeLeft = initialMins * 60;
      timerDisplay.innerText = `${initialMins.toString().padStart(2, '0')}:00`;
    }
  });

  document.getElementById('startTimerBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = false;
    timerPhase = 'focus';
    initialMins = parseInt(focusInput.value) || 25;
    timeLeft = initialMins * 60;
    document.getElementById('startTimerBtn').style.display = 'none';
    document.getElementById('resumeTimerBtn').style.display = 'inline-block';
    
    timerInterval = setInterval(() => {
      if (timeLeft > 0 && !isPaused) {
        timeLeft--;
        window.userMetrics.efficientSeconds++;
        let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
        timerDisplay.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        if (timeLeft === 0) finishTimerPhase();
      }
    }, 1000);
  });

  document.getElementById('resumeTimerBtn').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('resumeTimerBtn').innerText = isPaused ? "Resume" : "Pause";
  });

  document.getElementById('stopTimerBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isPaused = false;
    timerPhase = 'focus';
    window.userMetrics.inefficientSeconds += 30;
    document.getElementById('startTimerBtn').style.display = 'inline-block';
    document.getElementById('resumeTimerBtn').style.display = 'none';
    document.getElementById('resumeTimerBtn').innerText = "Resume";
    timeLeft = (parseInt(focusInput.value) || 25) * 60;
    timerDisplay.innerText = `${focusInput.value.padStart(2, '0')}:00`;
    document.getElementById('pomodoroDrawer').style.display = 'none';
  });

  // --- LOCAL MEETING SCHEDULER ---
  document.getElementById('aiMeetingBtn').addEventListener('click', () => {
    const title = document.getElementById('meetingTitleInput').value || "Team Alignment";
    const date = document.getElementById('meetingDateInput').value;
    const start = document.getElementById('meetingStartTime').value;
    const end = document.getElementById('meetingEndTime').value;
    const meetingStart = new Date(`${date}T${start}:00`);
    const meetingEnd = new Date(`${date}T${end}:00`);

    if (!window.userEmail) {
      showCornerToast("Sign-In Required", "Sign in with your Google email before adding this meeting to Calendar.");
      return;
    }

    if (!date || !start || !end || meetingStart <= new Date()) {
      showCornerToast("Choose a Future Time", "The meeting start time has passed. Please choose an appropriate future time.");
      return;
    }
    if (meetingEnd <= meetingStart) {
      showCornerToast("Invalid Meeting Time", "The end time must be after the start time.");
      return;
    }

    let conflict = false;
    window.scheduledSessionsStore.forEach(s => {
      const existingStart = s.startDate || new Date(`${s.date}T${s.start}:00`);
      const existingEnd = s.endDate || new Date(`${s.date}T${s.end}:00`);
      if (meetingStart < existingEnd && meetingEnd > existingStart) {
        conflict = true;
      }
    });

    if (conflict) {
      showCornerToast("Schedule Conflict", "You already have a meeting scheduled at this time.");
      return;
    }

    calendarSyncStatus.innerText = 'Connecting to Google Calendar and checking conflicts...';
    calendarSyncStatus.style.color = '#ffb3c1';
    showCornerToast("Connecting to Google Calendar", `Checking availability for "${title}".`);
    triggerGoogleBooking('schedule');
  });

  // --- SAKURA AI ASSISTANT CHAT WITH GOOGLE MEET INTEGRATION ---
  const aiInput = document.getElementById('chatUserInput');
  const aiIndicator = document.getElementById('aiTypingIndicator');
  let tTimer;

  aiInput.addEventListener('input', () => {
    aiIndicator.innerText = "You are typing...";
    clearTimeout(tTimer);
    tTimer = setTimeout(() => { aiIndicator.innerText = ""; }, 1000);
  });

  document.getElementById('aiChatSendBtn').addEventListener('click', () => {
    const msgs = document.getElementById('chatMessages');
    const txt = aiInput.value.trim();
    if (!txt) return;

    msgs.innerHTML += `<div style="margin-top: 4px;"><b>You:</b> ${txt}</div>`;
    aiInput.value = "";
    aiIndicator.innerText = "Sakura AI is thinking...";

    const lower = txt.toLowerCase();

    setTimeout(() => {
      aiIndicator.innerText = "";

      if (lower.includes('how') && (lower.includes('work') || lower.includes('sakura') || lower.includes('enterprise ai'))) {
        msgs.innerHTML += `<div style="margin-top: 4px; color: #ff758f;"><b>Sakura AI:</b><ul><li>Sign in with your Google email.</li><li>Enter tasks and choose the meeting date.</li><li>Select one or more guests, or choose None for a task.</li><li>Schedule a Google Calendar event and Meet when guests are selected.</li><li>Google Calendar sends email reminders before events.</li><li>Past or conflicting times are blocked.</li></ul></div>`;
        msgs.scrollTop = msgs.scrollHeight;
      } else if (lower.includes('book') && (lower.includes('meet') || lower.includes('google meet') || lower.includes('calendar'))) {
        if (!window.userEmail) {
          msgs.innerHTML += `<div style="margin-top: 4px; color: #ef4444;"><b>Sakura AI:</b> Please sign in with your Google email first so I can send the Calendar invitation.</div>`;
          msgs.scrollTop = msgs.scrollHeight;
          return;
        }
        msgs.innerHTML += `<div style="margin-top: 4px; color: #ff758f;"><b>Sakura AI:</b> Opening Google Authentication to schedule your Google Meet...</div>`;
        msgs.scrollTop = msgs.scrollHeight;
        triggerGoogleBooking();
      } else if (lower.includes('link') || lower.includes('website') || lower.includes('url')) {
        const linkUrl = "https://workspace.google.com/app-portal";
        msgs.innerHTML += `<div style="margin-top: 4px; color: #ff758f;"><b>Sakura AI:</b> Here is the requested link: <a class="chat-link" href="${linkUrl}" target="_blank">${linkUrl}</a></div>`;
        msgs.scrollTop = msgs.scrollHeight;
      } else {
        msgs.innerHTML += `<div style="margin-top: 4px; color: #ff758f;"><b>Sakura AI:</b> Received: "${txt}". Type <i>"book me a google meet"</i> to schedule a meeting directly on Google Calendar.</div>`;
        msgs.scrollTop = msgs.scrollHeight;
      }
    }, 800);
  });
}
