@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Laptop Cleanup & Speed Boost Pro v2.0
color 0A
cd /d "%~dp0"

:: ============================================================
::  LAPTOP CLEANUP AND SPEED BOOST PRO v2.0
::  Comprehensive Windows maintenance & performance toolkit
:: ============================================================

set "LOG=%TEMP%\LaptopCleanup_%DATE:~-4%%DATE:~-10,2%%DATE:~-7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%.log"
set "LOG=%LOG: =0%"
set "FREED_BEFORE=0"
set "FREED_AFTER=0"

call :RequireAdmin
call :Banner

echo  Log file: %LOG%
echo.
echo  Choose a mode:
echo.
echo    [1] Quick Cleanup      - Temp, caches, recycle bin, DNS
echo    [2] Full Boost         - Everything + services + optimize
echo    [3] Deep Clean         - Full Boost + system repair tools
echo    [4] Performance Only   - RAM, power plan, network tweaks
echo    [5] Exit
echo.
set /p "MODE=  Select option (1-5): "

if "%MODE%"=="1" goto QuickCleanup
if "%MODE%"=="2" goto FullBoost
if "%MODE%"=="3" goto DeepClean
if "%MODE%"=="4" goto PerfOnly
if "%MODE%"=="5" exit /b 0
echo  Invalid choice.
pause
exit /b 1

:: ============================================================
:QuickCleanup
call :StartRun "Quick Cleanup"
call :GetFreeSpace BEFORE
call :ClearUserTemp
call :ClearWindowsTemp
call :ClearRecent
call :FlushDNS
call :EmptyRecycleBin
call :ClearThumbnailCache
call :ClearBrowserCaches
call :GetFreeSpace AFTER
call :FinishRun
goto :eof

:: ============================================================
:FullBoost
call :StartRun "Full Boost"
call :GetFreeSpace BEFORE
call :ClearUserTemp
call :ClearWindowsTemp
call :ClearPrefetch
call :ClearRecent
call :FlushDNS
call :ClearWinUpdateCache
call :EmptyRecycleBin
call :ClearThumbnailCache
call :ClearBrowserCaches
call :ClearDeliveryOptimization
call :ClearErrorReports
call :ClearFontCache
call :ClearWindowsStoreCache
call :ClearCBSLogs
call :StopHeavyApps
call :OptimizeServices
call :NetworkTweaks
call :MemoryOptimize
call :SetHighPerformance
call :RunDiskCleanup
call :GetFreeSpace AFTER
call :FinishRun
goto :eof

:: ============================================================
:DeepClean
call :StartRun "Deep Clean"
call :GetFreeSpace BEFORE
call :ClearUserTemp
call :ClearWindowsTemp
call :ClearPrefetch
call :ClearRecent
call :FlushDNS
call :ClearWinUpdateCache
call :EmptyRecycleBin
call :ClearThumbnailCache
call :ClearBrowserCaches
call :ClearDeliveryOptimization
call :ClearErrorReports
call :ClearFontCache
call :ClearWindowsStoreCache
call :ClearCBSLogs
call :ClearEventLogs
call :StopHeavyApps
call :OptimizeServices
call :NetworkTweaks
call :MemoryOptimize
call :SetHighPerformance
call :RunDiskCleanup
call :SystemFileCheck
call :DISMRepair
call :OptimizeDrives
call :GetFreeSpace AFTER
call :FinishRun
goto :eof

:: ============================================================
:PerfOnly
call :StartRun "Performance Only"
call :StopHeavyApps
call :OptimizeServices
call :NetworkTweaks
call :MemoryOptimize
call :SetHighPerformance
call :FlushDNS
call :FinishRun
goto :eof

:: ============================================================
::  CORE ROUTINES
:: ============================================================

:RequireAdmin
net session >nul 2>&1
if %errorLevel% equ 0 goto :eof
echo.
echo  Requesting administrator privileges...
powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
exit /b

:Banner
cls
echo.
echo  ========================================================
echo.
echo       LAPTOP CLEANUP ^& SPEED BOOST PRO  v2.0
echo.
echo       Deep clean  ^|  Cache purge  ^|  Perf tweaks
echo.
echo  ========================================================
echo.
echo  WARNING: Close important work before continuing.
echo  Some steps stop apps and restart Windows services.
echo.
goto :eof

:StartRun
set "STEP_NUM=0"
echo.
echo  Starting: %~1
echo  Started: %DATE% %TIME% > "%LOG%"
echo  Mode: %~1 >> "%LOG%"
echo.
goto :eof

:FinishRun
echo.
echo  ========================================================
echo                    CLEANUP COMPLETE
echo  ========================================================
echo.
if defined FREED_BEFORE if defined FREED_AFTER (
    set /a "DIFF=FREED_AFTER-FREED_BEFORE" 2>nul
    if !DIFF! gtr 0 (
        echo  Approximate free space gained: !DIFF! MB
        echo  Free space gained: !DIFF! MB >> "%LOG%"
    ) else (
        echo  Free space check finished. See Disk Cleanup results above.
    )
)
echo.
echo  Log saved to:
echo  %LOG%
echo.
echo  Tips for lasting speed:
echo    - Restart your PC now
echo    - Keep startup apps minimal (Task Manager ^> Startup)
echo    - Uninstall apps you never use
echo    - Use an SSD if you still have an HDD
echo.
echo  Finished: %DATE% %TIME% >> "%LOG%"
pause
exit /b 0

:Step
set /a STEP_NUM+=1
echo  [!STEP_NUM!] %~1
echo  [!STEP_NUM!] %~1 >> "%LOG%"
goto :eof

:GetFreeSpace
for /f "tokens=3" %%a in ('dir /-c "%SystemDrive%\" 2^>nul ^| find "bytes free"') do set "BYTES=%%a"
set "BYTES=%BYTES:,=%"
if "%~1"=="BEFORE" (
    set /a "FREED_BEFORE=%BYTES%/1048576" 2>nul
) else (
    set /a "FREED_AFTER=%BYTES%/1048576" 2>nul
)
goto :eof

:: ============================================================
::  CLEANUP STEPS
:: ============================================================

:ClearUserTemp
call :Step "Clearing user temp files..."
del /q /f /s "%TEMP%\*" >nul 2>&1
for /d %%D in ("%TEMP%\*") do rd /s /q "%%D" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Temp\*" >nul 2>&1
for /d %%D in ("%LOCALAPPDATA%\Temp\*") do rd /s /q "%%D" >nul 2>&1
goto :eof

:ClearWindowsTemp
call :Step "Clearing Windows temp files..."
del /q /f /s "%SystemRoot%\Temp\*" >nul 2>&1
for /d %%D in ("%SystemRoot%\Temp\*") do rd /s /q "%%D" >nul 2>&1
del /q /f /s "%SystemRoot%\Logs\CBS\*.log" >nul 2>&1
del /q /f /s "%SystemRoot%\Logs\DISM\*.log" >nul 2>&1
goto :eof

:ClearPrefetch
call :Step "Clearing Prefetch cache..."
:: Prefetch helps HDD boot speed; clearing frees space / resets stale entries
del /q /f /s "%SystemRoot%\Prefetch\*" >nul 2>&1
goto :eof

:ClearRecent
call :Step "Clearing recent files & jump lists..."
del /q /f /s "%APPDATA%\Microsoft\Windows\Recent\*" >nul 2>&1
del /q /f /s "%APPDATA%\Microsoft\Windows\Recent\AutomaticDestinations\*" >nul 2>&1
del /q /f /s "%APPDATA%\Microsoft\Windows\Recent\CustomDestinations\*" >nul 2>&1
goto :eof

:FlushDNS
call :Step "Flushing DNS resolver cache..."
ipconfig /flushdns >nul 2>&1
nbtstat -R >nul 2>&1
nbtstat -RR >nul 2>&1
goto :eof

:ClearWinUpdateCache
call :Step "Clearing Windows Update download cache..."
net stop wuauserv >nul 2>&1
net stop bits >nul 2>&1
net stop cryptSvc >nul 2>&1
net stop msiserver >nul 2>&1
del /q /f /s "%SystemRoot%\SoftwareDistribution\Download\*" >nul 2>&1
for /d %%D in ("%SystemRoot%\SoftwareDistribution\Download\*") do rd /s /q "%%D" >nul 2>&1
net start cryptSvc >nul 2>&1
net start bits >nul 2>&1
net start wuauserv >nul 2>&1
net start msiserver >nul 2>&1
goto :eof

:EmptyRecycleBin
call :Step "Emptying Recycle Bin (all drives)..."
powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1
goto :eof

:ClearThumbnailCache
call :Step "Clearing thumbnail & icon caches..."
taskkill /f /im explorer.exe >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Windows\Explorer\thumbcache_*.db" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Windows\Explorer\iconcache_*.db" >nul 2>&1
del /q /f "%LOCALAPPDATA%\IconCache.db" >nul 2>&1
start explorer.exe
goto :eof

:ClearBrowserCaches
call :Step "Clearing browser caches (Edge / Chrome / Firefox)..."
:: Microsoft Edge
taskkill /f /im msedge.exe >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Code Cache\*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\GPUCache\*" >nul 2>&1
:: Google Chrome
taskkill /f /im chrome.exe >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache\*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\GPUCache\*" >nul 2>&1
:: Firefox
taskkill /f /im firefox.exe >nul 2>&1
for /d %%P in ("%LOCALAPPDATA%\Mozilla\Firefox\Profiles\*") do (
    del /q /f /s "%%P\cache2\*" >nul 2>&1
)
goto :eof

:ClearDeliveryOptimization
call :Step "Clearing Delivery Optimization cache..."
net stop dosvc >nul 2>&1
del /q /f /s "%SystemRoot%\SoftwareDistribution\DeliveryOptimization\*" >nul 2>&1
net start dosvc >nul 2>&1
goto :eof

:ClearErrorReports
call :Step "Clearing Windows Error Reporting dumps..."
del /q /f /s "%LOCALAPPDATA%\Microsoft\Windows\WER\*" >nul 2>&1
del /q /f /s "%ProgramData%\Microsoft\Windows\WER\*" >nul 2>&1
del /q /f /s "%SystemRoot%\Minidump\*" >nul 2>&1
del /q /f "%SystemRoot%\MEMORY.DMP" >nul 2>&1
goto :eof

:ClearFontCache
call :Step "Rebuilding font cache..."
net stop FontCache >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\Microsoft\Windows\Fonts\*" >nul 2>&1
del /q /f "%SystemRoot%\ServiceProfiles\LocalService\AppData\Local\FontCache\*" >nul 2>&1
net start FontCache >nul 2>&1
goto :eof

:ClearWindowsStoreCache
call :Step "Resetting Microsoft Store cache (wsreset)..."
start /wait wsreset.exe >nul 2>&1
timeout /t 2 /nobreak >nul
taskkill /f /im WinStore.App.exe >nul 2>&1
taskkill /f /im ApplicationFrameHost.exe >nul 2>&1
goto :eof

:ClearCBSLogs
call :Step "Clearing Component-Based Servicing leftover logs..."
del /q /f "%SystemRoot%\Logs\CBS\CBS.log" >nul 2>&1
del /q /f /s "%SystemRoot%\Logs\WindowsUpdate\*" >nul 2>&1
goto :eof

:ClearEventLogs
call :Step "Clearing Windows Event Logs..."
for /f "tokens=*" %%L in ('wevtutil el') do (
    wevtutil cl "%%L" >nul 2>&1
)
goto :eof

:StopHeavyApps
call :Step "Stopping heavy background apps..."
for %%A in (
    OneDrive.exe Skype.exe Spotify.exe Teams.exe Discord.exe
    Cortana.exe Slack.exe Zoom.exe Steam.exe EpicGamesLauncher.exe
    AdobeDesktopService.exe Creative Cloud.exe Dropbox.exe
    YourPhone.exe PhoneExperienceHost.exe GameBar.exe GameBarPresenceWriter.exe
) do (
    taskkill /f /im "%%A" >nul 2>&1
)
goto :eof

:OptimizeServices
call :Step "Tuning non-critical services for better responsiveness..."
:: Manual start = still available when needed, less idle load
sc config SysMain start= auto >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1
sc config dmwappushservice start= disabled >nul 2>&1
sc config WSearch start= delayed-auto >nul 2>&1
sc config XboxGipSvc start= demand >nul 2>&1
sc config XblAuthManager start= demand >nul 2>&1
sc config XblGameSave start= demand >nul 2>&1
sc config XboxNetApiSvc start= demand >nul 2>&1
sc config Fax start= disabled >nul 2>&1
sc config RemoteRegistry start= disabled >nul 2>&1
:: Keep SysMain running (Superfetch) — helps HDD/hybrid systems
net start SysMain >nul 2>&1
goto :eof

:NetworkTweaks
call :Step "Applying network performance tweaks..."
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1
netsh int tcp set global ecncapability=enabled >nul 2>&1
ipconfig /flushdns >nul 2>&1
:: Full Winsock/IP reset is reserved for Deep Clean (needs reboot)
goto :eof

:MemoryOptimize
call :Step "Reporting memory status & requesting GC..."
powershell -NoProfile -Command ^
  "$os=Get-CimInstance Win32_OperatingSystem; " ^
  "$free=[math]::Round($os.FreePhysicalMemory/1MB,2); " ^
  "$total=[math]::Round($os.TotalVisibleMemorySize/1MB,2); " ^
  "Write-Host ('     RAM free: ' + $free + ' GB / ' + $total + ' GB'); " ^
  "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers()"
if exist "%~dp0EmptyStandbyList.exe" (
    "%~dp0EmptyStandbyList.exe" standbylist >nul 2>&1
)
goto :eof

:SetHighPerformance
call :Step "Switching to High Performance power plan..."
powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c >nul 2>&1
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c >nul 2>&1
:: Disable hibernate file reclaim (optional space vs fast startup)
:: Uncomment next line if you want maximum disk reclaim:
:: powercfg -h off
goto :eof

:RunDiskCleanup
call :Step "Running Disk Cleanup (system files profile)..."
:: Pre-configure sage set 1 for common junk categories
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Temporary Files" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Recycle Bin" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Thumbnail Cache" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Delivery Optimization Files" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Windows Error Reporting Files" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Update Cleanup" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Previous Installations" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\System error memory dump files" /v StateFlags0001 /t REG_DWORD /d 2 /f >nul 2>&1
cleanmgr /sagerun:1
goto :eof

:SystemFileCheck
call :Step "Running System File Checker (SFC) — may take several minutes..."
sfc /scannow
goto :eof

:DISMRepair
call :Step "Running DISM component store repair — may take several minutes..."
DISM /Online /Cleanup-Image /StartComponentCleanup
DISM /Online /Cleanup-Image /RestoreHealth
goto :eof

:OptimizeDrives
call :Step "Optimizing drives (TRIM for SSD / defrag for HDD)..."
defrag %SystemDrive% /O >nul 2>&1
call :Step "Resetting Winsock & TCP/IP stack (reboot recommended)..."
netsh winsock reset catalog >nul 2>&1
netsh int ip reset >nul 2>&1
goto :eof
