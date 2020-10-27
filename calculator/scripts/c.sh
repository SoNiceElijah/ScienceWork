#!/bin/sh
cd ..
if test ! -d build; then  
    mkdir build 
fi
cd build
cmake ..