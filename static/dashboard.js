// Dashboard JavaScript
let map;
let markers = {};
let alertSound;
let currentDangerWorkers = new Set();

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    updateTime();
    setInterval(updateTime, 1000);
    loadWorkers();
    setInterval(loadWorkers, 3000); // Update every 3 seconds
    loadEvents();
    setInterval(loadEvents, 5000);
    
    alertSound = document.getElementById('alert-sound');
    
    // Modal close handlers
    document.querySelector('.close-modal').onclick = function() {
        document.getElementById('worker-modal').style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
});

// Update current time
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeStr;
}

// Initialize map
function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Load workers data
async function loadWorkers() {
    try {
        const response = await fetch('/api/workers/status');
        const workers = await response.json();
        
        displayWorkers(workers);
        updateMap(workers);
        updateStatusCounts(workers);
        checkForDangers(workers);
    } catch (error) {
        console.error('Error loading workers:', error);
    }
}

// Display worker cards
function displayWorkers(workers) {
    const grid = document.getElementById('workers-grid');
    grid.innerHTML = '';
    
    // Sort workers: danger first, then warning, then safe
    const sortedWorkers = workers.sort((a, b) => {
        const statusOrder = { danger: 0, warning: 1, safe: 2, offline: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    });
    
    sortedWorkers.forEach(worker => {
        const card = createWorkerCard(worker);
        grid.appendChild(card);
    });
}

// Create worker card
function createWorkerCard(worker) {
    const card = document.createElement('div');
    card.className = `worker-card ${worker.status}`;
    card.onclick = () => showWorkerDetails(worker.worker_id);
    
    // Add priority badge for danger workers
    const priorityBadge = worker.status === 'danger' 
        ? '<div class="priority-badge">🚨 URGENT</div>' 
        : '';
    
    card.innerHTML = `
        ${priorityBadge}
        <div class="status-indicator"></div>
        <h3>${worker.name}</h3>
        <div class="worker-id">${worker.worker_id}</div>
        <div class="location">📍 ${worker.location}</div>
        <div class="vitals">
            <div class="vital-item">
                <span class="vital-label">Heart Rate</span>
                <span class="vital-value">${worker.vitals.heart_rate} bpm</span>
            </div>
            <div class="vital-item">
                <span class="vital-label">SpO₂</span>
                <span class="vital-value">${worker.vitals.spo2}%</span>
            </div>
        </div>
    `;
    
    return card;
}

// Update map markers
function updateMap(workers) {
    workers.forEach(worker => {
        const coords = [worker.coordinates.lat, worker.coordinates.lng];
        
        if (markers[worker.worker_id]) {
            markers[worker.worker_id].setLatLng(coords);
            markers[worker.worker_id].setIcon(getMarkerIcon(worker.status));
        } else {
            const marker = L.circleMarker(coords, {
                radius: worker.status === 'danger' ? 12 : 8,
                fillColor: getStatusColor(worker.status),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            
            marker.bindPopup(`
                <strong>${worker.name}</strong><br>
                ${worker.location}<br>
                Status: ${worker.status.toUpperCase()}
            `);
            
            markers[worker.worker_id] = marker;
        }
    });
}

// Get marker icon based on status
function getMarkerIcon(status) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${getStatusColor(status)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`
    });
}

// Get status color
function getStatusColor(status) {
    switch(status) {
        case 'safe': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'danger': return '#ef4444';
        default: return '#6b7280';
    }
}

// Update status counts
function updateStatusCounts(workers) {
    const counts = {
        safe: 0,
        warning: 0,
        danger: 0
    };
    
    workers.forEach(worker => {
        counts[worker.status]++;
    });
    
    document.getElementById('safe-count').textContent = counts.safe;
    document.getElementById('warning-count').textContent = counts.warning;
    document.getElementById('danger-count').textContent = counts.danger;
}

// Check for danger situations
function checkForDangers(workers) {
    const dangerWorkers = workers.filter(w => w.status === 'danger');
    
    dangerWorkers.forEach(worker => {
        if (!currentDangerWorkers.has(worker.worker_id)) {
            // New danger detected
            currentDangerWorkers.add(worker.worker_id);
            playAlert();
            showEmergencyModal(worker);
            logEvent('danger', worker.worker_id, `EMERGENCY: ${worker.name} in danger at ${worker.location}`);
        }
    });
    
    // Remove resolved dangers
    currentDangerWorkers.forEach(workerId => {
        if (!dangerWorkers.find(w => w.worker_id === workerId)) {
            currentDangerWorkers.delete(workerId);
        }
    });
}

// Play alert sound
function playAlert() {
    if (alertSound) {
        alertSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Show worker details modal
async function showWorkerDetails(workerId) {
    try {
        const response = await fetch(`/api/worker/${workerId}`);
        const worker = await response.json();
        
        const modal = document.getElementById('worker-modal');
        const details = document.getElementById('worker-details');
        
        details.innerHTML = `
            <div class="worker-details-header">
                <h2>${worker.name}</h2>
                <p style="font-size: 1.2rem; color: #6b7280;">${worker.worker_id} | ${worker.location}</p>
            </div>
            
            <div class="details-grid">
                <div class="detail-section">
                    <h3>💓 Vitals</h3>
                    <div class="detail-item">
                        <span class="detail-label">Heart Rate</span>
                        <span class="detail-value">${worker.vitals.heart_rate} bpm</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Oxygen Level (SpO₂)</span>
                        <span class="detail-value">${worker.vitals.spo2}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Body Stress</span>
                        <span class="detail-value">${worker.vitals.stress}%</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>🌡️ Environment</h3>
                    <div class="detail-item">
                        <span class="detail-label">Toxic Gas Level</span>
                        <span class="detail-value">${worker.environment.gas_level}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Temperature</span>
                        <span class="detail-value">${worker.environment.temperature}°C</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Water Level</span>
                        <span class="detail-value">${worker.environment.water_level}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>⚠️ Work Safety</h3>
                    <div class="detail-item">
                        <span class="detail-label">Safe Time Remaining</span>
                        <span class="detail-value">${worker.safety.safe_time_remaining} min</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Exit Distance</span>
                        <span class="detail-value">${worker.safety.exit_distance} m</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>🤖 AI Instruction</h3>
                    <p style="font-size: 1.1rem; color: #374151; padding: 1rem; background: white; border-radius: 8px;">
                        ${worker.safety.last_instruction}
                    </p>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading worker details:', error);
    }
}

// Show emergency modal
function showEmergencyModal(worker) {
    const modal = document.getElementById('emergency-modal');
    const details = document.getElementById('emergency-details');
    
    details.innerHTML = `
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>Worker:</strong> ${worker.name} (${worker.worker_id})
        </div>
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>Location:</strong> ${worker.location}
        </div>
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>Time:</strong> ${new Date().toLocaleTimeString()}
        </div>
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>Heart Rate:</strong> ${worker.vitals.heart_rate} bpm
        </div>
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>SpO₂:</strong> ${worker.vitals.spo2}%
        </div>
        <div style="font-size: 1.3rem; margin-bottom: 1rem;">
            <strong>Gas Level:</strong> ${worker.environment.gas_level}% (DANGEROUS)
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close emergency modal
function closeEmergency() {
    document.getElementById('emergency-modal').style.display = 'none';
}

// Initiate rescue
function initiateRescue() {
    alert('🚑 Rescue team has been dispatched!\n\nNearest coworkers have been alerted.\nEmergency services notified.');
    logEvent('rescue', 'SYSTEM', 'Rescue operation initiated');
    closeEmergency();
}

// Send voice alert
function sendVoiceAlert() {
    alert('📢 Voice alert sent to nearby workers:\n\n"Emergency situation detected. Proceed to assist immediately. Follow safety protocols."');
    logEvent('voice_alert', 'SYSTEM', 'Voice alert sent to nearby workers');
}

// Load events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '';
        
        events.reverse().slice(0, 20).forEach(event => {
            const item = document.createElement('div');
            item.className = `event-item ${event.type}`;
            item.innerHTML = `
                <div class="event-time">${new Date(event.timestamp).toLocaleTimeString()}</div>
                <div class="event-message">${event.message}</div>
            `;
            eventList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Log event
async function logEvent(type, workerId, message) {
    try {
        await fetch('/api/event/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                worker_id: workerId,
                message: message
            })
        });
        loadEvents();
    } catch (error) {
        console.error('Error logging event:', error);
    }
}
