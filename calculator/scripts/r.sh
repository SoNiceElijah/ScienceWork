#!/bin/sh
cd ..
cd build
if test -d release; then 
    cd release
    calcapp
else
    if test -d debug; then
        cd debug
        ./calcapp
    else
        echo "not found"
    fi
fi