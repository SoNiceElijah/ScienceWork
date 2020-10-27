cmake_minimum_required (VERSION 3.1)
project(Calc VERSION 0.5.0 LANGUAGES CXX)

file(GLOB_RECURSE SOURCES 
    "${CMAKE_CURRENT_SOURCE_DIR}/sources/*.cpp"
)

file(GLOB_RECURSE HEADERS 
    "${CMAKE_CURRENT_SOURCE_DIR}/headers/*.hpp"
)

add_executable("calcapp" ${HEADERS} ${SOURCES})
target_include_directories("calcapp" PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/headers")