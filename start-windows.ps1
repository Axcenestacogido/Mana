# Arranca Mana en local sin Docker (Windows).
#   powershell -ExecutionPolicy Bypass -File .\start-windows.ps1
#
# Instala las dependencias la primera vez, levanta el backend en una ventana
# aparte y sirve el frontend en http://localhost:5173

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot

function Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red; exit 1 }

# --- Comprobar Python y Node ---------------------------------------------------
$Python = $null
foreach ($candidate in @('py', 'python')) {
    $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
    # En Windows 'python' puede ser el alias de la Microsoft Store, que no ejecuta nada.
    if ($cmd -and $cmd.Source -notlike '*WindowsApps*') { $Python = $candidate; break }
}
if (-not $Python) {
    Fail "No se encuentra Python. Instalalo con: winget install -e --id Python.Python.3.11"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Fail "No se encuentra Node.js. Instalalo con: winget install -e --id OpenJS.NodeJS.LTS"
}

# --- Backend: entorno virtual + dependencias -----------------------------------
$VenvPython = Join-Path $Root '.venv\Scripts\python.exe'
if (-not (Test-Path $VenvPython)) {
    Info 'Creando el entorno virtual de Python...'
    & $Python -m venv (Join-Path $Root '.venv')
}
Info 'Instalando las dependencias del backend...'
& $VenvPython -m pip install --quiet --upgrade pip
& $VenvPython -m pip install --quiet -r (Join-Path $Root 'backend\requirements.txt')

# --- Frontend: dependencias ----------------------------------------------------
if (-not (Test-Path (Join-Path $Root 'frontend\node_modules'))) {
    Info 'Instalando las dependencias del frontend (tarda unos minutos)...'
    Push-Location (Join-Path $Root 'frontend')
    npm install
    Pop-Location
}

# --- Aviso sobre el .env -------------------------------------------------------
if (-not (Test-Path (Join-Path $Root '.env'))) {
    Write-Host "[AVISO] No hay .env. Las funciones de IA no funcionaran." -ForegroundColor Yellow
    Write-Host "        Crealo con: Copy-Item .env.example .env" -ForegroundColor Yellow
}

# --- Arrancar el backend en otra ventana ---------------------------------------
Info 'Arrancando el backend en http://localhost:8000 ...'
Start-Process -FilePath $VenvPython `
    -ArgumentList '-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000' `
    -WorkingDirectory (Join-Path $Root 'backend')

# --- Servir el frontend --------------------------------------------------------
Info 'Arrancando el frontend. Abre http://localhost:5173 cuando aparezca la URL.'
Info 'Para parar: Ctrl+C aqui, y cierra la ventana del backend.'
Set-Location (Join-Path $Root 'frontend')
npm run dev
