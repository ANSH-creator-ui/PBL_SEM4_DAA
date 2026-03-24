#ifndef SERVER_H
#define SERVER_H

class Server {
public:
    int id;
    int load;

    Server(int id) {
        this->id = id;
        this->load = 0;
    }
};

#endif