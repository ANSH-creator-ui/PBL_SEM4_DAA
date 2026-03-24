#ifndef REQUEST_H
#define REQUEST_H

class Request {
public:
    int id;
    int size;

    Request(int id, int size) {
        this->id = id;
        this->size = size;
    }
};

#endif