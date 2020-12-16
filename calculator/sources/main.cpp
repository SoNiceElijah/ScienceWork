#include <iostream>
#include <fstream>
#include "rk4.hpp"
#include <chrono>

int main(int argc, char** argv) 
{
    float* start = new float[9] { 0,1,0 };
    float* end = new float[9];

    float step = 0.001F;

    int from = 0;
    int to = 2000 * 1000;
    if(argc > 1) from = atoi(argv[1]);
    if(argc > 2) to = atoi(argv[2]) * 1000;

    std::ofstream file;
    file.open("result.csv");

    auto ts = std::chrono::high_resolution_clock::now();

    int i = 0;
    while(i < from) 
    {
        rk4_step(start,end,step);

        //swap buffers
        float* tmp = start;
        start = end;
        end = tmp;

        ++i;
    }
    while(i < to)
    {
        float* tmp;

        rk4_step(start,end,step);

        file
            << end[0] << "," 
            << end[1] << "," 
            << end[2] << "," 
            << end[3] << "," 
            << end[4] << "," 
            << end[5] << "," 
            << end[6] << "," 
            << end[7] << "," 
            << end[8] << "\n";


        tmp = start;
        start = end;
        end = tmp;

        ++i;

        rk4_step(start,end,step);

        tmp = start;
        start = end;
        end = tmp;

        ++i;

        rk4_step(start,end,step);

        tmp = start;
        start = end;
        end = tmp;

        ++i;

        rk4_step(start,end,step);

        tmp = start;
        start = end;
        end = tmp;

        ++i;
    }

    auto tf = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> time = tf - ts;

    file.close();
    std::cout << "Elapsed time: " << time.count() << "s\n";
    return 0;
}