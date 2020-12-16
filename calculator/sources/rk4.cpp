#include "rk4.hpp"
#include "funcs.hpp"

#include <immintrin.h>

#include <iostream>

void rk4_step(float* point, float* next, float step)
{
    float HTMP[8];
    HVEC(HTMP,step);
    float tnext = point[0] + step;

    float H2TMP[8];
    step = step / 2;
    HVEC(H2TMP,step);
    float t2 = point[0] + step;

    float H6TMP[8];
    step = step / 3;
    HVEC(H6TMP,step);

    float S2[8];
    HVEC(S2,2.0);

    float POINT[9];
    float VALUES[8];

    __m256 h = _mm256_loadu_ps(HTMP);
    __m256 h2 = _mm256_loadu_ps(H2TMP);
    __m256 h6 = _mm256_loadu_ps(H6TMP);
    __m256 i2 = _mm256_loadu_ps(S2);

    __m256 p0 = _mm256_loadu_ps(point+1);

    FILLVECTOR(VALUES,point);
    __m256 v0 = _mm256_loadu_ps(VALUES);

    __m256 p1_r = _mm256_mul_ps(h2,v0);
    __m256 p1 = _mm256_add_ps(p1_r,p0);

    _mm256_storeu_ps(POINT+1,p1);
    POINT[0] = t2;
    FILLVECTOR(VALUES,POINT);
    __m256 v1 = _mm256_loadu_ps(VALUES);

    __m256 p2_r = _mm256_mul_ps(h2,v1);
    __m256 p2 = _mm256_add_ps(p2_r,p1);

    _mm256_storeu_ps(POINT+1,p2);
    POINT[0] = t2;
    FILLVECTOR(VALUES,POINT);
    __m256 v2 = _mm256_loadu_ps(VALUES);

    __m256 p3_r = _mm256_mul_ps(h,v2);
    __m256 p3 = _mm256_add_ps(p3_r,p2);

    _mm256_storeu_ps(POINT+1,p3);
    POINT[0] = tnext;
    FILLVECTOR(VALUES,POINT);
    __m256 v3 = _mm256_loadu_ps(VALUES);

    __m256 a1 = _mm256_mul_ps(v1,i2);
    __m256 a2 = _mm256_mul_ps(v2,i2);
    __m256 a0 = _mm256_add_ps(a1,a2);

    __m256 b1 = _mm256_add_ps(a0,v0);
    __m256 b0 = _mm256_add_ps(b1,v3);

    __m256 c0 = _mm256_mul_ps(b0,h6);
    __m256 res = _mm256_add_ps(p0,c0);

    next[0] = tnext;
    _mm256_storeu_ps(next+1,res);
    
}