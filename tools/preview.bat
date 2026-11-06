@echo off
rem Builds preview.html and opens it in the browser (double-click to run).
rem On first run, installs the required packages into .venv inside this repository.
rem Kept ASCII-only so that cmd.exe reads it correctly under any code page.
setlocal
set ROOT=%~dp0..
set VENV=%ROOT%\.venv

if not exist "%VENV%\Scripts\python.exe" (
  echo Setting up for the first time...
  python -m venv "%VENV%" || goto :error
  "%VENV%\Scripts\python.exe" -m pip install -q -r "%~dp0requirements.txt" || goto :error
)

"%VENV%\Scripts\python.exe" "%~dp0preview.py" || goto :error
start "" "%ROOT%\preview.html"
exit /b 0

:error
echo.
echo Failed to build the preview. See the messages above.
pause
exit /b 1
