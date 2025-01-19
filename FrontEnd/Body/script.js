// Initialize data arrays with larger initial capacity
let flowData = [];
let pressureData = [];
let temperatureData = [];
let timeLabels = [];
const maxDataPoints = 100; // Store more data points for history

// Initialize charts
let flowChart, pressureChart, temperatureChart;

// Generate initial data
function generateInitialData() {
    const now = new Date();
    for (let i = maxDataPoints; i >= 0; i--) {
        const time = new Date(now - i * 1000);
        timeLabels.push(time.toLocaleTimeString());
        flowData.push(Math.random() * 10 + 20); // Flow rate between 20-30 L/min
        pressureData.push(Math.random() * 20 + 40); // Pressure between 40-60 PSI
        temperatureData.push(Math.random() * 10 + 20); // Temperature between 20-30°C
    }
}

// Update data arrays with new values while maintaining history
function updateData() {
    const now = new Date();
    
    // Add new data points
    timeLabels.push(now.toLocaleTimeString());
    flowData.push(generateNewValue(flowData[flowData.length - 1], 20, 30));
    pressureData.push(generateNewValue(pressureData[pressureData.length - 1], 40, 60));
    temperatureData.push(generateNewValue(temperatureData[temperatureData.length - 1], 20, 30));
    
    // Remove oldest data points if exceeding maxDataPoints
    if (timeLabels.length > maxDataPoints) {
        timeLabels.shift();
        flowData.shift();
        pressureData.shift();
        temperatureData.shift();
    }

    // Update charts
    updateCharts();

    // Update last update time
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
}

// Generate new values with smooth transitions
function generateNewValue(lastValue, min, max) {
    const maxChange = 0.5; // Maximum change per update
    const change = (Math.random() - 0.5) * maxChange;
    let newValue = lastValue + change;
    
    // Keep values within bounds
    newValue = Math.max(min, Math.min(max, newValue));
    return newValue;
}

// Update all charts
function updateCharts() {
    flowChart.update('none'); // 'none' to disable animations for better performance
    pressureChart.update('none');
    temperatureChart.update('none');
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateInitialData();

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 10, // Show fewer x-axis labels
                    autoSkip: true
                }
            },
            y: {
                beginAtZero: false // Allow y-axis to adapt to data range
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 0 // Hide points for better performance
            }
        },
        animation: {
            duration: 0 // Disable animations for better performance
        }
    };

    // Initialize Flow Rate Chart
    const flowCtx = document.getElementById('flowGraph').getContext('2d');
    flowChart = new Chart(flowCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                data: flowData,
                borderColor: '#0077b6',
                backgroundColor: 'rgba(0, 119, 182, 0.1)',
                fill: true,
                borderWidth: 1.5
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Flow Rate (L/min)'
                    },
                    min: 15,
                    max: 35
                }
            }
        }
    });

    // Initialize Pressure Chart
    const pressureCtx = document.getElementById('pressureGraph').getContext('2d');
    pressureChart = new Chart(pressureCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                data: pressureData,
                borderColor: '#00b4d8',
                backgroundColor: 'rgba(0, 180, 216, 0.1)',
                fill: true,
                borderWidth: 1.5
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Pressure (PSI)'
                    },
                    min: 35,
                    max: 65
                }
            }
        }
    });

    // Initialize Temperature Chart
    const tempCtx = document.getElementById('temperatureGraph').getContext('2d');
    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                data: temperatureData,
                borderColor: '#ef476f',
                backgroundColor: 'rgba(239, 71, 111, 0.1)',
                fill: true,
                borderWidth: 1.5
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    min: 15,
                    max: 35
                }
            }
        }
    });

    // Handle motor toggle
    const motorToggle = document.getElementById('motorToggle');
    const motorStatus = document.getElementById('motorStatus');
    
    motorToggle.addEventListener('change', function() {
        motorStatus.textContent = this.checked ? 'ON' : 'OFF';
    });

    // Update graphs every second
    setInterval(updateData, 1000);
});

// Enhanced anomaly detection
function checkForAnomalies() {
    const latestFlow = flowData[flowData.length - 1];
    const latestPressure = pressureData[pressureData.length - 1];
    const latestTemp = temperatureData[temperatureData.length - 1];

    // Calculate trends
    const flowTrend = calculateTrend(flowData.slice(-10));
    const pressureTrend = calculateTrend(pressureData.slice(-10));
    const tempTrend = calculateTrend(temperatureData.slice(-10));

    const statusDot = document.querySelector('.status-dot');
    const statusIndicator = document.querySelector('.status-indicator');

    // Check for both absolute values and trends
    if (latestFlow > 28 || latestPressure > 55 || latestTemp > 28 ||
        flowTrend > 0.5 || pressureTrend > 0.5 || tempTrend > 0.5) {
        statusDot.style.backgroundColor = '#ff0000';
        statusIndicator.innerHTML = `
            <span class="status-dot"></span>
            System Status: Warning - Abnormal Readings Detected
        `;
    } else {
        statusDot.style.backgroundColor = '#00ff00';
        statusIndicator.innerHTML = `
            <span class="status-dot"></span>
            System Status: Online
        `;
    }
}

// Calculate trend (average rate of change)
function calculateTrend(data) {
    if (data.length < 2) return 0;
    const changes = [];
    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i-1]);
    }
    return changes.reduce((a, b) => a + b, 0) / changes.length;
}

// Check for anomalies every 2 seconds
setInterval(checkForAnomalies, 2000);