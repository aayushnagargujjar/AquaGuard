// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize graphs
    initializeGraphs();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Function to generate random data for graphs
function generateData(count) {
    return Array.from({ length: count }, (_, i) => ({
        x: new Date(Date.now() - (count - i) * 1000 * 60),
        y: Math.random() * 10 + 20
    }));
}

// Initialize all graphs
function initializeGraphs() {
    // Water Flow Graph
    new Chart(document.getElementById('flowGraph').getContext('2d'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Flow Rate (L/min)',
                data: generateData(20),
                borderColor: '#0077b6',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }
            }
        }
    });

    // Pressure Graph
    new Chart(document.getElementById('pressureGraph').getContext('2d'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Pressure (bar)',
                data: generateData(20),
                borderColor: '#00b4d8',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }
            }
        }
    });

    // Temperature Graph
    new Chart(document.getElementById('temperatureGraph').getContext('2d'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature (°C)',
                data: generateData(20),
                borderColor: '#90e0ef',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                }
            }
        }
    });
}