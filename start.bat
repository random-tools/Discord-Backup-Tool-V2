@echo off

if exist node_modules\ (
  node index.js
  pause
) else (
  call npm i >> NUL
  node index.js
  pause
)