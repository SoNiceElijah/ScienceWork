#ifndef __RK4_H__
#define __RK4_H__

#define FILLVECTOR(x,y) \
    x[0] = D_FUNC1(y) \
    x[1] = D_FUNC2(y) \
    x[2] = D_FUNC3(y) \
    x[3] = D_FUNC4(y) \
    x[4] = D_FUNC5(y) \
    x[5] = D_FUNC6(y) \
    x[6] = D_FUNC7(y) \
    x[7] = D_FUNC8(y)  

#define HVEC(v,s) \
    v[0] = s; \
    v[1] = s; \
    v[2] = s; \
    v[3] = s; \
    v[4] = s; \
    v[5] = s; \
    v[6] = s; \
    v[7] = s;

void rk4_step(float* point, float* next, float step = 0.01F);

#endif