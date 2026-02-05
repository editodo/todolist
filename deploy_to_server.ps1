
# Editodo Server Deployment Script
# Usage: ./deploy_to_server.ps1
# Requires: SSH/SCP to be available in PATH
# Note: You will be prompted for the password (damiTex90!@) multiple times.

$ServerIP = "222.239.250.229"
$User = "root"
$RemotePath = "/var/www/editodo"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Editodo Server Deployment Automation" -ForegroundColor Cyan
Write-Host " Target: ${User}@${ServerIP}:${RemotePath}" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check for deploy folder
if (-not (Test-Path "deploy")) {
    Write-Error "Error: 'deploy' folder not found. Please verify the build step completed."
    exit
}

# 2. Upload Files via SCP
Write-Host "`n[1/4] Uploading files to server... (Password required: damiTex90!@)" -ForegroundColor Yellow
# Create directory first
ssh ${User}@${ServerIP} "mkdir -p ${RemotePath}"
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create remote directory."; exit }

# Upload contents
scp -r deploy/* ${User}@${ServerIP}:${RemotePath}
if ($LASTEXITCODE -ne 0) { Write-Error "Generic Upload Failed. Please check connection."; exit }
Write-Host "Upload Complete!" -ForegroundColor Green

# 3. Setup Database
Write-Host "`n[2/4] Setting up Database... (Password required)" -ForegroundColor Yellow
ssh ${User}@${ServerIP} "mysql -u root -p < ${RemotePath}/db_setup.sql"
Write-Host "Database Setup Attempted (Check output for errors)" -ForegroundColor Green

# 4. Install Dependencies & Start Backend
Write-Host "`n[3/4] Starting Backend Server... (Password required)" -ForegroundColor Yellow
$BackendCmd = "cd $RemotePath/server && npm install --production && pm2 start $RemotePath/ecosystem.config.js --env production && pm2 save"
ssh ${User}@${ServerIP} $BackendCmd
Write-Host "Backend Started!" -ForegroundColor Green

# 5. Configure Nginx
Write-Host "`n[4/4] Configuring Nginx... (Password required)" -ForegroundColor Yellow
$NginxCmd = "ln -sf $RemotePath/nginx.conf /etc/nginx/sites-enabled/editodo && nginx -t && systemctl restart nginx"
ssh ${User}@${ServerIP} $NginxCmd
Write-Host "Nginx Configured & Restarted!" -ForegroundColor Green

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " Deployment Procedure Completed!" -ForegroundColor Cyan
Write-Host " Please verify at http://editodo.com" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
