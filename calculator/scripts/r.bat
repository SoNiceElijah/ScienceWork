@echo off
cd .. 
cd build
if exist "Release" ( 
    cd Release 
) else ( 
    if exist "Debug" ( 
        cd Debug 
    ) else ( 
        ECHO not found
        goto  :exit
    )
)

calcapp.exe

:exit
