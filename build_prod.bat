@echo off

Powershell.exe -executionpolicy remotesigned -File ./prepare_build.ps1 %cd% C:\PARAGON\workspace\clare_api\src\main\resources prod
