from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta
import random
import json

app = Flask(__name__)
app.secret_key = 'municipal-safety-dashboard-2024'

# Simulated worker data
WORKERS = {
    'W001': {'name': 'Rajesh Kumar', 'location': 'Manhole MH-45, MG Road', 'zone': 'Zone A'},
    'W002': {'name': 'Amit Singh', 'location': 'Manhole MH-12, Park Street', 'zone': 'Zone B'},
    'W003': {'name': 'Suresh Patel', 'location': 'Drainage Line DL-8, Station Road', 'zone': 'Zone A'},
    'W004': {'name': 'Vijay Sharma', 'location': 'Manhole MH-23, Gandhi Nagar', 'zone': 'Zone C'},
    'W005': {'name': 'Ramesh Yadav', 'location': 'Sewer Line SL-15, Market Area', 'zone': 'Zone B'},
    'W006': {'name': 'Prakash Verma', 'location': 'Manhole MH-67, Civil Lines', 'zone': 'Zone A'},
}

# Event log storage
event_log = []
exposure_data = {}

def generate_worker_status(worker_id):
    """Generate realistic worker status data"""
    # Simulate different risk scenarios
    risk = random.random()
    
    if risk < 0.7:  # 70% safe
        status = 'safe'
        heart_rate = random.randint(70, 90)
        spo2 = random.randint(95, 99)
        gas_level = random.randint(0, 20)
        temp = random.randint(25, 32)
        stress = random.randint(10, 30)
    elif risk < 0.9:  # 20% warning
        status = 'warning'
        heart_rate = random.randint(90, 110)
        spo2 = random.randint(90, 94)
        gas_level = random.randint(20, 50)
        temp = random.randint(32, 38)
        stress = random.randint(30, 60)
    else:  # 10% danger
        status = 'danger'
        heart_rate = random.randint(110, 140)
        spo2 = random.randint(80, 89)
        gas_level = random.randint(50, 100)
        temp = random.randint(38, 45)
        stress = random.randint(60, 90)
    
    return {
        'worker_id': worker_id,
        'name': WORKERS[worker_id]['name'],
        'location': WORKERS[worker_id]['location'],
        'zone': WORKERS[worker_id]['zone'],
        'status': status,
        'vitals': {
            'heart_rate': heart_rate,
            'spo2': spo2,
            'stress': stress
        },
        'environment': {
            'gas_level': gas_level,
            'temperature': temp,
            'water_level': random.choice(['Normal', 'Rising', 'High'])
        },
        'safety': {
            'safe_time_remaining': random.randint(10, 120),
            'exit_distance': random.randint(50, 300),
            'last_instruction': 'Proceed with caution. Monitor gas levels.'
        },
        'coordinates': {
            'lat': 28.6139 + random.uniform(-0.05, 0.05),
            'lng': 77.2090 + random.uniform(-0.05, 0.05)
        }
    }

def calculate_exposure_score(worker_id):
    """Calculate weekly exposure risk score"""
    if worker_id not in exposure_data:
        exposure_data[worker_id] = {
            'hazard_hours': random.randint(5, 40),
            'gas_exposures': random.randint(0, 15),
            'oxygen_drops': random.randint(0, 8),
            'temp_exposures': random.randint(0, 10),
            'danger_alerts': random.randint(0, 5)
        }
    
    data = exposure_data[worker_id]
    score = (
        data['hazard_hours'] * 2 +
        data['gas_exposures'] * 5 +
        data['oxygen_drops'] * 8 +
        data['temp_exposures'] * 3 +
        data['danger_alerts'] * 10
    )
    
    if score < 100:
        risk_level = 'Low'
        recommendation = 'Safe for duty'
    elif score < 200:
        risk_level = 'Medium'
        recommendation = 'Limited duty - Monitor closely'
    else:
        risk_level = 'High'
        recommendation = 'Replace temporarily - Rest required'
    
    return {
        'worker_id': worker_id,
        'name': WORKERS[worker_id]['name'],
        'exposure_data': data,
        'risk_score': score,
        'risk_level': risk_level,
        'recommendation': recommendation
    }

@app.route('/')
def index():
    """Home screen - Control room view"""
    return render_template('index.html')

@app.route('/api/workers/status')
def get_workers_status():
    """Get real-time status of all workers"""
    workers_status = [generate_worker_status(wid) for wid in WORKERS.keys()]
    return jsonify(workers_status)

@app.route('/api/worker/<worker_id>')
def get_worker_details(worker_id):
    """Get detailed data for specific worker"""
    if worker_id not in WORKERS:
        return jsonify({'error': 'Worker not found'}), 404
    return jsonify(generate_worker_status(worker_id))

@app.route('/api/exposure')
def get_exposure_data():
    """Get exposure data for all workers"""
    exposure_list = [calculate_exposure_score(wid) for wid in WORKERS.keys()]
    return jsonify(exposure_list)

@app.route('/api/events')
def get_events():
    """Get event history log"""
    return jsonify(event_log[-50:])  # Last 50 events

@app.route('/api/event/log', methods=['POST'])
def log_event():
    """Log a new event"""
    data = request.json
    event = {
        'timestamp': datetime.now().isoformat(),
        'type': data.get('type'),
        'worker_id': data.get('worker_id'),
        'message': data.get('message')
    }
    event_log.append(event)
    return jsonify({'success': True})

@app.route('/api/reports/daily')
def daily_report():
    """Generate daily report"""
    report = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'total_workers': len(WORKERS),
        'incidents': random.randint(0, 3),
        'alerts': random.randint(5, 20),
        'rescue_events': random.randint(0, 2),
        'total_work_hours': random.randint(40, 60)
    }
    return jsonify(report)

@app.route('/api/reports/weekly')
def weekly_report():
    """Generate weekly health report"""
    workers_health = [calculate_exposure_score(wid) for wid in WORKERS.keys()]
    report = {
        'week': f"{(datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')} to {datetime.now().strftime('%Y-%m-%d')}",
        'workers': workers_health,
        'high_risk_count': sum(1 for w in workers_health if w['risk_level'] == 'High'),
        'recommended_rest': [w['name'] for w in workers_health if w['risk_level'] == 'High']
    }
    return jsonify(report)

@app.route('/health-protection')
def health_protection():
    """Worker Exposure Management System page"""
    return render_template('health_protection.html')

@app.route('/reports')
def reports():
    """Reports page"""
    return render_template('reports.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
