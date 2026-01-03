@echo off
echo ================================
echo Deploying Vertex Admin to EC2
echo ================================

echo.
echo [1/4] Building Angular project...
call ng build --configuration production

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Build completed!
    echo.
    echo [2/4] Uploading files to EC2...
    
    scp -i "C:\Users\navne\Downloads\vertexkalyan.pem" -r dist\vertex\* ubuntu@3.104.123.78:~/vertex_build/
    
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Files uploaded!
        echo.
        echo [3/4] Deploying on server...
        
        ssh -i "C:\Users\navne\Downloads\vertexkalyan.pem" ubuntu@3.104.123.78 "sudo rm -rf /var/www/html/* && sudo cp -r ~/vertex_build/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html/ && sudo systemctl restart nginx && rm -rf ~/vertex_build"
        
        echo [SUCCESS] Deployment complete!
        echo.
        echo [4/4] Done!
        echo ================================
        echo Your app is live at: http://3.104.123.78
        echo ================================
    ) else (
        echo [ERROR] Upload failed!
    )
) else (
    echo [ERROR] Build failed!
)

echo.
pause