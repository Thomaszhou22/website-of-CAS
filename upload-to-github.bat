@echo off
chcp 65001 >nul
echo === GitHub上传助手 ===
echo.

REM 检查是否已初始化git仓库
if exist .git (
    echo ✓ Git仓库已存在
) else (
    echo 正在初始化Git仓库...
    git init
)

REM 添加所有文件
echo 正在添加文件...
git add .

REM 提交更改
echo 正在提交更改...
git commit -m "Initial commit: 社团签到系统"

REM 检查远程仓库
git remote -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo 请按照以下步骤操作：
    echo 1. 访问 https://github.com 并登录
    echo 2. 点击右上角的 + 按钮，选择 New repository
    echo 3. 输入仓库名称（例如：club-checkin-system）
    echo 4. 选择 Public 或 Private
    echo 5. 不要勾选 Initialize this repository with a README
    echo 6. 点击 Create repository
    echo.
    set /p repoUrl="请输入您的GitHub仓库地址 (例如: https://github.com/用户名/仓库名.git): "
    
    if not "!repoUrl!"=="" (
        echo 正在添加远程仓库...
        git remote add origin %repoUrl%
        echo ✓ 远程仓库已添加
        
        echo 正在推送到GitHub...
        git branch -M main
        git push -u origin main
        echo ✓ 代码已成功上传到GitHub！
    )
) else (
    echo.
    echo 远程仓库已配置：
    git remote -v
    echo.
    set /p push="是否现在推送到GitHub? (y/n): "
    if /i "!push!"=="y" (
        git push -u origin main
        echo ✓ 代码已成功上传到GitHub！
    )
)

echo.
echo 完成！
pause

