from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import random

app = Flask(__name__)
CORS(app)

# =========================
# GLOBAL STATE
# =========================
servers = [
    {"id": 0, "load": 0},
    {"id": 1, "load": 0},
    {"id": 2, "load": 0}
]

request_count = 0


# =========================
# RESET SYSTEM
# =========================
@app.route('/reset', methods=['GET'])
def reset():
    global servers, request_count

    servers = [
        {"id": 0, "load": 0},
        {"id": 1, "load": 0},
        {"id": 2, "load": 0}
    ]
    request_count = 0

    return jsonify({"message": "System Reset Successfully"})


# =========================
# ADD REQUEST (MAIN LOGIC)
# =========================
@app.route('/add_request', methods=['POST'])
def add_request():
    global request_count

    size = int(request.json['size'])
    algo = request.json.get('algorithm', 'greedy')

    # ---------------------
    # LOAD BALANCING LOGIC
    # ---------------------
    if algo == "greedy":
        # Choose least loaded server
        server = min(servers, key=lambda x: x["load"])
        server_id = server["id"]

    elif algo == "round":
        # Round Robin
        server_id = request_count % 3

    elif algo == "random":
        # Random selection
        server_id = random.randint(0, 2)

    else:
        # fallback
        server_id = 0

    # Update load
    servers[server_id]["load"] += size
    request_count += 1

    return jsonify({
        "message": f"{algo.upper()} → Server {server_id}",
        "servers": servers,
        "requests": request_count
    })


# =========================
# METRICS
# =========================
@app.route('/metrics', methods=['GET'])
def metrics():
    total_load = sum(s["load"] for s in servers)

    if total_load < 100:
        status = "Low"
    elif total_load < 300:
        status = "Medium"
    else:
        status = "High"

    return jsonify({
        "servers": servers,
        "requests": request_count,
        "status": status
    })


# =========================
# SHORTEST PATH (C++ CALL)
# =========================
@app.route('/shortest_path', methods=['GET'])
def shortest_path():
    try:
        result = subprocess.run(
            ["../load_balancer.exe", "path"],
            capture_output=True,
            text=True
        )

        distances = list(map(int, result.stdout.strip().split()))

        return jsonify({"distances": distances})

    except Exception as e:
        return jsonify({"error": str(e)})


# =========================
# ALGORITHM COMPARISON
# =========================
@app.route('/compare', methods=['GET'])
def compare():
    return jsonify({
        "Greedy": "Balanced & Efficient (Min Heap Logic)",
        "Round Robin": "Equal Distribution (Sequential)",
        "Random": "Unpredictable (No Optimization)"
    })


# =========================
# RUN SERVER
# =========================
if __name__ == '__main__':
    app.run(debug=True)