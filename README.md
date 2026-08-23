# Sakura Enterprise AI

A browser-based Pomodoro and Google Calendar assistant.

## Live demo

[Open Sakura Enterprise AI](https://srianusha204-tech.github.io/Sakura-Ai-assistant/)

## Features

- Pomodoro focus and break timers with completion notifications.
- Human-like task prioritization with reasons for each rank.
- Google Calendar event creation with optional Google Meet links.
- Multiple Calendar invitees or task-only events.
- Configurable meeting and task reminders.
- Time-zone clocks and conversion.

## Run locally

Serve this folder over HTTP instead of opening `index.html` directly:

```sh
python3 -m http.server 5500
```

Then open <http://127.0.0.1:5500>.

## Google Calendar setup

1. Enable the Google Calendar API in Google Cloud Console.
2. Configure an OAuth consent screen and add test users.
3. Add the deployed HTTPS origin, or `http://127.0.0.1:5500`, to the OAuth client's authorized JavaScript origins.
4. Authorize Calendar access in the app.

The app uses Google OAuth for Calendar access. It does not send Google passwords to a server.

## License

Released under the [MIT License](LICENSE).
