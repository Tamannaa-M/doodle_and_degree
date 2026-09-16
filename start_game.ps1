$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$bundledPython = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$workspacePackages = Join-Path $PSScriptRoot '../../work/python-packages'
if (Test-Path -LiteralPath $bundledPython) {
    $gamePython = $bundledPython
} else {
    $gamePython = (Get-Command python -ErrorAction Stop).Source
}
if (Test-Path -LiteralPath '.runtime') {
    $env:PYTHONPATH = (Resolve-Path -LiteralPath '.runtime').Path
} elseif (Test-Path -LiteralPath $workspacePackages) {
    $env:PYTHONPATH = (Resolve-Path -LiteralPath $workspacePackages).Path
}
& $gamePython -c 'import fastapi, uvicorn, pymupdf, multipart, websockets'
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Installing game dependencies. This only happens on first launch.'
    & $gamePython -m pip install --target .runtime -r requirements.txt
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
    $env:PYTHONPATH = (Resolve-Path -LiteralPath '.runtime').Path
}
$env:PYTHONUTF8 = '1'
Write-Host 'Open http://localhost:8001 in your browser. Keep this window open while playing.'
& $gamePython run.py
