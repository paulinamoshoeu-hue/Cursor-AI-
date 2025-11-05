@echo off
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend install failed
    exit /b 1
)

echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend install failed
    exit /b 1
)

echo All dependencies installed successfully!
pause
