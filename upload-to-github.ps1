# GitHub上传脚本
# 使用方法：在PowerShell中运行 ./upload-to-github.ps1

Write-Host "=== GitHub上传助手 ===" -ForegroundColor Green
Write-Host ""

# 检查是否已初始化git仓库
if (Test-Path .git) {
    Write-Host "✓ Git仓库已存在" -ForegroundColor Green
} else {
    Write-Host "正在初始化Git仓库..." -ForegroundColor Yellow
    git init
}

# 添加所有文件
Write-Host "正在添加文件..." -ForegroundColor Yellow
git add .

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "正在提交更改..." -ForegroundColor Yellow
    git commit -m "Initial commit: 社团签到系统"
    Write-Host "✓ 文件已提交" -ForegroundColor Green
} else {
    Write-Host "没有需要提交的更改" -ForegroundColor Yellow
}

# 检查远程仓库
$remote = git remote -v
if (-not $remote) {
    Write-Host ""
    Write-Host "请按照以下步骤操作：" -ForegroundColor Cyan
    Write-Host "1. 访问 https://github.com 并登录" -ForegroundColor White
    Write-Host "2. 点击右上角的 '+' 按钮，选择 'New repository'" -ForegroundColor White
    Write-Host "3. 输入仓库名称（例如：club-checkin-system）" -ForegroundColor White
    Write-Host "4. 选择 Public 或 Private" -ForegroundColor White
    Write-Host "5. 不要勾选 'Initialize this repository with a README'" -ForegroundColor White
    Write-Host "6. 点击 'Create repository'" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "请输入您的GitHub仓库地址 (例如: https://github.com/用户名/仓库名.git)"
    
    if ($repoUrl) {
        Write-Host "正在添加远程仓库..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        Write-Host "✓ 远程仓库已添加" -ForegroundColor Green
        
        Write-Host "正在推送到GitHub..." -ForegroundColor Yellow
        git branch -M main
        git push -u origin main
        Write-Host "✓ 代码已成功上传到GitHub！" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "远程仓库已配置：" -ForegroundColor Cyan
    Write-Host $remote
    Write-Host ""
    
    $push = Read-Host "是否现在推送到GitHub? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        git push -u origin main
        Write-Host "✓ 代码已成功上传到GitHub！" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green


