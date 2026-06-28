$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot
& "$PSScriptRoot\deno.ps1" install --allow-scripts
