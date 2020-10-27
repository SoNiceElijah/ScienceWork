@echo off
cd ..
if exist build del build /s /q
mkdir build
cd build
cmake ..