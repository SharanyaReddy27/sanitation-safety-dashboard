# Project Structure

```
sanitation-safety-dashboard/
│
├── app.py                          # Main Flask application
│   ├── Worker data simulation
│   ├── API endpoints
│   ├── Risk calculation logic
│   └── Exposure scoring system
│
├── templates/                      # HTML templates
│   ├── index.html                 # Control Room (main dashboard)
│   ├── health_protection.html     # Worker Exposure Management
│   └── reports.html               # Reports and analytics
│
├── static/                        # Static assets
│   ├── style.css                  # Complete dashboard styling
│   ├── dashboard.js               # Control room functionality
│   ├── health.js                  # Health protection page logic
│   ├── reports.js                 # Reports page logic
│   ├── alert.mp3                  # Alert sound (add your own)
│   └── ALERT_SOUND_NOTE.txt       # Instructions for alert sound
│
├── requirements.txt               # Python dependencies
├── README.md                      # Complete documentation
├── QUICK_START.md                 # Quick start guide
└── PROJECT_STRUCTURE.md           # This file
```

## File Descriptions

### Backend (Python Flask)

#### app.py
Main application file containing:
- **Flask app initialization**
- **Worker data structure**: 6 simulated workers with locations
- **Status generation**: Realistic health and environment data
- **Risk calculation**: Multi-factor risk scoring algorithm
- **Exposure tracking**: Weekly exposure data management
- **API endpoints**: RESTful API for frontend
- **Report generation**: Daily, weekly, monthly reports

**Key Functions**:
- `generate_worker_status()`: Creates realistic worker status data
- `calculate_exposure_score()`: Calculates weekly exposure risk
- Routes for all pages and API endpoints

### Frontend (HTML/CSS/JavaScript)

#### templates/index.html
Control Room main dashboard:
- Header with status summary
- Navigation menu
- Worker status grid
- Live map container
- Worker detail modal
- Emergency alert modal
- Event log sidebar

#### templates/health_protection.html
Worker Exposure Management System:
- Exposure summary cards
- Weekly exposure data table
- Auto rotation recommendations table

#### templates/reports.html
Reports and analytics:
- Report type selector
- Daily report statistics
- Weekly health report
- Monthly municipal report
- Event history timeline

#### static/style.css
Complete styling (1000+ lines):
- Government dashboard theme
- Color-coded status system
- Responsive grid layouts
- Modal styles
- Table styles
- Animation effects
- Mobile responsive design

#### static/dashboard.js
Control room functionality:
- Real-time data fetching
- Worker card rendering
- Map initialization and updates
- Emergency detection and alerts
- Modal management
- Event logging
- Alert sound playback

#### static/health.js
Health protection page:
- Exposure data loading
- Summary calculations
- Table rendering
- Rotation recommendations

#### static/reports.js
Reports page:
- Report switching
- Data visualization
- Timeline rendering
- PDF download triggers

## Data Flow

### 1. Worker Status Update
```
Browser → GET /api/workers/status → Flask
Flask → generate_worker_status() → Simulated data
Simulated data → JSON response → Browser
Browser → dashboard.js → Update UI
```

### 2. Emergency Detection
```
dashboard.js → Check worker status
If danger detected → Play alert sound
                  → Show emergency modal
                  → Log event
                  → Update map
```

### 3. Exposure Tracking
```
Browser → GET /api/exposure → Flask
Flask → calculate_exposure_score() → Risk calculation
Risk data → JSON response → Browser
Browser → health.js → Update tables
```

### 4. Event Logging
```
Browser → POST /api/event/log → Flask
Flask → Append to event_log → Store in memory
Browser → GET /api/events → Flask
Flask → Return recent events → Browser
Browser → Update event log sidebar
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Control room page |
| `/health-protection` | GET | Health protection page |
| `/reports` | GET | Reports page |
| `/api/workers/status` | GET | All workers status |
| `/api/worker/<id>` | GET | Single worker details |
| `/api/exposure` | GET | Exposure data |
| `/api/events` | GET | Event history |
| `/api/event/log` | POST | Log new event |
| `/api/reports/daily` | GET | Daily report data |
| `/api/reports/weekly` | GET | Weekly report data |

## Key Features Implementation

### Real-time Updates
- JavaScript `setInterval()` for polling
- 3-second updates for worker status
- 5-second updates for events
- 10-second updates for exposure data

### Color-Coded Status
- CSS classes: `.safe`, `.warning`, `.danger`
- Dynamic class assignment based on risk
- Blinking animation for danger status

### Emergency Alerts
- Automatic detection in `checkForDangers()`
- Audio alert playback
- Modal popup with worker details
- Action buttons for rescue coordination

### Map Integration
- Leaflet.js for mapping
- OpenStreetMap tiles
- Dynamic marker updates
- Color-coded markers
- Popup information

### Exposure Scoring
- Multi-factor calculation:
  - Hazard hours × 2
  - Gas exposures × 5
  - Oxygen drops × 8
  - Temperature exposures × 3
  - Danger alerts × 10
- Risk levels: Low (<100), Medium (100-200), High (>200)

## Customization Points

### Adding Real Device Integration
1. Replace `generate_worker_status()` with API calls to wearable devices
2. Update worker data structure to match device API
3. Implement WebSocket for real-time push updates
4. Add device authentication and security

### Database Integration
1. Add SQLAlchemy or similar ORM
2. Create tables for workers, events, exposure data
3. Replace in-memory storage with database queries
4. Implement data persistence and history

### Authentication
1. Add Flask-Login or similar
2. Create user roles (supervisor, admin)
3. Implement login page
4. Add session management

### SMS/Voice Alerts
1. Integrate Twilio API
2. Add phone number configuration
3. Implement SMS sending on danger detection
4. Add voice call functionality

## Performance Considerations

- **Polling Interval**: Adjust based on server capacity
- **Event Log**: Limited to last 50 events in memory
- **Map Markers**: Efficient updates using marker dictionary
- **CSS Animations**: Hardware-accelerated transforms
- **Data Caching**: Consider Redis for production

## Browser Requirements

- Modern browser with ES6 support
- JavaScript enabled
- Audio playback capability
- Canvas support for map rendering
- LocalStorage for potential offline features

## Security Considerations

For production deployment:
- Add HTTPS/SSL
- Implement CSRF protection
- Add rate limiting
- Sanitize all inputs
- Implement proper authentication
- Use environment variables for secrets
- Add logging and monitoring
- Implement backup systems

## Future Enhancements

- [ ] WebSocket for real-time push updates
- [ ] Mobile app for supervisors
- [ ] Predictive analytics for risk prevention
- [ ] Integration with municipal emergency services
- [ ] Historical data analysis and trends
- [ ] Automated report scheduling
- [ ] Multi-language support
- [ ] Offline mode capability
- [ ] Advanced map features (heat maps, zones)
- [ ] Worker communication system
- [ ] Equipment tracking integration
- [ ] Weather data integration
- [ ] AI-powered risk prediction

---

**Note**: This is a demonstration system with simulated data. For production use, integrate with actual wearable device APIs and implement proper security measures.
