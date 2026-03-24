#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include <vector>
#include <queue>
#include <climits>
#include "graph.h"
using namespace std;

vector<int> dijkstra(Graph& g, int src) {
    vector<int> dist(g.V, INT_MAX);
    dist[src] = 0;

    priority_queue<pair<int,int>, 
        vector<pair<int,int>>, 
        greater<pair<int,int>>> pq;

    pq.push({0, src});

    while(!pq.empty()) {
       pair<int,int> top = pq.top();
int d = top.first;
int u = top.second;
        pq.pop();

        for(auto &edge : g.adj[u]) {
            int v = edge.first;
            int w = edge.second;

            if(dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}

#endif