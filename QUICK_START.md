# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd sanitation-safety-dashboard
pip install -r requirements.txt
```

### Step 2: Run the Application
```bash
python app.py
```

### Step 3: Open Dashboard
Open your browser and go to:
```
http://localhost:5001
```

## 📱 Dashboard Overview

### Control Room (Main Page)
- **Worker Status Cards**: Click any card to see detailed health data
- **Live Map**: Shows real-time worker locations
- **Event Log**: Right sidebar shows recent events
- **Emergency Alerts**: Automatic popup when danger detected

### Health Protection Tab
- View weekly exposure data for all workers
- See risk scores and recommendations
- Check auto-rotation suggestions

### Reports Tab
- Daily, weekly, and monthly reports
- Event history timeline
- Download reports as PDF

## 🎨 Color Codes

- 🟢 **Green** = Worker is safe
- 🟡 **Yellow** = Warning - monitor closely
- 🔴 **Red** = Danger - immediate action required
- ⚫ **Grey** = Worker offline

## 🚨 Emergency Response

When a worker enters danger state:
1. Card blinks red
2. Alert sound plays
3. Emergency modal opens automatically
4. Options appear:
   - 🚑 Initiate Rescue
   - 📢 Send Voice Alert
   - ✓ Acknowledge

## 📊 Understanding the Data

### Vitals
- **Heart Rate**: Normal 60-100 bpm
- **SpO₂**: Normal >95%
- **Stress**: Low <30%, Medium 30-60%, High >60%

### Environment
- **Gas Level**: Safe <20%, Moderate 20-50%, Dangerous >50%
- **Temperature**: Safe <35°C, Warning 35-40°C, Danger >40°C
- **Water Level**: Normal / Rising / High

### Exposure Risk Score
- **Low (<100)**: Safe for duty
- **Medium (100-200)**: Limited duty recommended
- **High (>200)**: Rest required

## 🔄 Auto-Refresh

The dashboard updates automatically:
- Worker status: Every 3 seconds
- Event log: Every 5 seconds
- Exposure data: Every 10 seconds

No need to refresh the page!

## 💡 Tips for Supervisors

1. **Keep the dashboard open** on a large monitor in the control room
2. **Monitor the status summary** at the top for quick overview
3. **Check the map** to see worker distribution
4. **Review event log** regularly for patterns
5. **Use Health Protection tab** for weekly planning
6. **Generate reports** for compliance and documentation

## 🎯 Key Actions

### View Worker Details
- Click any worker card
- See complete health and environment data
- Check AI safety instructions

### Respond to Emergency
- Emergency modal opens automatically
- Click "Initiate Rescue" to dispatch help
- Click "Send Voice Alert" to warn nearby workers
- Click "Acknowledge" to close alert

### Check Exposure Data
- Go to "Health Protection" tab
- Review weekly exposure table
- Check rotation recommendations
- Plan duty assignments

### Generate Reports
- Go to "Reports" tab
- Select report type (Daily/Weekly/Monthly)
- Click "Download PDF" to save

## 🔧 Troubleshooting

### Dashboard not loading?
- Check if Flask is running: `python app.py`
- Verify port 5001 is not in use
- Try: `http://127.0.0.1:5001`

### Map not showing?
- Check internet connection (uses OpenStreetMap)
- Refresh the page
- Clear browser cache

### No alert sound?
- Check browser audio permissions
- Unmute browser tab
- Check system volume

## 📞 Support

For technical support, contact:
- Municipal IT Department
- Emergency: Call control room supervisor

## 🎓 Training

New supervisors should:
1. Review this quick start guide
2. Practice with simulated data
3. Understand color codes and alerts
4. Learn emergency response procedures
5. Know how to generate reports

---

**Remember**: This dashboard is a decision-support tool. Always follow established safety protocols and emergency procedures.
