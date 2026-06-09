// Reports JavaScript

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    loadDailyReport();
    loadEventTimeline();
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

// Show report
function showReport(type) {
    // Hide all reports
    document.querySelectorAll('.report-container').forEach(container => {
        container.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected report
    document.getElementById(`${type}-report`).style.display = 'block';
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load report data
    if (type === 'daily') {
        loadDailyReport();
    } else if (type === 'weekly') {
        loadWeeklyReport();
    }
}

// Load daily report
async function loadDailyReport() {
    try {
        const response = await fetch('/api/reports/daily');
        const data = await response.json();
        
        document.getElementById('daily-workers').textContent = data.total_workers;
        document.getElementById('daily-incidents').textContent = data.incidents;
        document.getElementById('daily-alerts').textContent = data.alerts;
        document.getElementById('daily-rescues').textContent = data.rescue_events;
        document.getElementById('daily-hours').textContent = data.total_work_hours;
    } catch (error) {
        console.error('Error loading daily report:', error);
    }
}

// Load weekly report
async function loadWeeklyReport() {
    try {
        const response = await fetch('/api/reports/weekly');
        const data = await response.json();
        
        const content = document.getElementById('weekly-content');
        content.innerHTML = `
            <div class="report-stats">
                <div class="stat-card">
                    <h4>Total Workers</h4>
                    <div class="stat-value">${data.workers.length}</div>
                </div>
                <div class="stat-card danger">
                    <h4>High Risk Workers</h4>
                    <div class="stat-value">${data.high_risk_count}</div>
                </div>
            </div>
            
            <div style="background: #fef2f2; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                <h4 style="color: #ef4444; margin-bottom: 1rem; font-size: 1.3rem;">Workers Requiring Rest</h4>
                <ul style="list-style: none; font-size: 1.1rem;">
                    ${data.recommended_rest.map(name => `<li style="padding: 0.5rem 0;">• ${name}</li>`).join('')}
                </ul>
            </div>
            
            <div style="margin-top: 2rem;">
                <h4 style="font-size: 1.3rem; margin-bottom: 1rem;">All Workers Exposure Summary</h4>
                <table class="exposure-table">
                    <thead>
                        <tr>
                            <th>Worker</th>
                            <th>Risk Score</th>
                            <th>Risk Level</th>
                            <th>Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.workers.map(w => `
                            <tr>
                                <td>${w.name}</td>
                                <td>${w.risk_score}</td>
                                <td><span class="risk-badge ${w.risk_level.toLowerCase()}">${w.risk_level}</span></td>
                                <td>${w.recommendation}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error loading weekly report:', error);
    }
}

// Load event timeline
async function loadEventTimeline() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        
        const timeline = document.getElementById('event-timeline');
        timeline.innerHTML = '';
        
        events.reverse().slice(0, 30).forEach(event => {
            const item = document.createElement('div');
            item.className = `timeline-item ${event.type}`;
            item.innerHTML = `
                <div style="font-size: 0.95rem; color: #6b7280; margin-bottom: 0.25rem;">
                    ${new Date(event.timestamp).toLocaleString()}
                </div>
                <div style="font-size: 1.05rem; color: #374151;">
                    <strong>${event.worker_id}:</strong> ${event.message}
                </div>
            `;
            timeline.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading timeline:', error);
    }
}

// Download report
function downloadReport(type) {
    alert(`📥 Downloading ${type} report...\n\nReport will be generated as PDF and downloaded to your system.`);
}
