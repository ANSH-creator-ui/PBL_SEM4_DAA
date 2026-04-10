from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

servers = [
    {"id": 0, "load": 0},
    {"id": 1, "load": 0},
    {"id": 2, "load": 0}
]

request_count = 0


@app.route('/reset', methods=['GET'])
def reset():
    global servers, request_count

    servers = [
        {"id": 0, "load": 0},
        {"id": 1, "load": 0},
        {"id": 2, "load": 0}
    ]
    request_count = 0

    return jsonify({"message": "Reset done"})


@app.route('/add_request', methods=['POST'])
def add_request():
    global request_count

    size = int(request.json['size'])

    server = min(servers, key=lambda x: x["load"])
    server["load"] += size

    request_count += 1

    return jsonify({
        "message": f"Assigned to Server {server['id']}",
        "servers": servers,
        "requests": request_count
    })


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


# 🔥 C++ Dijkstra Integration
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
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)