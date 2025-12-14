# 📤 GitHub上传指南

本指南将帮助您将社团签到系统上传到GitHub。

## 🚀 方法一：使用上传脚本（推荐）

1. **打开PowerShell**
   - 在项目文件夹中，按住 `Shift` 键，然后右键点击空白处
   - 选择"在此处打开PowerShell窗口"

2. **运行上传脚本**
   ```powershell
   .\upload-to-github.ps1
   ```

3. **按照脚本提示操作**
   - 脚本会自动初始化git仓库
   - 添加并提交所有文件
   - 提示您输入GitHub仓库地址

## 📝 方法二：手动操作

### 第一步：创建GitHub仓库

1. 访问 [GitHub.com](https://github.com) 并登录您的账号
2. 点击右上角的 `+` 按钮，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**: 输入仓库名称（例如：`club-checkin-system`）
   - **Description**: 可选，输入项目描述
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - ⚠️ **不要勾选** "Initialize this repository with a README"
4. 点击 `Create repository`

### 第二步：初始化Git仓库

在项目文件夹中打开PowerShell或命令提示符，执行以下命令：

```powershell
# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 社团签到系统"
```

### 第三步：连接到GitHub并推送

```powershell
# 添加远程仓库（将 YOUR_USERNAME 和 REPO_NAME 替换为您的实际信息）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 重命名分支为main
git branch -M main

# 推送到GitHub
git push -u origin main
```

## 🔑 如果遇到认证问题

### 使用Personal Access Token（推荐）

1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token"
3. 选择权限：至少勾选 `repo` 权限
4. 生成并复制token
5. 推送时，密码输入框输入token而不是GitHub密码

### 或使用GitHub CLI

```powershell
# 安装GitHub CLI后
gh auth login
git push -u origin main
```

## ✅ 验证上传成功

上传完成后，访问您的GitHub仓库页面，应该能看到以下文件：
- `index.html`
- `main.js`
- `style.css`
- `README.md`
- `AI_INTEGRATION_GUIDE.md`
- `.gitignore`

## 🌐 启用GitHub Pages（可选）

如果您想通过GitHub Pages部署网站：

1. 进入仓库的 `Settings` 页面
2. 在左侧菜单找到 `Pages`
3. 在 `Source` 下选择 `main` 分支和 `/ (root)` 文件夹
4. 点击 `Save`
5. 几分钟后，您的网站将在 `https://YOUR_USERNAME.github.io/REPO_NAME` 可用

## 📋 后续更新代码

当您修改代码后，使用以下命令更新GitHub：

```powershell
git add .
git commit -m "描述您的更改"
git push
```

## ❓ 常见问题

**Q: 提示需要用户名和密码？**
A: GitHub已不支持密码认证，请使用Personal Access Token。

**Q: 提示权限被拒绝？**
A: 检查仓库地址是否正确，或确认您有该仓库的写入权限。

**Q: 如何删除远程仓库？**
A: 使用 `git remote remove origin` 删除当前的远程仓库配置。

---

💡 **提示**：如果遇到任何问题，请检查：
- 是否已安装Git（运行 `git --version` 检查）
- 仓库地址是否正确
- 是否有网络连接


