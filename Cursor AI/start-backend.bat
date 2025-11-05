@echo off
echo Starting backend server...
cd backend
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)

echo Running database migration...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo Failed to run migration
    pause
    exit /b 1
)

echo Starting server...
call npx ts-node-dev --respawn --transpile-only src/index.ts
