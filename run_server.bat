@echo off
rem Simple local HTTP server for the Works Game
rem Attempts to use Python if available; otherwise falls back to PowerShell.

:: Try Python HTTP server
python -c "import http.server, socketserver, sys;" >nul 2>&1
if not errorlevel 1 (
    echo Starting Python HTTP server on port 8080 ...
    python -m http.server 8080 --bind 0.0.0.0
    goto :eof
)

:: Fallback to PowerShell Simple HTTP server
powershell -NoProfile -Command "& {\r\n    $port = 8080;\r\n    $listener = [System.Net.HttpListener]::new();\r\n    $listener.Prefixes.Add('http://0.0.0.0:' + $port + '/');\r\n    $listener.Start();\r\n    Write-Host 'PowerShell HTTP server listening on http://0.0.0.0:' + $port;\r\n    while($listener.IsListening){\r\n        $context = $listener.GetContext();\r\n        $request = $context.Request;\r\n        $response = $context.Response;\r\n        $localPath = Join-Path -Path (Get-Location) -ChildPath $request.Url.AbsolutePath.TrimStart('/');\r\n        if(Test-Path $localPath -PathType Leaf){\r\n            $bytes = [System.IO.File]::ReadAllBytes($localPath);\r\n            $response.ContentLength64 = $bytes.Length;\r\n            $response.OutputStream.Write($bytes,0,$bytes.Length);\r\n        } else {\r\n            $response.StatusCode = 404;\r\n            $msg = 'Not Found';\r\n            $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg);\r\n            $response.ContentLength64 = $bytes.Length;\r\n            $response.OutputStream.Write($bytes,0,$bytes.Length);\r\n        }\r\n        $response.OutputStream.Close();\r\n    }\r\n    $listener.Stop();\r\n}"
