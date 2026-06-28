$ErrorActionPreference = "Stop"

$DenoExe = Join-Path $env:USERPROFILE ".deno\bin\deno.exe"

if (-not (Test-Path $DenoExe)) {
  Write-Error @"
Deno is not installed. Run:

  irm https://deno.land/install.ps1 | iex

Then open a new terminal.
"@
}

& $DenoExe @args
