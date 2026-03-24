#ifndef LOAD_BALANCER_H
#define LOAD_BALANCER_H
#include "request.h"
#include <queue>
#include <vector>
#include "server.h"
using namespace std;

// Comparator for Min Heap
struct Compare {
    bool operator()(Server* a, Server* b) {
        return a->load > b->load;
    }
};

class LoadBalancer {
public:
    priority_queue<Server*, vector<Server*>, Compare> pq;

    LoadBalancer(vector<Server*>& servers) {
        for (auto s : servers)
            pq.push(s);
    }

    Server* assignRequest(Request& req) {
        Server* s = pq.top();
        pq.pop();

        s->load += req.size;

        pq.push(s);
        return s;
    }
};

#endif