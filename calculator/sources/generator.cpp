#include <cstdlib>
#include "generator.hpp"
#include <cmath>

using namespace gen;

int gen::play_poisson() 
{

    float border = exp(lambda);
    unsigned int x = 0;
    float r = ((float)rand() / RAND_MAX);
    while(r >= border) 
    { 
        ++x;
        border *= lambda / x;
    }
    return x;
}

float gen::play_rayleigh()
{
    float x = ((float)rand() / RAND_MAX);
    return sqrt(-2*alpha*alpha*log(1-x));
}