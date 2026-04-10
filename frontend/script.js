const BASE = "http://127.0.0.1:5000";
let chart = null;

async function addRequest() {
    let size = document.getElementById("size").value;

    let res = await fetch(`${BASE}/add_request`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({size: size})
    });

    let data = await res.json();

    alert(data.message);
    updateLoads(data.servers);
    loadMetrics();
}

async function loadMetrics() {
    let res = await fetch(`${BASE}/metrics`);
    let data = await res.json();

    document.getElementById("reqCount").innerText = data.requests;
    document.getElementById("activeLoad").innerText = data.status;

    updateLoads(data.servers);
}

function updateLoads(servers) {
    let list = document.getElementById("loads");
    list.innerHTML = "";

    servers.forEach(s => {
        let li = document.createElement("li");
        li.innerText = `Server ${s.id} → Load: ${s.load}`;
        list.appendChild(li);
    });

    renderChart(servers);
}

function renderChart(servers) {
    let ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: servers.map(s => "S" + s.id),
            datasets: [{
                label: "Load",
                data: servers.map(s => s.load)
            }]
        }
    });
}

async function getPath() {
    let res = await fetch(`${BASE}/shortest_path`);
    let data = await res.json();

    document.getElementById("path").innerText =
        "Distances: " + data.distances.join(" → ");
}

async function resetServers() {
    await fetch(`${BASE}/reset`);
    loadMetrics();
}

loadMetrics();