@echo off 

choice /t 5 /d y /n > nul  
start bin\run.exe

del %cd%\db\data\mongod.lock

set "bd=%cd%"
cd db
cd bin
mongod --dbpath "%bd%\db\data" --logpath "%bd%\db\log\MongoDB.log"

pause