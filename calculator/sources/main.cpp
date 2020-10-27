#include <iostream>
#include "rk4.hpp"

int main(int argc, char** argv) 
{
    float* start = new float[9] { 0,1,1,1,1,1,1,1,1 };
    float* end = new float[9];

    rk4_step(start,end);

    for(int i = 0; i < 9; ++i) std::cout << end[i] << ' ';

    std::cout << '\n';
    return 0;
}