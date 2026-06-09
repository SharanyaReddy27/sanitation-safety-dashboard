// Health Protection JavaScript

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    loadExposureData();
    setInterval(loadExposureData, 10000); // Update every 10 seconds
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

// Load exposure data
async function loadExposureData() {
    try {
        const response = await fetch('/api/exposure');
        const data = await response.json();
        
        displayExposureSummary(data);
        displayExposureTable(data);
        displayRotationTable(data);
    } catch (error) {
        console.error('Error loading exposure data:', error);
    }
}

// Display exposure summary
function displayExposureSummary(data) {
    const counts = {
        low: 0,
        medium: 0,
        high: 0
    };
    
    data.forEach(worker => {
        const level = worker.risk_level.toLowerCase();
        counts[level]++;
    });
    
    document.getElementById('low-risk-count').textContent = counts.low;
    document.getElementById('medium-risk-count').textContent = counts.medium;
    document.getElementById('high-risk-count').textContent = counts.high;
}

// Display exposure table
function displayExposureTable(data) {
    const tbody = document.getElementById('exposure-table-body');
    tbody.innerHTML = '';
    
    data.forEach(worker => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${worker.worker_id}</td>
            <td>${worker.name}</td>
            <td>${worker.exposure_data.hazard_hours} hrs</td>
            <td>${worker.exposure_data.gas_exposures}</td>
            <td>${worker.exposure_data.oxygen_drops}</td>
            <td>${worker.exposure_data.temp_exposures}</td>
            <td>${worker.exposure_data.danger_alerts}</td>
            <td><strong>${worker.risk_score}</strong></td>
            <td><span class="risk-badge ${worker.risk_level.toLowerCase()}">${worker.risk_level}</span></td>
            <td>${worker.recommendation}</td>
        `;
        tbody.appendChild(row);
    });
}

// Display rotation table
function displayRotationTable(data) {
    const tbody = document.getElementById('rotation-table-body');
    tbody.innerHTML = '';
    
    const dutyTypes = ['Low Risk Zone', 'Medium Risk Zone', 'High Risk Zone', 'Rest Day'];
    
    data.forEach((worker, index) => {
        const row = document.createElement('tr');
        
        let nextDuty;
        if (worker.risk_level === 'High') {
            nextDuty = 'Rest Day';
        } else if (worker.risk_level === 'Medium') {
            nextDuty = 'Low Risk Zone';
        } else {
            nextDuty = dutyTypes[index % dutyTypes.length];
        }
        
        row.innerHTML = `
            <td>${worker.name}</td>
            <td><span class="risk-badge ${worker.risk_level.toLowerCase()}">${worker.risk_level}</span></td>
            <td>${worker.recommendation}</td>
            <td><strong>${nextDuty}</strong></td>
        `;
        tbody.appendChild(row);
    });
}
