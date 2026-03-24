#ifndef GRAPH_H
#define GRAPH_H

#include <vector>
using namespace std;

class Graph {
public:
    int V;
    vector<vector<pair<int,int>>> adj;

    Graph(int V) {
        this->V = V;
        adj.resize(V);
    }

    void addEdge(int u, int v, int w) {
        adj[u].push_back({v,w});
        adj[v].push_back({u,w});
    }
};

#endif
