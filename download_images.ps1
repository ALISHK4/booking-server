# Скрипт загрузки фотографий направлений для WoOx Travel
# Запустить: правая кнопка мыши -> "Выполнить с помощью PowerShell"
# Или в терминале: powershell -ExecutionPolicy Bypass -File download_images.ps1

$dest = "assets\images"

$photos = @(
    @{ file = "country-paris.jpg";      url = "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-caribbean.jpg";  url = "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-lausanne.jpg";   url = "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-cuba.jpg";       url = "https://images.pexels.com/photos/2916462/pexels-photo-2916462.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-punta-cana.jpg"; url = "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-jamaica.jpg";    url = "https://images.pexels.com/photos/3616764/pexels-photo-3616764.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-london.jpg";     url = "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-pristina.jpg";   url = "https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=640" },
    @{ file = "country-zurich.jpg";     url = "https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=640" }
)

foreach ($p in $photos) {
    $outPath = Join-Path $dest $p.file
    Write-Host "Скачиваю $($p.file)..." -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $p.url -OutFile $outPath -UseBasicParsing -TimeoutSec 30
        $size = (Get-Item $outPath).Length
        if ($size -gt 10000) {
            Write-Host "  OK — $([math]::Round($size/1024)) KB" -ForegroundColor Green
        } else {
            Write-Host "  ПРЕДУПРЕЖДЕНИЕ: файл слишком маленький ($size байт), возможно ошибка" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ОШИБКА: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Готово! Проверьте папку assets\images\" -ForegroundColor Green
