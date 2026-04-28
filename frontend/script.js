const BASE = "http://127.0.0.1:5000";

let chart = null;
let interval = null;

// =======================
// ADD REQUEST
// =======================
async function addRequest() {
    let size = document.getElementById("size").value;
    let algo = document.getElementById("algo").value;

    if (!size || size <= 0) {
        alert("Enter valid request size");
        return;
    }

    try {
        let res = await fetch(`${BASE}/add_request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                size: size,
                algorithm: algo
            })
        });

        let data = await res.json();

    document.getElementById("msg").innerText = data.message;

        updateLoads(data.servers);
        loadMetrics();

        // Show current algorithm
        document.getElementById("currentAlgo").innerText =
            "Current Algorithm: " + algo;

    } catch (error) {
        console.error("Error:", error);
        alert("Backend not responding!");
    }
}

// =======================
// SIMULATION (FIXED)
// =======================
function startSim() {
    if (interval !== null) return; // prevent multiple runs

    interval = setInterval(() => {
        // Random size between 1–20
        document.getElementById("size").value =
            Math.floor(Math.random() * 20) + 1;

        addRequest();
    }, 4000);

    document.getElementById("simStatus").innerText = "Simulation: ON";
}

function stopSim() {
    if (interval !== null) {
        clearInterval(interval);
        interval = null;
    }

    document.getElementById("simStatus").innerText = "Simulation: OFF";
}

// =======================
// LOAD METRICS
// =======================
async function loadMetrics() {
    try {
        let res = await fetch(`${BASE}/metrics`);
        let data = await res.json();

        document.getElementById("reqCount").innerText = data.requests;
        document.getElementById("activeLoad").innerText = data.status;

        updateLoads(data.servers);

    } catch (error) {
        console.error("Metrics error:", error);
    }
}

// =======================
// UPDATE SERVER LOADS
// =======================
function updateLoads(servers) {
    let list = document.getElementById("loads");
    list.innerHTML = "";

    servers.forEach(s => {
        let li = document.createElement("li");
        li.innerText = `Server ${s.id} → Load: ${s.load}`;

        // Color based on load
        if (s.load < 50) {
            li.style.background = "#22c55e"; // green
        } else if (s.load < 100) {
            li.style.background = "#f59e0b"; // orange
        } else {
            li.style.background = "#ef4444"; // red
        }

        li.style.color = "white";
        li.style.borderRadius = "8px";

        list.appendChild(li);
    });

    renderChart(servers);
}

// =======================
// CHART
// =======================
function renderChart(servers) {
    let ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: servers.map(s => "Server " + s.id),
            datasets: [{
                label: "Server Load",
                data: servers.map(s => s.load),
                backgroundColor: [
                    "#3b82f6",
                    "#06b6d4",
                    "#8b5cf6"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            },
            scales: {
                x: {
                    ticks: { color: "white" }
                },
                y: {
                    ticks: { color: "white" }
                }
            }
        }
    });
}

// =======================
// SHORTEST PATH
// =======================
async function getPath() {
    try {
        let res = await fetch(`${BASE}/shortest_path`);
        let data = await res.json();

        document.getElementById("path").innerText =
            "Shortest Path Distances:\n" + data.distances.join(" → ");

    } catch (error) {
        console.error("Path error:", error);
    }
}

// =======================
// ALGORITHM COMPARISON
// =======================
async function compare() {
    try {
        let res = await fetch(`${BASE}/compare`);
        let data = await res.json();

        document.getElementById("compare").innerText =
            `Greedy: ${data.Greedy}
Round Robin: ${data["Round Robin"]}
Random: ${data.Random}`;

    } catch (error) {
        console.error("Compare error:", error);
    }
}

// =======================
// RESET SYSTEM
// =======================
async function resetServers() {
    await fetch(`${BASE}/reset`);

    // Clear UI
    document.getElementById("loads").innerHTML = "";
    document.getElementById("path").innerText = "Click Show";
    document.getElementById("compare").innerText = "";
    document.getElementById("currentAlgo").innerText = "";
    document.getElementById("simStatus").innerText = "Simulation: OFF";

    stopSim(); // ensure simulation stops

    loadMetrics();
}

// =======================
// INIT
// =======================
loadMetrics();