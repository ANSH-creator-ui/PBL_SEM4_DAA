#include <iostream>
#include <vector>
#include <cstdlib>

#include "server.h"
#include "request.h"
#include "load_balancer.h"
#include "graph.h"
#include "dijkstra.h"

using namespace std;

int main() {

    // Create servers
    vector<Server*> servers;
    for(int i = 0; i < 3; i++)
        servers.push_back(new Server(i));

    LoadBalancer lb(servers);

    // Create graph
    Graph g(5);
    g.addEdge(0,1,2);
    g.addEdge(1,2,4);
    g.addEdge(0,3,1);
    g.addEdge(3,4,3);
    g.addEdge(4,2,1);

    int choice;
    int requestId = 1;

    do {
        cout << "\n====================================\n";
        cout << " INTELLIGENT LOAD BALANCER SYSTEM\n";
        cout << "====================================\n";
        cout << "1. Add Request\n";
        cout << "2. Show Server Loads\n";
        cout << "3. Show Network Shortest Path\n";
        cout << "4. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch(choice) {

            case 1: {
                int size;
                cout << "Enter request size: ";
                cin >> size;

                Request req(requestId++, size);
                Server* s = lb.assignRequest(req);

                cout << "Request assigned to Server " << s->id << endl;
                break;
            }

            case 2: {
                cout << "\n----- SERVER LOAD STATUS -----\n";
                for(auto s : servers) {
                    cout << "Server " << s->id 
                         << " | Load: " << s->load << endl;
                }
                break;
            }

            case 3: {
                cout << "\n----- SHORTEST PATH (from Node 0) -----\n";
                vector<int> dist = dijkstra(g, 0);

                for(int i = 0; i < dist.size(); i++) {
                    cout << "Node " << i 
                         << " -> Cost: " << dist[i] << endl;
                }
                break;
            }

            case 4:
                cout << "Exiting program...\n";
                break;

            default:
                cout << "Invalid choice! Try again.\n";
        }

    } while(choice != 4);

    return 0;
}