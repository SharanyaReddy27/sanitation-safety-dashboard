# Municipal Sanitation Worker Safety Monitoring Dashboard

A professional web-based monitoring dashboard for supervisors to monitor smart wearable safety badges worn by sanitation workers working inside sewer and drainage systems.

## Features

### 🏠 Control Room View (Home Screen)
- **Real-time Worker Status Panel**: Large visual cards showing each worker's status
- **Color-coded Status System**:
  - 🟢 Green = Safe
  - 🟡 Yellow = Warning
  - 🔴 Red = Immediate Danger (blinking with alert sound)
  - ⚫ Grey = Offline
- **Live Health Data**: Heart rate, SpO₂, body stress indicator
- **Environment Monitoring**: Toxic gas levels, temperature, water level detection
- **Work Safety Info**: Safe time remaining, exit distance, AI instructions

### 📍 Live Map View
- Real-time location tracking of all workers
- Color-coded worker markers
- Danger workers highlighted prominently
- Nearest coworker identification
- Rescue route suggestions

### 🚨 Emergency Response System
- Automatic danger detection and alerts
- Alert sound playback
- Emergency panel with worker details
- Rescue assistance coordination
- Voice communication system
- Nearest coworker highlighting
- Emergency event logging

### 🛡️ Worker Exposure Management System (WEMS)
- Weekly exposure data tracking:
  - Time in hazardous zones
  - Gas exposure levels
  - Oxygen drop events
  - High temperature exposure
  - Danger alert count
- **Exposure Risk Score**: Low / Medium / High
- **Automatic Recommendations**:
  - Safe for duty
  - Limited duty
  - Replace temporarily
- **Auto Worker Rotation Panel**: Prevents repeated high-risk assignments

### 📊 Reports Section
- **Daily Report**: Incidents, alerts, rescue events
- **Weekly Health Report**: Exposure scores, recommended rest days
- **Monthly Municipal Report**: Total operations, high-risk locations, safety compliance
- **Event History Timeline**: Complete log of warnings, emergencies, voice alerts, SOS events

## Installation

1. **Install Python dependencies**:
```bash
cd sanitation-safety-dashboard
pip install -r requirements.txt
```

2. **Run the application**:
```bash
python app.py
```

3. **Access the dashboard**:
```
http://localhost:5001
```

## Dashboard Pages

### 1. Control Room (/)
Main monitoring interface with:
- Live worker status cards
- Interactive map
- Real-time event log
- Emergency alerts

### 2. Health Protection (/health-protection)
Worker Exposure Management System with:
- Exposure summary cards
- Weekly exposure data table
- Auto rotation recommendations

### 3. Reports (/reports)
Comprehensive reporting with:
- Daily, weekly, and monthly reports
- Event history timeline
- Downloadable PDF reports

## Design Features

✅ **Clean Government Dashboard Style**
✅ **Large Readable Fonts** (1.1rem - 2.5rem)
✅ **Color-Driven UI** (Green/Yellow/Red status system)
✅ **Minimal Typing Required** (Click-based interface)
✅ **Large Monitor Optimized** (1800px max-width)
✅ **Real-time Auto-Updating** (3-10 second intervals)
✅ **Non-Technical Interface** (Simple, visual, decision-support focused)

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Mapping**: Leaflet.js (OpenStreetMap)
- **Real-time Updates**: AJAX polling
- **Responsive Design**: CSS Grid & Flexbox

## API Endpoints

- `GET /api/workers/status` - Get all workers' real-time status
- `GET /api/worker/<worker_id>` - Get detailed worker data
- `GET /api/exposure` - Get exposure data for all workers
- `GET /api/events` - Get event history log
- `POST /api/event/log` - Log a new event
- `GET /api/reports/daily` - Generate daily report
- `GET /api/reports/weekly` - Generate weekly health report

## Simulated Data

The dashboard currently uses simulated data for demonstration purposes:
- 6 workers with randomized status
- Realistic vital signs and environmental data
- Dynamic risk scenarios (70% safe, 20% warning, 10% danger)
- Exposure tracking and risk scoring

## Production Deployment

For production use:
1. Replace simulated data with real wearable device API integration
2. Implement actual Twilio/SMS alert system
3. Add database persistence (PostgreSQL/MySQL)
4. Implement user authentication
5. Add SSL/HTTPS
6. Configure proper logging and monitoring
7. Set up backup and disaster recovery

## Safety Features

🚨 **Automatic Danger Detection**
📢 **Voice Alert System**
🚑 **Rescue Coordination**
📊 **Health Exposure Tracking**
🔄 **Auto Worker Rotation**
📝 **Complete Event Logging**
📈 **Compliance Reporting**

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Edge
- Safari

## Screen Resolution

Optimized for:
- Large control room monitors (1920x1080 and above)
- Tablets (landscape mode)
- Desktop computers

## Support

For issues or questions, contact the municipal IT department.

## License

Municipal Government Use Only

---

**Built for Municipal Sanitation Worker Safety**
*Protecting those who keep our cities clean*

LIVE DEMO : sanitation-safety-dashboard.vercel.app

COLLABRATORS : 
This project was developed collaboratively as part of a team effort by:

Sharanya Reddy
Vedha Harshitha Rayini
Saranya Reddy
Sudeepthi Pasupuleti

all contributors were involved in the ideation, design, development, and implementation of the Sanitation Safety Dashboard. The repository was initially created and maintained under one contributor's GitHub account, and this fork/copy is shared to showcase the work and contributions of all team members.

Special thanks to all team members for their valuable contributions and teamwork throughout the project.
