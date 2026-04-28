#include <iostream>
#include <vector>
#include <cstdlib>
#include <string>

#include "server.h"
#include "request.h"
#include "load_balancer.h"
#include "graph.h"
#include "dijkstra.h"

using namespace std;

int main(int argc, char *argv[])
{
    vector<Server *> servers;
    for (int i = 0; i < 3; i++)
        servers.push_back(new Server(i));

    LoadBalancer lb(servers);

    // 🔹 Shortest Path Mode
    if (argc > 1 && string(argv[1]) == "path")
    {
        Graph g(5);
        g.addEdge(0, 1, 2);
        g.addEdge(1, 2, 4);
        g.addEdge(0, 3, 1);
        g.addEdge(3, 4, 3);
        g.addEdge(4, 2, 1);

        vector<int> dist = dijkstra(g, 0);

        for (int d : dist)
            cout << d << " ";

        return 0;
    }

    // 🔹 Load Balancing Mode
    if (argc > 2)
    {
        int size = atoi(argv[1]);
        string algo = argv[2];

        int server_id = 0;

        if (algo == "greedy")
        {
            Request req(1, size);
            Server *s = lb.assignRequest(req);
            server_id = s->id;
        }
        else if (algo == "round")
        {
            static int rr = 0;
            server_id = rr % 3;
            rr++;
        }
        else if (algo == "random")
        {
            server_id = rand() % 3;
        }

        cout << server_id << endl;
        return 0;
    }

    cout << "No input provided\n";
    return 0;
}