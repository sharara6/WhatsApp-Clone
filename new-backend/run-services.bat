@echo off
echo Starting WhatsApp Clone Backend Services...
echo.
echo Starting User Service on port 5001...
start cmd /k "cd user-service && npm run dev"
echo.
echo Starting Message Service on port 5002...
start cmd /k "cd message-service && npm run dev"
echo.
echo Both services should now be running.
echo User Service: http://localhost:5001
echo Message Service: http://localhost:5002
echo. 