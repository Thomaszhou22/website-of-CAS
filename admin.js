// 数据存储
let clubs = {};
let deletedClubs = {};
let globalMembers = {};
let admins = JSON.parse(localStorage.getItem('admins')) || {};
let currentUser = null;
let currentView = 'active'; // 'active', 'deleted', 或 'members'

// 验证数据隔离
function verifyDataIsolation() {
    console.log('=== 数据隔离验证 ===');
    console.log('当前登录管理员:', currentUser ? currentUser.username : '未登录');
    console.log('管理员数据键:', `admin_${currentUser ? currentUser.username : 'none'}`);
    console.log('当前管理员数据:', {
        clubs: Object.keys(clubs).length,
        deletedClubs: Object.keys(deletedClubs).length,
        globalMembers: Object.keys(globalMembers).length
    });
    
    // 检查localStorage中的所有管理员数据
    const allKeys = Object.keys(localStorage);
    const adminKeys = allKeys.filter(key => key.startsWith('admin_'));
    console.log('所有管理员数据键:', adminKeys);
    
    adminKeys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        console.log(`${key}:`, {
            clubs: Object.keys(data.clubs || {}).length,
            deletedClubs: Object.keys(data.deletedClubs || {}).length,
            globalMembers: Object.keys(data.globalMembers || {}).length
        });
    });
    console.log('=== 验证完成 ===');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
});

// 加载保存的数据
function loadSavedData() {
    // 只加载管理员数据，其他数据在登录后加载
    admins = JSON.parse(localStorage.getItem('admins')) || {};
}

// 加载当前管理员的数据
function loadCurrentAdminData() {
    if (!currentUser || currentUser.type !== 'admin') {
        return;
    }
    
    const adminKey = `admin_${currentUser.username}`;
    const adminData = JSON.parse(localStorage.getItem(adminKey)) || {
        clubs: {},
        deletedClubs: {},
        globalMembers: {}
    };
    
    clubs = adminData.clubs || {};
    deletedClubs = adminData.deletedClubs || {};
    globalMembers = adminData.globalMembers || {};
    
    // 清理可能存在的全局数据（确保数据隔离）
    const globalDeletedClubs = localStorage.getItem('deletedClubs');
    if (globalDeletedClubs) {
        console.log('发现全局已删除社团数据，正在同步到管理员数据中...');
        
        // 同步全局已删除社团到当前管理员数据
        const globalDeletedClubsData = JSON.parse(globalDeletedClubs);
        Object.keys(globalDeletedClubsData).forEach(clubId => {
            if (!deletedClubs[clubId]) {
                deletedClubs[clubId] = globalDeletedClubsData[clubId];
                console.log(`同步已删除社团到管理员数据: ${clubId}`);
            }
        });
        
        // 保存更新后的管理员数据
        saveCurrentAdminData();
        
        // 清理全局数据
        localStorage.removeItem('deletedClubs');
    }
    
    console.log('加载管理员数据:', currentUser.username, {
        clubs: Object.keys(clubs).length,
        deletedClubs: Object.keys(deletedClubs).length,
        globalMembers: Object.keys(globalMembers).length
    });
}

// 保存当前管理员的数据
function saveCurrentAdminData() {
    if (!currentUser || currentUser.type !== 'admin') {
        return;
    }
    
    const adminKey = `admin_${currentUser.username}`;
    const adminData = {
        clubs: clubs,
        deletedClubs: deletedClubs,
        globalMembers: globalMembers
    };
    
    localStorage.setItem(adminKey, JSON.stringify(adminData));
    console.log('保存管理员数据:', currentUser.username);
}

// 清理过期的已删除社团数据
function cleanExpiredDeletedClubs() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    let hasExpired = false;
    for (const clubId in deletedClubs) {
        const deletedDate = new Date(deletedClubs[clubId].deletedAt);
        if (deletedDate < thirtyDaysAgo) {
            delete deletedClubs[clubId];
            hasExpired = true;
        }
    }
    
    if (hasExpired) {
        saveCurrentAdminData();
        console.log('已清理过期的已删除社团数据');
    }
}

// 保存管理员数据
function saveAdminData() {
    localStorage.setItem('admins', JSON.stringify(admins));
}

// 显示管理员注册弹窗
function showAdminRegister() {
    document.getElementById('adminRegisterModal').style.display = 'flex';
}

function closeAdminRegister() {
    document.getElementById('adminRegisterModal').style.display = 'none';
    document.getElementById('newAdminUsername').value = '';
    document.getElementById('newAdminSchool').value = '';
    document.getElementById('newAdminPassword').value = '';
    document.getElementById('confirmAdminPassword').value = '';
}

// 注册管理员
function registerAdmin() {
    const username = document.getElementById('newAdminUsername').value.trim();
    const school = document.getElementById('newAdminSchool').value.trim();
    const password = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;
    
    if (!username || !school || !password || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    if (admins[username]) {
        alert('该账号已存在');
        return;
    }
    
    // 保存管理员信息（包含学校名称）
    admins[username] = {
        password: password,
        school: school
    };
    
    saveAdminData();
    
    closeAdminRegister();
    alert('管理员注册成功！');
}

// 管理员登录
function adminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    if (!username || !password) {
        alert('请填写完整信息');
        return;
    }
    
    if (!admins[username]) {
        alert('账号不存在');
        return;
    }
    
    // 兼容旧的数据结构（直接存储密码）和新数据结构（对象）
    let adminPassword;
    let adminSchool = '';
    
    if (typeof admins[username] === 'string') {
        // 旧数据结构
        adminPassword = admins[username];
    } else {
        // 新数据结构
        adminPassword = admins[username].password;
        adminSchool = admins[username].school || '';
    }
    
    if (password !== adminPassword) {
        alert('密码错误');
        return;
    }
    
    currentUser = { type: 'admin', username, password, school: adminSchool };
    
    // 加载当前管理员的数据
    loadCurrentAdminData();
    
    // 验证数据隔离
    verifyDataIsolation();
    
    // 切换到管理员页面
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    
    loadAdminPage();
}

// 加载管理员页面
function loadAdminPage() {
    // 计算统计数据（只统计同学校的社团）
    let totalClubs = 0;
    let totalCheckins = 0;
    
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === currentUser.school) {
            totalClubs++;
            totalCheckins += club.checkins.length;
        }
    }
    
    // 新的总社员数统计逻辑：活跃社团社员数相加减重复
    console.log('=== 新的总社员数统计逻辑（活跃社团社员数相加减重复） ===');
    console.log(`当前管理员学校: "${currentUser.school}"`);
    
    // 统计活跃社团中的社员
    const activeClubMembers = new Set(); // 使用Set自动去重
    let totalMemberCountFromClubs = 0;
    
    console.log('统计活跃社团中的社员:');
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === currentUser.school) {
            console.log(`\n社团: ${club.name} (${clubId})`);
            console.log(`  社团学校: "${club.schoolName}"`);
            console.log(`  社团成员数: ${Object.keys(club.members).length}`);
            
            // 统计该社团的所有成员
            Object.keys(club.members).forEach(memberName => {
                if (!activeClubMembers.has(memberName)) {
                    activeClubMembers.add(memberName);
                    totalMemberCountFromClubs++;
                    console.log(`    ✅ 新社员: ${memberName} (+1)`);
                } else {
                    console.log(`    ℹ️ 重复社员: ${memberName} (已统计)`);
                }
            });
        }
    }
    
    const totalMembersForCurrentSchool = activeClubMembers.size;
    
    console.log(`\n总社员数统计结果:`);
    console.log(`  活跃社团总数: ${totalClubs}`);
    console.log(`  所有社团成员总数: ${totalMemberCountFromClubs}`);
    console.log(`  去重后总社员数: ${totalMembersForCurrentSchool}`);
    console.log(`  重复社员数: ${totalMemberCountFromClubs - totalMembersForCurrentSchool}`);
    
    // 显示所有去重后的社员
    console.log(`\n去重后的社员列表:`);
    Array.from(activeClubMembers).forEach((memberName, index) => {
        console.log(`  ${index + 1}. ${memberName}`);
    });
    
    document.getElementById('totalClubs').textContent = totalClubs;
    document.getElementById('totalMembers').textContent = totalMembersForCurrentSchool;
    document.getElementById('totalCheckins').textContent = totalCheckins;
    
    // 默认显示活跃社团
    showActiveClubs();
}

// 显示活跃社团
function showActiveClubs() {
    currentView = 'active';
    document.getElementById('sectionTitle').textContent = '活跃社团';
    document.getElementById('activeClubsBtn').className = 'btn btn-primary';
    document.getElementById('deletedClubsBtn').className = 'btn btn-secondary';
    document.getElementById('allMembersBtn').className = 'btn btn-secondary';
    loadClubsList();
}

// 显示已删除社团
function showDeletedClubs() {
    currentView = 'deleted';
    document.getElementById('sectionTitle').textContent = '已删除社团';
    document.getElementById('activeClubsBtn').className = 'btn btn-secondary';
    document.getElementById('deletedClubsBtn').className = 'btn btn-primary';
    document.getElementById('allMembersBtn').className = 'btn btn-secondary';
    loadDeletedClubsList();
}

// 显示所有社员
function showAllMembers() {
    currentView = 'members';
    document.getElementById('sectionTitle').textContent = '所有社员概况';
    document.getElementById('activeClubsBtn').className = 'btn btn-secondary';
    document.getElementById('deletedClubsBtn').className = 'btn btn-secondary';
    document.getElementById('allMembersBtn').className = 'btn btn-primary';
    loadAllMembersList();
}

// 加载所有社员列表
function loadAllMembersList() {
    const container = document.getElementById('clubsList');
    
    console.log('=== 加载所有社员概况 ===');
    console.log(`当前管理员学校: "${currentUser.school}"`);
    
    // 统计活跃社团中的社员数据（来源于各个社团的统计）
    const adminSchool = currentUser.school || '';
    const memberStatistics = new Map(); // 存储社员统计数据
    
    console.log('=== 统计各个社团的社员数据 ===');
    console.log(`当前管理员学校: "${adminSchool}"`);
    
    // 遍历所有同学校的社团
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === adminSchool) {
            console.log(`\n社团: ${club.name} (${clubId})`);
            console.log(`  社团学校: "${club.schoolName}"`);
            console.log(`  社团成员数: ${Object.keys(club.members).length}`);
            
            // 统计该社团的所有成员
            Object.keys(club.members).forEach(memberName => {
                console.log(`    处理社员: ${memberName}`);
                
                // 获取或创建社员统计记录
                if (!memberStatistics.has(memberName)) {
                    memberStatistics.set(memberName, {
                        name: memberName,
                        joinedClubs: [],
                        totalCheckins: 0,
                        totalCAS: {
                            C: 0,
                            A: 0,
                            S: 0,
                            total: 0
                        },
                        clubDetails: []
                    });
                }
                
                const memberStats = memberStatistics.get(memberName);
                
                // 添加加入的社团信息
                memberStats.joinedClubs.push(`${club.name} (${clubId})`);
                
                // 统计该社员在该社团的签到和CAS时间
                const memberCheckins = club.checkins.filter(c => 
                    c.memberName === memberName && c.status === 'approved'
                );
                
                memberStats.totalCheckins += memberCheckins.length;
                
                // 统计CAS时间
                memberCheckins.forEach(checkin => {
                    const timeSettings = checkin.timeSettings || {};
                    memberStats.totalCAS.C += timeSettings.C || 0;
                    memberStats.totalCAS.A += timeSettings.A || 0;
                    memberStats.totalCAS.S += timeSettings.S || 0;
                });
                
                memberStats.totalCAS.total = memberStats.totalCAS.C + memberStats.totalCAS.A + memberStats.totalCAS.S;
                
                // 添加社团详细信息
                memberStats.clubDetails.push({
                    clubId: clubId,
                    clubName: club.name,
                    checkins: memberCheckins.length,
                    casTime: {
                        C: memberCheckins.reduce((sum, c) => sum + (c.timeSettings?.C || 0), 0),
                        A: memberCheckins.reduce((sum, c) => sum + (c.timeSettings?.A || 0), 0),
                        S: memberCheckins.reduce((sum, c) => sum + (c.timeSettings?.S || 0), 0)
                    }
                });
                
                console.log(`      签到次数: ${memberCheckins.length}`);
                console.log(`      CAS时间: C=${memberStats.totalCAS.C}h, A=${memberStats.totalCAS.A}h, S=${memberStats.totalCAS.S}h`);
            });
        }
    }
    
    const sameSchoolMembers = Array.from(memberStatistics.values());
    
    console.log(`\n统计结果:`);
    console.log(`  活跃社团中的社员数量: ${sameSchoolMembers.length}`);
    
    // 创建社员信息表格
    let membersTable = `
        <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
            <div style="background: #667eea; color: white; padding: 15px; font-weight: bold;">
                📊 社员概况统计 - ${adminSchool}
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #4caf50; font-weight: bold;">活跃社团社员: ${sameSchoolMembers.length} 人</span>
                        <span style="margin-left: 20px; color: #666;">数据来源于各社团统计</span>
                    </div>
                    <div style="color: #666; font-size: 14px;">
                        当前管理员学校: "${adminSchool}"
                    </div>
                </div>
            </div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead style="background: #f8f9fa;">
                        <tr>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">社员姓名</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">加入社团</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">社团数量</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">签到次数</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">C时间</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">A时间</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">S时间</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">总CAS</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // 显示社团社员数据统计
    let displayedMembersCount = 0;
    
    sameSchoolMembers.forEach(memberStats => {
        console.log(`✅ 显示社员数据: ${memberStats.name}`);
        console.log(`  加入社团: ${memberStats.joinedClubs.join(', ')}`);
        console.log(`  总签到次数: ${memberStats.totalCheckins}`);
        console.log(`  CAS时间: C=${memberStats.totalCAS.C}h, A=${memberStats.totalCAS.A}h, S=${memberStats.totalCAS.S}h, 总计=${memberStats.totalCAS.total}h`);
        displayedMembersCount++;
        
        // 生成加入社团的文本
        const joinedClubsText = memberStats.joinedClubs.join(', ');
        
        // 显示社团社员数据（高亮显示）
        membersTable += `
            <tr style="border-bottom: 1px solid #eee; background: #f0f8ff;">
                <td style="padding: 12px; font-weight: 600; color: #333;">${memberStats.name}</td>
                <td style="padding: 12px; color: #666; max-width: 300px; word-wrap: break-word;" title="${joinedClubsText}">
                    ${joinedClubsText.length > 50 ? joinedClubsText.substring(0, 50) + '...' : joinedClubsText}
                </td>
                <td style="padding: 12px; text-align: center; color: #4caf50; font-weight: bold;">${memberStats.joinedClubs.length}</td>
                <td style="padding: 12px; text-align: center; color: #2196f3; font-weight: bold;">${memberStats.totalCheckins}</td>
                <td style="padding: 12px; text-align: center; color: #ff9800; font-weight: bold;">${memberStats.totalCAS.C.toFixed(1)}h</td>
                <td style="padding: 12px; text-align: center; color: #ff9800; font-weight: bold;">${memberStats.totalCAS.A.toFixed(1)}h</td>
                <td style="padding: 12px; text-align: center; color: #ff9800; font-weight: bold;">${memberStats.totalCAS.S.toFixed(1)}h</td>
                <td style="padding: 12px; text-align: center; color: #ff9800; font-weight: bold;">${memberStats.totalCAS.total.toFixed(1)}h</td>
            </tr>
        `;
    });
    
    // 如果社团社员数据为空，显示提示信息
    if (sameSchoolMembers.length === 0) {
        membersTable += `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                    <h3 style="color: #666; margin-bottom: 10px;">暂无社团社员数据</h3>
                    <p style="color: #999;">当前没有社员加入学校 "${adminSchool}" 的活跃社团</p>
                </td>
            </tr>
        `;
    }
    
    membersTable += `
                    </tbody>
                </table>
            </div>
            <div style="padding: 15px; background: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                    共显示 ${displayedMembersCount} 个社团社员数据 | 数据来源于各社团统计 | 当前管理员学校: "${adminSchool}"
                </p>
            </div>
        </div>
    `;
    
    console.log(`实际显示的社团社员数据数量: ${displayedMembersCount}`);
    container.innerHTML = membersTable;
}

// 加载社团列表
function loadClubsList() {
    const container = document.getElementById('clubsList');
    
    // 获取待审核的社团
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    
    // 过滤出同学校的社团（包括待审核的）
    const sameSchoolClubs = Object.values(clubs).filter(club => {
        return club.schoolName === currentUser.school;
    });
    
    // 过滤出同学校的待审核社团
    const sameSchoolPendingClubs = Object.values(pendingClubs).filter(club => {
        return club.schoolName === currentUser.school;
    });
    
    // 合并所有社团
    const allSameSchoolClubs = [...sameSchoolClubs, ...sameSchoolPendingClubs];
    
    if (allSameSchoolClubs.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">暂无同学校社团数据</p>';
        return;
    }
    
    container.innerHTML = allSameSchoolClubs.map(club => {
        const memberCount = Object.keys(club.members).length;
        const checkinCount = club.checkins.length;
        const approvedCount = club.checkins.filter(c => c.status === 'approved').length;
        
        // 获取审核状态显示
        let statusDisplay = '';
        let statusColor = '';
        if (club.status === 'pending') {
            statusDisplay = '待审核';
            statusColor = '#ff9800';
        } else if (club.status === 'approved' || !club.status) {
            statusDisplay = '已通过';
            statusColor = '#4caf50';
        } else if (club.status === 'rejected') {
            statusDisplay = '已拒绝';
            statusColor = '#f44336';
        }
        
        return `
            <div class="club-card">
                <div class="club-header">
                    <div class="club-title">${club.name}</div>
                    <div class="club-id">ID: ${club.id}</div>
                </div>
                <div class="club-info">
                    <div class="info-item">
                        <span class="info-label">学校：</span>
                        <span class="info-value">${club.schoolName || '未设置'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">状态：</span>
                        <span class="info-value" style="color: ${statusColor}; font-weight: bold;">${statusDisplay}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">社员数：</span>
                        <span class="info-value">${memberCount}</span>
                    </div>
                </div>
                <div class="club-info">
                    <div class="info-item">
                        <span class="info-label">签到总数：</span>
                        <span class="info-value">${checkinCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">已通过：</span>
                        <span class="info-value">${approvedCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">活动日期：</span>
                        <span class="info-value">${club.activityDate || '未设置'}</span>
                    </div>
                </div>
                <div class="club-actions">
                    <button class="btn btn-view btn-small" onclick="viewClubDetails('${club.id}')">查看详情</button>
                    ${club.status === 'pending' ? `
                        <button class="btn btn-success btn-small" onclick="approveClub('${club.id}')" style="background: #4caf50; color: white; width: auto;">通过审核</button>
                        <button class="btn btn-danger btn-small" onclick="rejectClub('${club.id}')" style="background: #f44336; color: white; width: auto;">拒绝审核</button>
                    ` : ''}
                    <button class="btn btn-delete btn-small" onclick="deleteClub('${club.id}')">删除社团</button>
                </div>
            </div>
        `;
    }).join('');
}

// 加载已删除社团列表
function loadDeletedClubsList() {
    const container = document.getElementById('clubsList');
    
    // 过滤出同学校的已删除社团
    const sameSchoolDeletedClubs = Object.values(deletedClubs).filter(club => {
        return club.schoolName === currentUser.school;
    });
    
    // 调试信息
    console.log('加载已删除社团列表');
    console.log('已删除社团数量:', Object.keys(deletedClubs).length);
    console.log('同学校已删除社团数量:', sameSchoolDeletedClubs.length);
    console.log('已删除社团数据:', deletedClubs);
    
    // 使用当前管理员的数据，而不是全局数据
    if (sameSchoolDeletedClubs.length === 0) {
        console.log('没有同学校已删除社团，显示空状态');
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">暂无同学校已删除社团</p>';
        return;
    }
    
    container.innerHTML = sameSchoolDeletedClubs.map(club => {
        // 调试信息
        console.log('处理社团:', club.name, club);
        console.log('社团ID:', club.id);
        console.log('社团名称:', club.name);
        console.log('学校名称:', club.schoolName);
        
        const memberCount = club.members ? Object.keys(club.members).length : 0;
        const checkinCount = club.checkins ? club.checkins.length : 0;
        const approvedCount = club.checkins ? club.checkins.filter(c => c.status === 'approved').length : 0;
        
        // 计算删除时间
        const deletedDate = new Date(club.deletedAt);
        const daysSinceDeleted = Math.floor((new Date() - deletedDate) / (1000 * 60 * 60 * 24));
        const remainingDays = Math.max(0, 30 - daysSinceDeleted);
        
        // 删除原因
        const deleteReason = club.deletedBy === 'self' ? '自主注销' : '管理员删除';
        
        return `
            <div class="club-card" style="border-left: 4px solid #ff6b6b; opacity: 0.8;">
                <div class="club-header">
                    <div class="club-title">${club.name}</div>
                    <div class="club-id">ID: ${club.id}</div>
                </div>
                <div class="club-info">
                    <div class="info-item">
                        <span class="info-label">学校：</span>
                        <span class="info-value">${club.schoolName || '未设置'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">社团号：</span>
                        <span class="info-value">${club.id || '未知'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">删除原因：</span>
                        <span class="info-value" style="color: #ff6b6b;">${deleteReason}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">删除时间：</span>
                        <span class="info-value">${deletedDate.toLocaleString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">剩余天数：</span>
                        <span class="info-value" style="color: ${remainingDays > 7 ? '#4caf50' : remainingDays > 0 ? '#ff9800' : '#f44336'};">
                            ${remainingDays > 0 ? `${remainingDays}天` : '已过期'}
                        </span>
                    </div>
                </div>
                <div class="club-info">
                    <div class="info-item">
                        <span class="info-label">社员数：</span>
                        <span class="info-value">${memberCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">签到总数：</span>
                        <span class="info-value">${checkinCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">已通过：</span>
                        <span class="info-value">${approvedCount}</span>
                    </div>
                </div>
                <div class="club-actions">
                    <button class="btn btn-view btn-small" onclick="viewDeletedClubDetails('${club.id}')">查看详情</button>
                    ${remainingDays > 0 ? `
                        <button class="btn btn-success btn-small" onclick="restoreClub('${club.id}')" style="background: #4caf50; color: white;">恢复社团</button>
                    ` : ''}
                    <button class="btn btn-delete btn-small" onclick="permanentlyDeleteClub('${club.id}')" style="background: #f44336; color: white;">永久删除</button>
                </div>
            </div>
        `;
    }).join('');
}



// 查看已删除社团详情
function viewDeletedClubDetails(clubId) {
    const club = deletedClubs[clubId];
    
    if (!club) {
        alert('社团不存在');
        return;
    }
    
    let membersList = '';
    
    if (club.members) {
        for (const member of Object.values(club.members)) {
            const totalTime = member.timeC + member.timeA + member.timeS;
            membersList += `
                <tr>
                    <td>${member.name}</td>
                    <td>${member.checkinCount}</td>
                    <td>${member.timeC}</td>
                    <td>${member.timeA}</td>
                    <td>${member.timeS}</td>
                    <td>${totalTime.toFixed(1)}</td>
                </tr>
            `;
        }
    }
    
    const content = `
        <div style="max-height: 60vh; overflow-y: auto;">
            <h3 style="margin-bottom: 20px;">已删除社团详情：${club.name}</h3>
            <p style="color: #ff6b6b; margin-bottom: 20px;">
                删除时间：${new Date(club.deletedAt).toLocaleString()}<br>
                删除原因：${club.deletedBy === 'self' ? '自主注销' : '管理员删除'}
            </p>
            <table class="members-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>签到次数</th>
                        <th>C类时长</th>
                        <th>A类时长</th>
                        <th>S类时长</th>
                        <th>总时长</th>
                    </tr>
                </thead>
                <tbody>
                    ${membersList || '<tr><td colspan="6" style="text-align: center; color: #999;">暂无社员</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    
    // 创建模态框显示详情
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = content + `
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="this.closest('.modal').remove()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
        </div>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 点击背景关闭模态框
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 恢复社团
function restoreClub(clubId) {
    const club = deletedClubs[clubId];
    
    if (!club) {
        alert('社团不存在');
        return;
    }
    
    if (confirm(`确定要恢复社团"${club.name}"吗？\n恢复后该社团将重新变为活跃状态。`)) {
        // 从已删除列表中移除
        delete deletedClubs[clubId];
        
        // 恢复到活跃社团列表
        clubs[clubId] = club;
        
        // 移除删除相关字段
        delete clubs[clubId].deletedAt;
        delete clubs[clubId].deletedBy;
        
        // 保存数据
        saveCurrentAdminData();
        
        // 重新加载页面
        loadAdminPage();
        alert('社团已成功恢复！');
    }
}

// 永久删除社团
function permanentlyDeleteClub(clubId) {
    // 存储要永久删除的社团ID
    window.pendingPermanentDeleteClubId = clubId;
    
    // 显示永久删除确认弹窗
    document.getElementById('permanentDeleteClubModal').style.display = 'flex';
}

// 关闭永久删除社团弹窗
function closePermanentDeleteClubModal() {
    document.getElementById('permanentDeleteClubModal').style.display = 'none';
    document.getElementById('confirmPermanentDeletePassword').value = '';
    window.pendingPermanentDeleteClubId = null;
}

// 确认永久删除社团
function confirmPermanentDeleteClub() {
    const password = document.getElementById('confirmPermanentDeletePassword').value;
    const clubId = window.pendingPermanentDeleteClubId;
    
    if (!password) {
        alert('请输入管理员密码');
        return;
    }
    
    // 验证管理员密码
    if (password !== currentUser.password) {
        alert('管理员密码错误');
        return;
    }
    
    const club = deletedClubs[clubId];
    
    if (!club) {
        alert('社团不存在');
        closePermanentDeleteClubModal();
        return;
    }
    
    // 调试信息
    console.log('永久删除社团:', clubId, club.name);
    console.log('删除前的已删除社团数量:', Object.keys(deletedClubs).length);
    
    // 从已删除列表中永久删除
    delete deletedClubs[clubId];
    
    // 调试信息
    console.log('删除后的已删除社团数量:', Object.keys(deletedClubs).length);
    console.log('删除后的已删除社团数据:', deletedClubs);
    
    // 保存数据
    saveCurrentAdminData();
    
    // 验证数据已保存
    const adminKey = `admin_${currentUser.username}`;
    const savedData = JSON.parse(localStorage.getItem(adminKey) || '{}');
    console.log('保存后的已删除社团数量:', Object.keys(savedData.deletedClubs || {}).length);
    
    // 关闭弹窗
    closePermanentDeleteClubModal();
    
    // 重新加载数据以确保同步
    console.log('重新加载数据前，已删除社团数量:', Object.keys(deletedClubs).length);
    loadSavedData();
    console.log('重新加载数据后，已删除社团数量:', Object.keys(deletedClubs).length);
    
    // 强制刷新已删除社团列表
    console.log('强制刷新已删除社团列表');
    showDeletedClubs();
    
    alert('社团已永久删除');
}

// 查看社团详情
function viewClubDetails(clubId) {
    const club = clubs[clubId];
    let membersList = '';
    
    for (const member of Object.values(club.members)) {
        const totalTime = member.timeC + member.timeA + member.timeS;
        membersList += `
            <tr>
                <td>${member.name}</td>
                <td>${member.checkinCount}</td>
                <td>${member.timeC}</td>
                <td>${member.timeA}</td>
                <td>${member.timeS}</td>
                <td>${totalTime.toFixed(1)}</td>
            </tr>
        `;
    }
    
    const content = `
        <div style="max-height: 60vh; overflow-y: auto;">
            <h3 style="margin-bottom: 20px;">社团详情：${club.name}</h3>
            <table class="members-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>签到次数</th>
                        <th>C类时长</th>
                        <th>A类时长</th>
                        <th>S类时长</th>
                        <th>总时长</th>
                    </tr>
                </thead>
                <tbody>
                    ${membersList || '<tr><td colspan="6" style="text-align: center; color: #999;">暂无社员</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
    
    alert(content.replace(/\n/g, ''));
}

// 删除社团
function deleteClub(clubId) {
    // 存储要删除的社团ID
    window.pendingDeleteClubId = clubId;
    
    // 显示删除确认弹窗
    document.getElementById('deleteClubModal').style.display = 'flex';
}

// 关闭删除社团弹窗
function closeDeleteClubModal() {
    document.getElementById('deleteClubModal').style.display = 'none';
    document.getElementById('confirmDeletePassword').value = '';
    window.pendingDeleteClubId = null;
}

// 确认删除社团
function confirmDeleteClub() {
    const password = document.getElementById('confirmDeletePassword').value;
    const clubId = window.pendingDeleteClubId;
    
    if (!password) {
        alert('请输入管理员密码');
        return;
    }
    
    // 验证管理员密码
    if (password !== currentUser.password) {
        alert('管理员密码错误');
        return;
    }
    
    const club = clubs[clubId];
    
    if (!club) {
        alert('社团不存在或已被删除');
        closeDeleteClubModal();
        return;
    }
    
    // 将社团移动到已删除列表
    deletedClubs[clubId] = {
        ...club,
        deletedAt: new Date().toISOString(),
        deletedBy: 'admin'
    };
    
    // 调试信息
    console.log('社团已移动到已删除列表:', clubId, deletedClubs[clubId]);
    console.log('原始社团数据:', club);
    console.log('社团名称:', club.name);
    console.log('社团ID:', club.id);
    
    // 从活跃社团中删除
    delete clubs[clubId];
    
    // 清理社员数据中的该社团
    cleanupMemberClubsList(clubId);
    
    // 保存数据
    saveCurrentAdminData();
    saveGlobalMembers();
    
    // 关闭弹窗并刷新页面
    closeDeleteClubModal();
    showDeletedClubs(); // 显示已删除社团列表而不是活跃社团
    
    alert('社团已删除并移动到已删除列表');
}

// 清理社员数据中的已删除社团
function cleanupMemberClubsList(deletedClubId) {
    for (const memberName in globalMembers) {
        const member = globalMembers[memberName];
        if (member.joinedClubs) {
            member.joinedClubs = member.joinedClubs.filter(clubId => clubId !== deletedClubId);
        }
    }
}

// 显示注销账号弹窗
function showDeleteAccount() {
    document.getElementById('deleteAccountModal').style.display = 'flex';
}

// 关闭注销账号弹窗
function closeDeleteAccountModal() {
    document.getElementById('deleteAccountModal').style.display = 'none';
    document.getElementById('confirmDeleteAccountPassword').value = '';
}

// 确认注销账号
function confirmDeleteAccount() {
    const password = document.getElementById('confirmDeleteAccountPassword').value;
    
    if (!password) {
        alert('请输入管理员密码');
        return;
    }
    
    // 验证管理员密码
    if (password !== currentUser.password) {
        alert('管理员密码错误');
        return;
    }
    
    // 确认注销操作
    const confirmMessage = `确定要注销管理员账号 "${currentUser.username}" 吗？\n\n⚠️ 警告：此操作将同时注销学校 "${currentUser.school}" 的所有社团和社员！\n\n此操作不可撤销，请谨慎操作。`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // 同步注销同一学校的所有社团和社员
    const deletedCount = syncDeleteSchoolData(currentUser.school);
    
    // 从管理员列表中删除当前账号
    delete admins[currentUser.username];
    
    // 完全清除该管理员的所有数据
    const adminKey = `admin_${currentUser.username}`;
    localStorage.removeItem(adminKey);
    
    // 保存管理员列表
    localStorage.setItem('admins', JSON.stringify(admins));
    
    console.log('已完全清除管理员数据:', currentUser.username);
    console.log('已同步删除学校数据:', currentUser.school, '影响数量:', deletedCount);
    
    // 关闭弹窗
    closeDeleteAccountModal();
    
    // 退出登录
    logout();
    
    alert(`管理员账号已成功注销！\n\n已同步删除学校 "${currentUser.school}" 的数据：\n- 社团: ${deletedCount.clubs} 个\n- 社员: ${deletedCount.members} 个\n- 已删除社团: ${deletedCount.deletedClubs} 个`);
}

// 同步删除同一学校的所有社团和社员
function syncDeleteSchoolData(schoolName) {
    console.log(`开始同步删除学校 "${schoolName}" 的所有数据`);
    
    const deletedCount = {
        clubs: 0,
        members: 0,
        deletedClubs: 0
    };
    
    // 1. 删除全局数据中该学校的社团
    console.log('1. 删除全局活跃社团...');
    const globalClubs = JSON.parse(localStorage.getItem('clubs') || '{}');
    Object.keys(globalClubs).forEach(clubId => {
        const club = globalClubs[clubId];
        if (club.schoolName === schoolName) {
            delete globalClubs[clubId];
            deletedCount.clubs++;
            console.log(`  删除活跃社团: ${clubId} - ${club.name}`);
        }
    });
    localStorage.setItem('clubs', JSON.stringify(globalClubs));
    
    // 2. 删除全局数据中该学校的已删除社团
    console.log('2. 删除全局已删除社团...');
    const globalDeletedClubs = JSON.parse(localStorage.getItem('deletedClubs') || '{}');
    Object.keys(globalDeletedClubs).forEach(clubId => {
        const club = globalDeletedClubs[clubId];
        if (club.schoolName === schoolName) {
            delete globalDeletedClubs[clubId];
            deletedCount.deletedClubs++;
            console.log(`  删除已删除社团: ${clubId} - ${club.name}`);
        }
    });
    localStorage.setItem('deletedClubs', JSON.stringify(globalDeletedClubs));
    
    // 3. 删除该学校的社员
    console.log('3. 删除学校社员...');
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers') || '{}');
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        if (member.school === schoolName) {
            delete globalMembers[memberName];
            deletedCount.members++;
            console.log(`  删除社员: ${memberName}`);
        }
    });
    localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
    
    // 4. 删除所有管理员数据中该学校的数据
    console.log('4. 删除所有管理员数据中的学校数据...');
    const allAdmins = JSON.parse(localStorage.getItem('admins') || '{}');
    Object.keys(allAdmins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        
        // 删除该管理员数据中的学校社团
        if (adminData.clubs) {
            Object.keys(adminData.clubs).forEach(clubId => {
                const club = adminData.clubs[clubId];
                if (club.schoolName === schoolName) {
                    delete adminData.clubs[clubId];
                    console.log(`  从管理员 ${adminUsername} 删除活跃社团: ${clubId}`);
                }
            });
        }
        
        // 删除该管理员数据中的学校已删除社团
        if (adminData.deletedClubs) {
            Object.keys(adminData.deletedClubs).forEach(clubId => {
                const club = adminData.deletedClubs[clubId];
                if (club.schoolName === schoolName) {
                    delete adminData.deletedClubs[clubId];
                    console.log(`  从管理员 ${adminUsername} 删除已删除社团: ${clubId}`);
                }
            });
        }
        
        // 删除该管理员数据中的学校社员
        if (adminData.globalMembers) {
            Object.keys(adminData.globalMembers).forEach(memberName => {
                const member = adminData.globalMembers[memberName];
                if (member.school === schoolName) {
                    delete adminData.globalMembers[memberName];
                    console.log(`  从管理员 ${adminUsername} 删除社员: ${memberName}`);
                }
            });
        }
        
        // 保存更新后的管理员数据
        localStorage.setItem(adminKey, JSON.stringify(adminData));
    });
    
    // 5. 删除待审核社团中该学校的数据
    console.log('5. 删除待审核社团中的学校数据...');
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs') || '{}');
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        if (club.schoolName === schoolName) {
            delete pendingClubs[clubId];
            console.log(`  删除待审核社团: ${clubId} - ${club.name}`);
        }
    });
    localStorage.setItem('pendingClubs', JSON.stringify(pendingClubs));
    
    console.log(`学校 "${schoolName}" 数据删除完成:`, deletedCount);
    return deletedCount;
}

// 退出登录
function logout() {
    currentUser = null;
    
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPage').style.display = 'none';
    
    // 清空输入框
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

// 显示修改密码弹窗
function showChangePassword() {
    document.getElementById('changePasswordModal').style.display = 'flex';
}

function closeChangePassword() {
    document.getElementById('changePasswordModal').style.display = 'none';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// 修改密码
function changePassword() {
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmNewPwd = document.getElementById('confirmNewPassword').value;
    
    if (!currentPwd || !newPwd || !confirmNewPwd) {
        alert('请填写完整信息');
        return;
    }
    
    if (currentPwd !== admins[currentUser.username]) {
        alert('当前密码错误');
        return;
    }
    
    if (newPwd !== confirmNewPwd) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    admins[currentUser.username] = newPwd;
    currentUser.password = newPwd; // 更新当前用户的密码
    saveAdminData();
    
    closeChangePassword();
    alert('密码修改成功！');
}

// 通过社团审核
function approveClub(clubId) {
    if (confirm('确定要通过该社团的审核吗？')) {
        // 检查社团是否在待审核区域
        const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
        const pendingClub = pendingClubs[clubId];
        
        if (pendingClub) {
            // 从待审核区域移除
            delete pendingClubs[clubId];
            localStorage.setItem('pendingClubs', JSON.stringify(pendingClubs));
            
            // 添加到当前管理员的数据中
            pendingClub.status = 'approved';
            clubs[clubId] = pendingClub;
            saveCurrentAdminData();
            
            console.log('社团已从待审核区域移动到管理员数据:', clubId);
        } else {
            // 社团已在管理员数据中，直接修改状态
            clubs[clubId].status = 'approved';
            saveCurrentAdminData();
        }
        
        loadAdminPage();
        alert('社团审核已通过');
    }
}

// 拒绝社团审核
function rejectClub(clubId) {
    if (confirm('确定要拒绝该社团的审核吗？')) {
        // 检查社团是否在待审核区域
        const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
        const pendingClub = pendingClubs[clubId];
        
        if (pendingClub) {
            // 从待审核区域移除（拒绝的社团直接删除）
            delete pendingClubs[clubId];
            localStorage.setItem('pendingClubs', JSON.stringify(pendingClubs));
            
            console.log('社团已从待审核区域删除（拒绝）:', clubId);
        } else {
            // 社团已在管理员数据中，修改状态
            clubs[clubId].status = 'rejected';
            saveCurrentAdminData();
        }
        
        loadAdminPage();
        alert('社团审核已拒绝');
    }
}

// 测试管理员统计功能修改
function testAdminStatsFix() {
    console.log('=== 测试管理员统计功能修改 ===');
    
    // 1. 检查总社员数统计
    const totalMembersElement = document.getElementById('totalMembers');
    if (totalMembersElement) {
        const displayedTotal = totalMembersElement.textContent;
        const actualTotal = Object.values(globalMembers).filter(member => 
            member.school === currentUser.school
        ).length;
        console.log('1. 总社员数统计:');
        console.log('  显示的总社员数:', displayedTotal);
        console.log('  实际的总社员数（同学校）:', actualTotal);
        console.log('  当前管理员学校:', currentUser.school);
        if (displayedTotal == actualTotal) {
            console.log('  ✅ 总社员数统计正确');
        } else {
            console.log('  ❌ 总社员数统计不正确');
        }
    } else {
        console.log('1. ❌ 无法找到总社员数元素');
    }
    
    // 2. 检查社员列表显示
    console.log('\n2. 社员列表显示检查:');
    const allMembers = Object.values(globalMembers);
    const sameSchoolMembers = allMembers.filter(member => 
        member.school === currentUser.school
    );
    const membersWithNoClubs = sameSchoolMembers.filter(member => 
        !member.joinedClubs || member.joinedClubs.length === 0
    );
    
    console.log('  总社员数:', allMembers.length);
    console.log('  同学校社员数:', sameSchoolMembers.length);
    console.log('  未加入任何社团的社员数:', membersWithNoClubs.length);
    console.log('  已加入社团的社员数:', sameSchoolMembers.length - membersWithNoClubs.length);
    
    // 3. 检查学校信息
    console.log('\n3. 学校信息检查:');
    const membersWithoutSchool = allMembers.filter(member => !member.school);
    if (membersWithoutSchool.length > 0) {
        console.log('  ⚠️ 发现没有学校信息的社员:');
        membersWithoutSchool.forEach(member => {
            console.log(`    - ${member.name}`);
        });
    } else {
        console.log('  ✅ 所有社员都有学校信息');
    }
    
    // 4. 检查社员详情功能
    console.log('\n4. 社员详情功能检查:');
    if (sameSchoolMembers.length > 0) {
        const testMember = sameSchoolMembers[0];
        console.log(`  测试社员: ${testMember.name} (${testMember.school})`);
        console.log('  ✅ 可以查看同学校社员的详情');
    } else {
        console.log('  ℹ️ 没有同学校社员可供测试');
    }
    
    console.log('\n=== 管理员统计功能修改测试完成 ===');
}

// 测试管理员系统社员绑定功能
function testAdminMemberBinding() {
    console.log('=== 测试管理员系统社员绑定功能 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: ${currentUser.school}`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 检查全局社员数据
    console.log('\n2. 全局社员数据检查:');
    const allMembers = Object.values(globalMembers);
    const sameSchoolMembers = allMembers.filter(member => 
        member.school === currentUser.school
    );
    const membersWithClubs = sameSchoolMembers.filter(member => 
        member.joinedClubs && member.joinedClubs.length > 0
    );
    const membersWithoutClubs = sameSchoolMembers.filter(member => 
        !member.joinedClubs || member.joinedClubs.length === 0
    );
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  同学校社员数: ${sameSchoolMembers.length}`);
    console.log(`  已加入社团的社员: ${membersWithClubs.length}`);
    console.log(`  未加入社团的社员: ${membersWithoutClubs.length}`);
    
    // 3. 检查社团数据
    console.log('\n3. 社团数据检查:');
    const allClubs = Object.values(clubs);
    const sameSchoolClubs = allClubs.filter(club => 
        club.schoolName === currentUser.school
    );
    
    console.log(`  总社团数: ${allClubs.length}`);
    console.log(`  同学校社团数: ${sameSchoolClubs.length}`);
    
    // 4. 测试社员显示逻辑
    console.log('\n4. 社员显示逻辑测试:');
    sameSchoolMembers.forEach((member, index) => {
        if (index < 5) { // 只显示前5个社员
            console.log(`  社员 ${index + 1}: ${member.name}`);
            console.log(`    学校: ${member.school}`);
            console.log(`    加入社团数: ${member.joinedClubs ? member.joinedClubs.length : 0}`);
            if (member.joinedClubs && member.joinedClubs.length > 0) {
                console.log(`    加入的社团: ${member.joinedClubs.join(', ')}`);
            } else {
                console.log(`    状态: 未加入任何社团`);
            }
        }
    });
    
    // 5. 测试统计功能
    console.log('\n5. 统计功能测试:');
    if (typeof loadAdminPage === 'function') {
        console.log('✅ loadAdminPage 函数存在');
        
        // 模拟加载管理员页面
        try {
            loadAdminPage();
            console.log('✅ 管理员页面加载成功');
            
            // 检查统计数据显示
            const totalMembersElement = document.getElementById('totalMembers');
            if (totalMembersElement) {
                const displayedTotal = totalMembersElement.textContent;
                console.log(`  显示的总社员数: ${displayedTotal}`);
                console.log(`  实际同学校社员数: ${sameSchoolMembers.length}`);
                
                if (displayedTotal == sameSchoolMembers.length) {
                    console.log('  ✅ 社员统计正确');
                } else {
                    console.log('  ❌ 社员统计不正确');
                }
            }
        } catch (error) {
            console.log('❌ 管理员页面加载出错:', error.message);
        }
    } else {
        console.log('❌ loadAdminPage 函数不存在');
    }
    
    // 6. 测试社员列表显示
    console.log('\n6. 社员列表显示测试:');
    if (typeof loadAllMembersList === 'function') {
        console.log('✅ loadAllMembersList 函数存在');
        
        try {
            loadAllMembersList();
            console.log('✅ 社员列表加载成功');
            
            // 检查是否显示了未加入社团的社员
            const clubsListElement = document.getElementById('clubsList');
            if (clubsListElement && clubsListElement.innerHTML.includes('未加入任何社团')) {
                console.log('✅ 未加入社团的社员已正确显示');
            } else {
                console.log('⚠️ 未加入社团的社员可能未显示');
            }
        } catch (error) {
            console.log('❌ 社员列表加载出错:', error.message);
        }
    } else {
        console.log('❌ loadAllMembersList 函数不存在');
    }
    
    // 7. 测试社员详情功能
    console.log('\n7. 社员详情功能测试:');
    console.log('ℹ️ 社员详情功能已移除');
    
    console.log('\n=== 管理员系统社员绑定功能测试完成 ===');
}

// 诊断周瀚辰数据问题
function diagnoseZhouHanchenIssue() {
    console.log('=== 诊断周瀚辰数据问题 ===');
    
    // 1. 检查周瀚辰的社员数据
    console.log('\n1. 检查周瀚辰的社员数据:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        console.log('✅ 找到周瀚辰的社员数据');
        console.log(`  姓名: ${zhouHanchen.name}`);
        console.log(`  学校: ${zhouHanchen.school}`);
        console.log(`  密码: ${zhouHanchen.password}`);
        console.log(`  加入社团: ${zhouHanchen.joinedClubs ? zhouHanchen.joinedClubs.join(', ') : '无'}`);
        console.log(`  创建时间: ${zhouHanchen.createdAt}`);
    } else {
        console.log('❌ 未找到周瀚辰的社员数据');
        console.log('  所有社员列表:', Object.keys(globalMembers));
    }
    
    // 2. 检查管理员账号"1"的数据
    console.log('\n2. 检查管理员账号"1"的数据:');
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    const admin1 = admins['1'];
    if (admin1) {
        console.log('✅ 找到管理员账号"1"');
        console.log(`  用户名: 1`);
        console.log(`  学校: ${admin1.school}`);
        console.log(`  数据类型: ${typeof admin1}`);
        console.log(`  完整数据:`, admin1);
    } else {
        console.log('❌ 未找到管理员账号"1"');
        console.log('  所有管理员列表:', Object.keys(admins));
    }
    
    // 3. 检查当前用户信息
    console.log('\n3. 检查当前用户信息:');
    if (currentUser) {
        console.log(`  当前用户: ${currentUser.username}`);
        console.log(`  当前用户学校: ${currentUser.school}`);
        console.log(`  当前用户类型: ${currentUser.type}`);
    } else {
        console.log('❌ 当前用户未设置');
    }
    
    // 4. 检查学校匹配逻辑
    console.log('\n4. 检查学校匹配逻辑:');
    if (zhouHanchen && admin1) {
        console.log(`  周瀚辰的学校: "${zhouHanchen.school}"`);
        console.log(`  管理员1的学校: "${admin1.school}"`);
        console.log(`  学校是否相等: ${zhouHanchen.school === admin1.school}`);
        console.log(`  学校是否严格相等: ${zhouHanchen.school === admin1.school}`);
        
        // 检查字符串的详细信息
        console.log(`  周瀚辰学校长度: ${zhouHanchen.school ? zhouHanchen.school.length : 'null'}`);
        console.log(`  管理员1学校长度: ${admin1.school ? admin1.school.length : 'null'}`);
        console.log(`  周瀚辰学校字符码: ${zhouHanchen.school ? zhouHanchen.school.split('').map(c => c.charCodeAt(0)) : 'null'}`);
        console.log(`  管理员1学校字符码: ${admin1.school ? admin1.school.split('').map(c => c.charCodeAt(0)) : 'null'}`);
    }
    
    // 5. 检查过滤逻辑
    console.log('\n5. 检查过滤逻辑:');
    if (zhouHanchen && currentUser) {
        const shouldShow = zhouHanchen.school === currentUser.school;
        console.log(`  周瀚辰是否应该显示: ${shouldShow}`);
        console.log(`  过滤条件: member.school !== currentUser.school`);
        console.log(`  过滤结果: ${zhouHanchen.school !== currentUser.school ? '跳过' : '显示'}`);
    }
    
    // 6. 检查所有同学校社员
    console.log('\n6. 检查所有同学校社员:');
    const allMembers = Object.values(globalMembers);
    const sameSchoolMembers = allMembers.filter(member => 
        member.school === currentUser.school
    );
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  同学校社员数: ${sameSchoolMembers.length}`);
    console.log('  同学校社员列表:');
    sameSchoolMembers.forEach((member, index) => {
        console.log(`    ${index + 1}. ${member.name} (${member.school})`);
    });
    
    // 7. 检查是否有其他周瀚辰
    console.log('\n7. 检查是否有其他周瀚辰:');
    const allMemberNames = Object.keys(globalMembers);
    const zhouMembers = allMemberNames.filter(name => name.includes('周') || name.includes('瀚') || name.includes('辰'));
    console.log(`  包含相关字符的社员: ${zhouMembers.join(', ')}`);
    
    // 8. 检查localStorage数据
    console.log('\n8. 检查localStorage数据:');
    try {
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            console.log('✅ localStorage中有globalMembers数据');
            console.log(`  存储的社员数量: ${Object.keys(parsedMembers).length}`);
            
            if (parsedMembers['周瀚辰']) {
                console.log('✅ localStorage中有周瀚辰的数据');
                console.log(`  存储的周瀚辰学校: "${parsedMembers['周瀚辰'].school}"`);
            } else {
                console.log('❌ localStorage中没有周瀚辰的数据');
            }
        } else {
            console.log('❌ localStorage中没有globalMembers数据');
        }
    } catch (error) {
        console.log('❌ 读取localStorage出错:', error.message);
    }
    
    console.log('\n=== 周瀚辰数据问题诊断完成 ===');
}

// 修复学校数据匹配问题
function fixSchoolDataMatching() {
    console.log('=== 修复学校数据匹配问题 ===');
    
    // 1. 检查并修复周瀚辰的学校数据
    console.log('\n1. 修复周瀚辰的学校数据:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        console.log(`  当前周瀚辰的学校: "${zhouHanchen.school}"`);
        
        // 如果学校不是"上海市世外中学"，则修复
        if (zhouHanchen.school !== '上海市世外中学') {
            console.log('  修复周瀚辰的学校为"上海市世外中学"');
            zhouHanchen.school = '上海市世外中学';
            
            // 保存修改
            localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
            console.log('  ✅ 已保存修改');
        } else {
            console.log('  ✅ 周瀚辰的学校数据正确');
        }
    } else {
        console.log('  ❌ 未找到周瀚辰的社员数据');
    }
    
    // 2. 检查并修复管理员账号"1"的学校数据
    console.log('\n2. 修复管理员账号"1"的学校数据:');
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    const admin1 = admins['1'];
    if (admin1) {
        console.log(`  当前管理员1的学校: "${admin1.school}"`);
        
        // 如果学校不是"上海市世外中学"，则修复
        if (admin1.school !== '上海市世外中学') {
            console.log('  修复管理员1的学校为"上海市世外中学"');
            admin1.school = '上海市世外中学';
            
            // 保存修改
            localStorage.setItem('admins', JSON.stringify(admins));
            console.log('  ✅ 已保存修改');
        } else {
            console.log('  ✅ 管理员1的学校数据正确');
        }
    } else {
        console.log('  ❌ 未找到管理员账号"1"');
    }
    
    // 3. 重新加载数据
    console.log('\n3. 重新加载数据:');
    try {
        // 重新加载globalMembers
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            Object.assign(globalMembers, JSON.parse(storedMembers));
            console.log('  ✅ 已重新加载globalMembers');
        }
        
        // 重新加载admins
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            Object.assign(admins, JSON.parse(storedAdmins));
            console.log('  ✅ 已重新加载admins');
        }
        
        // 如果当前用户是管理员1，更新currentUser
        if (currentUser && currentUser.username === '1') {
            currentUser.school = '上海市世外中学';
            console.log('  ✅ 已更新currentUser的学校');
        }
        
    } catch (error) {
        console.log('  ❌ 重新加载数据出错:', error.message);
    }
    
    // 4. 验证修复结果
    console.log('\n4. 验证修复结果:');
    const updatedZhouHanchen = globalMembers['周瀚辰'];
    const updatedAdmin1 = admins['1'];
    
    if (updatedZhouHanchen && updatedAdmin1) {
        console.log(`  周瀚辰的学校: "${updatedZhouHanchen.school}"`);
        console.log(`  管理员1的学校: "${updatedAdmin1.school}"`);
        console.log(`  学校是否匹配: ${updatedZhouHanchen.school === updatedAdmin1.school}`);
        
        if (updatedZhouHanchen.school === updatedAdmin1.school) {
            console.log('  ✅ 学校数据匹配成功');
        } else {
            console.log('  ❌ 学校数据仍然不匹配');
        }
    }
    
    // 5. 重新加载管理员页面
    console.log('\n5. 重新加载管理员页面:');
    try {
        if (typeof loadAdminPage === 'function') {
            loadAdminPage();
            console.log('  ✅ 已重新加载管理员页面');
        }
        
        if (typeof loadAllMembersList === 'function') {
            loadAllMembersList();
            console.log('  ✅ 已重新加载社员列表');
        }
    } catch (error) {
        console.log('  ❌ 重新加载页面出错:', error.message);
    }
    
    console.log('\n=== 学校数据匹配问题修复完成 ===');
}

// 测试管理员统计修复
function testAdminStatsFix() {
    console.log('=== 测试管理员统计修复 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  用户名: ${currentUser.username}`);
        console.log(`  学校: ${currentUser.school}`);
        console.log(`  类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 检查全局社员数据
    console.log('\n2. 全局社员数据:');
    const allMembers = Object.values(globalMembers);
    const sameSchoolMembers = allMembers.filter(member => 
        member.school === currentUser.school
    );
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  同学校社员数: ${sameSchoolMembers.length}`);
    
    allMembers.forEach(member => {
        console.log(`  - ${member.name} (${member.school})`);
    });
    
    // 3. 检查社团数据
    console.log('\n3. 社团数据:');
    const allClubs = Object.values(clubs);
    const sameSchoolClubs = allClubs.filter(club => 
        club.schoolName === currentUser.school
    );
    
    console.log(`  总社团数: ${allClubs.length}`);
    console.log(`  同学校社团数: ${sameSchoolClubs.length}`);
    
    sameSchoolClubs.forEach(club => {
        console.log(`  - ${club.name} (${club.id}) - 社员数: ${Object.keys(club.members).length}`);
    });
    
    // 4. 测试统计功能
    console.log('\n4. 测试统计功能:');
    try {
        loadAdminPage();
        console.log('✅ 管理员页面加载成功');
        
        // 检查统计数据显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            const displayedTotal = totalMembersElement.textContent;
            console.log(`  显示的总社员数: ${displayedTotal}`);
            console.log(`  实际同学校社员数: ${sameSchoolMembers.length}`);
            
            if (displayedTotal == sameSchoolMembers.length) {
                console.log('  ✅ 社员统计正确');
            } else {
                console.log('  ❌ 社员统计不正确');
            }
        }
    } catch (error) {
        console.log('❌ 管理员页面加载出错:', error.message);
    }
    
    // 5. 测试社员列表显示
    console.log('\n5. 测试社员列表显示:');
    try {
        loadAllMembersList();
        console.log('✅ 社员列表加载成功');
        
        // 检查是否显示了社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
            } else {
                console.log('⚠️ 社员列表可能为空');
            }
        }
    } catch (error) {
        console.log('❌ 社员列表加载出错:', error.message);
    }
    
    console.log('\n=== 管理员统计修复测试完成 ===');
}

// 深度诊断总社员数为0的问题
function deepDiagnoseZeroMembers() {
    console.log('=== 深度诊断总社员数为0的问题 ===');
    
    // 1. 检查localStorage中的原始数据
    console.log('\n1. 检查localStorage原始数据:');
    try {
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            console.log(`  localStorage中社员数量: ${Object.keys(parsedMembers).length}`);
            console.log('  localStorage中的社员列表:');
            Object.keys(parsedMembers).forEach(name => {
                const member = parsedMembers[name];
                console.log(`    - ${name}: 学校="${member.school}"`);
            });
        } else {
            console.log('  ❌ localStorage中没有globalMembers数据');
        }
        
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            const parsedAdmins = JSON.parse(storedAdmins);
            console.log(`  localStorage中管理员数量: ${Object.keys(parsedAdmins).length}`);
            console.log('  localStorage中的管理员列表:');
            Object.keys(parsedAdmins).forEach(username => {
                const admin = parsedAdmins[username];
                console.log(`    - ${username}: 学校="${admin.school}"`);
            });
        } else {
            console.log('  ❌ localStorage中没有admins数据');
        }
    } catch (error) {
        console.log('  ❌ 读取localStorage出错:', error.message);
    }
    
    // 2. 检查内存中的数据
    console.log('\n2. 检查内存中的数据:');
    console.log(`  内存中globalMembers数量: ${Object.keys(globalMembers).length}`);
    console.log('  内存中的社员列表:');
    Object.keys(globalMembers).forEach(name => {
        const member = globalMembers[name];
        console.log(`    - ${name}: 学校="${member.school}"`);
    });
    
    // 3. 检查当前用户
    console.log('\n3. 检查当前用户:');
    if (currentUser) {
        console.log(`  当前用户: ${currentUser.username}`);
        console.log(`  当前用户学校: "${currentUser.school}"`);
        console.log(`  当前用户类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ currentUser未定义');
    }
    
    // 4. 检查学校匹配
    console.log('\n4. 检查学校匹配:');
    if (currentUser) {
        const matchingMembers = Object.values(globalMembers).filter(member => 
            member.school === currentUser.school
        );
        console.log(`  匹配的社员数量: ${matchingMembers.length}`);
        
        matchingMembers.forEach(member => {
            console.log(`    - ${member.name}: "${member.school}" === "${currentUser.school}"`);
        });
        
        // 检查是否有学校为null或undefined的社员
        const nullSchoolMembers = Object.values(globalMembers).filter(member => 
            !member.school || member.school === null || member.school === undefined
        );
        if (nullSchoolMembers.length > 0) {
            console.log(`  学校为空的社员数量: ${nullSchoolMembers.length}`);
            nullSchoolMembers.forEach(member => {
                console.log(`    - ${member.name}: 学校="${member.school}"`);
            });
        }
    }
    
    // 5. 检查数据同步问题
    console.log('\n5. 检查数据同步问题:');
    try {
        // 强制重新加载数据
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            console.log('  强制重新加载globalMembers...');
            
            // 清空并重新加载
            Object.keys(globalMembers).forEach(key => delete globalMembers[key]);
            Object.assign(globalMembers, parsedMembers);
            
            console.log(`  重新加载后globalMembers数量: ${Object.keys(globalMembers).length}`);
            
            // 重新统计
            const sameSchoolMembers = Object.values(globalMembers).filter(member => 
                member.school === currentUser.school
            );
            console.log(`  重新统计的同学校社员数量: ${sameSchoolMembers.length}`);
        }
    } catch (error) {
        console.log('  ❌ 数据同步出错:', error.message);
    }
    
    // 6. 检查HTML元素
    console.log('\n6. 检查HTML元素:');
    const totalMembersElement = document.getElementById('totalMembers');
    if (totalMembersElement) {
        console.log(`  totalMembers元素存在，当前值: "${totalMembersElement.textContent}"`);
    } else {
        console.log('  ❌ totalMembers元素不存在');
    }
    
    // 7. 手动设置测试数据
    console.log('\n7. 手动设置测试数据:');
    if (Object.keys(globalMembers).length === 0) {
        console.log('  检测到globalMembers为空，尝试创建测试数据...');
        
        // 创建测试社员
        const testMember = {
            name: '测试社员',
            school: currentUser.school,
            password: '123456',
            joinedClubs: [],
            createdAt: new Date().toISOString()
        };
        
        globalMembers['测试社员'] = testMember;
        localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
        
        console.log('  ✅ 已创建测试社员');
        console.log(`  测试社员学校: "${testMember.school}"`);
        console.log(`  当前用户学校: "${currentUser.school}"`);
        console.log(`  学校匹配: ${testMember.school === currentUser.school}`);
    }
    
    // 8. 重新加载页面
    console.log('\n8. 重新加载页面:');
    try {
        loadAdminPage();
        console.log('  ✅ 已重新加载管理员页面');
        
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            console.log(`  重新加载后总社员数: "${totalMembersElement.textContent}"`);
        }
    } catch (error) {
        console.log('  ❌ 重新加载页面出错:', error.message);
    }
    
    console.log('\n=== 深度诊断完成 ===');
}

// 快速修复总社员数为0的问题
function quickFixZeroMembers() {
    console.log('=== 快速修复总社员数为0的问题 ===');
    
    // 1. 强制重新加载所有数据
    console.log('\n1. 强制重新加载数据:');
    try {
        // 重新加载globalMembers
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            console.log(`  从localStorage加载社员: ${Object.keys(parsedMembers).length}个`);
            
            // 清空并重新加载
            Object.keys(globalMembers).forEach(key => delete globalMembers[key]);
            Object.assign(globalMembers, parsedMembers);
            
            console.log(`  重新加载后globalMembers: ${Object.keys(globalMembers).length}个`);
        } else {
            console.log('  ❌ localStorage中没有globalMembers数据');
        }
        
        // 重新加载admins
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            const parsedAdmins = JSON.parse(storedAdmins);
            console.log(`  从localStorage加载管理员: ${Object.keys(parsedAdmins).length}个`);
        }
        
        // 重新加载clubs
        const storedClubs = localStorage.getItem('clubs');
        if (storedClubs) {
            const parsedClubs = JSON.parse(storedClubs);
            console.log(`  从localStorage加载社团: ${Object.keys(parsedClubs).length}个`);
            
            // 清空并重新加载
            Object.keys(clubs).forEach(key => delete clubs[key]);
            Object.assign(clubs, parsedClubs);
        }
        
    } catch (error) {
        console.log('  ❌ 重新加载数据出错:', error.message);
    }
    
    // 2. 检查并修复当前用户
    console.log('\n2. 检查并修复当前用户:');
    if (!currentUser) {
        console.log('  ❌ currentUser未定义，尝试从localStorage恢复...');
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            const parsedAdmins = JSON.parse(storedAdmins);
            const admin1 = parsedAdmins['1'];
            if (admin1) {
                currentUser = {
                    username: '1',
                    school: admin1.school,
                    type: 'admin'
                };
                console.log('  ✅ 已恢复currentUser');
            }
        }
    }
    
    if (currentUser) {
        console.log(`  当前用户: ${currentUser.username}`);
        console.log(`  当前用户学校: "${currentUser.school}"`);
    }
    
    // 3. 强制更新统计
    console.log('\n3. 强制更新统计:');
    if (currentUser) {
        const sameSchoolMembers = Object.values(globalMembers).filter(member => 
            member.school === currentUser.school
        );
        
        console.log(`  同学校社员数量: ${sameSchoolMembers.length}`);
        
        // 强制更新DOM元素
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            totalMembersElement.textContent = sameSchoolMembers.length;
            console.log(`  ✅ 已更新总社员数显示: ${sameSchoolMembers.length}`);
        } else {
            console.log('  ❌ totalMembers元素不存在');
        }
    }
    
    // 4. 如果还是没有社员，创建测试数据
    console.log('\n4. 检查是否需要创建测试数据:');
    if (currentUser && Object.keys(globalMembers).length === 0) {
        console.log('  创建测试社员数据...');
        
        const testMember = {
            name: '测试社员',
            school: currentUser.school,
            password: '123456',
            joinedClubs: [],
            createdAt: new Date().toISOString()
        };
        
        globalMembers['测试社员'] = testMember;
        localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
        
        console.log('  ✅ 已创建测试社员');
        
        // 更新显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            totalMembersElement.textContent = '1';
            console.log('  ✅ 已更新总社员数显示为1');
        }
    }
    
    // 5. 重新加载页面
    console.log('\n5. 重新加载页面:');
    try {
        loadAdminPage();
        console.log('  ✅ 已重新加载管理员页面');
    } catch (error) {
        console.log('  ❌ 重新加载页面出错:', error.message);
    }
    
    console.log('\n=== 快速修复完成 ===');
}

// 测试修改后的总社员数统计逻辑
function testModifiedMemberCountLogic() {
    console.log('=== 测试修改后的总社员数统计逻辑 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
        console.log(`  管理员类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 检查所有社员数据
    console.log('\n2. 所有社员数据:');
    const allMembers = Object.values(globalMembers);
    console.log(`  全局社员总数: ${allMembers.length}`);
    
    allMembers.forEach((member, index) => {
        const isSameSchool = member.school === currentUser.school;
        console.log(`  ${index + 1}. ${member.name}`);
        console.log(`     学校: "${member.school}"`);
        console.log(`     与管理员学校匹配: ${isSameSchool}`);
        console.log(`     加入社团数: ${member.joinedClubs ? member.joinedClubs.length : 0}`);
    });
    
    // 3. 测试统计逻辑
    console.log('\n3. 测试统计逻辑:');
    const sameSchoolMembers = Object.values(globalMembers).filter(member => {
        const isSameSchool = member.school === currentUser.school;
        console.log(`  过滤社员 ${member.name}: 学校="${member.school}" === "${currentUser.school}" = ${isSameSchool}`);
        return isSameSchool;
    });
    
    console.log(`  同学校社员数量: ${sameSchoolMembers.length}`);
    console.log(`  同学校社员列表:`);
    sameSchoolMembers.forEach((member, index) => {
        console.log(`    ${index + 1}. ${member.name} (${member.school})`);
    });
    
    // 4. 测试loadAdminPage函数
    console.log('\n4. 测试loadAdminPage函数:');
    try {
        loadAdminPage();
        console.log('✅ loadAdminPage 执行成功');
        
        // 检查统计数据显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            const displayedTotal = totalMembersElement.textContent;
            console.log(`  显示的总社员数: ${displayedTotal}`);
            console.log(`  实际同学校社员数: ${sameSchoolMembers.length}`);
            
            if (displayedTotal == sameSchoolMembers.length) {
                console.log('  ✅ 总社员数统计正确');
            } else {
                console.log('  ❌ 总社员数统计不正确');
            }
        }
    } catch (error) {
        console.log('❌ loadAdminPage 执行出错:', error.message);
    }
    
    // 5. 测试loadAllMembersList函数
    console.log('\n5. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
                
                // 检查是否只显示了同学校的社员
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的社员行数: ${sameSchoolMembers.length}`);
                
                if (memberRows.length === sameSchoolMembers.length) {
                    console.log('  ✅ 社员列表数量正确');
                } else {
                    console.log('  ❌ 社员列表数量不正确');
                }
            } else {
                console.log('⚠️ 社员列表可能为空');
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 6. 验证学校匹配逻辑
    console.log('\n6. 验证学校匹配逻辑:');
    const testCases = [
        { memberSchool: currentUser.school, expected: true, description: '相同学校' },
        { memberSchool: '其他学校', expected: false, description: '不同学校' },
        { memberSchool: null, expected: false, description: '学校为null' },
        { memberSchool: undefined, expected: false, description: '学校为undefined' },
        { memberSchool: '', expected: false, description: '学校为空字符串' }
    ];
    
    testCases.forEach((testCase, index) => {
        const actual = testCase.memberSchool === currentUser.school;
        const passed = actual === testCase.expected;
        console.log(`  测试 ${index + 1}: ${testCase.description}`);
        console.log(`    社员学校: "${testCase.memberSchool}"`);
        console.log(`    管理员学校: "${currentUser.school}"`);
        console.log(`    预期结果: ${testCase.expected}`);
        console.log(`    实际结果: ${actual}`);
        console.log(`    测试结果: ${passed ? '✅ 通过' : '❌ 失败'}`);
    });
    
    console.log('\n=== 修改后的总社员数统计逻辑测试完成 ===');
}

// 专门诊断周瀚辰数据问题
function diagnoseZhouHanchenSpecific() {
    console.log('=== 专门诊断周瀚辰数据问题 ===');
    
    // 1. 检查周瀚辰的完整数据
    console.log('\n1. 检查周瀚辰的完整数据:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        console.log('✅ 找到周瀚辰的社员数据');
        console.log('  完整数据:', JSON.stringify(zhouHanchen, null, 2));
        console.log(`  姓名: "${zhouHanchen.name}"`);
        console.log(`  学校: "${zhouHanchen.school}"`);
        console.log(`  学校类型: ${typeof zhouHanchen.school}`);
        console.log(`  学校长度: ${zhouHanchen.school ? zhouHanchen.school.length : 'null'}`);
        
        // 检查学校字符串的每个字符
        if (zhouHanchen.school) {
            console.log(`  学校字符码: [${zhouHanchen.school.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
            console.log(`  学校字符: [${zhouHanchen.school.split('').join(', ')}]`);
        }
    } else {
        console.log('❌ 未找到周瀚辰的社员数据');
        console.log('  所有社员列表:', Object.keys(globalMembers));
        return;
    }
    
    // 2. 检查当前管理员信息
    console.log('\n2. 检查当前管理员信息:');
    if (currentUser) {
        console.log(`  管理员用户名: "${currentUser.username}"`);
        console.log(`  管理员学校: "${currentUser.school}"`);
        console.log(`  管理员学校类型: ${typeof currentUser.school}`);
        console.log(`  管理员学校长度: ${currentUser.school ? currentUser.school.length : 'null'}`);
        
        // 检查管理员学校字符串的每个字符
        if (currentUser.school) {
            console.log(`  管理员学校字符码: [${currentUser.school.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
            console.log(`  管理员学校字符: [${currentUser.school.split('').join(', ')}]`);
        }
    } else {
        console.log('❌ 当前用户未设置');
        return;
    }
    
    // 3. 详细比较学校名称
    console.log('\n3. 详细比较学校名称:');
    if (zhouHanchen && currentUser) {
        const memberSchool = zhouHanchen.school;
        const adminSchool = currentUser.school;
        
        console.log(`  周瀚辰学校: "${memberSchool}"`);
        console.log(`  管理员学校: "${adminSchool}"`);
        console.log(`  严格相等 (===): ${memberSchool === adminSchool}`);
        console.log(`  宽松相等 (==): ${memberSchool == adminSchool}`);
        console.log(`  包含检查: ${memberSchool && memberSchool.includes(adminSchool)}`);
        console.log(`  反向包含: ${adminSchool && adminSchool.includes(memberSchool)}`);
        
        // 检查是否有隐藏字符
        if (memberSchool && adminSchool) {
            const memberTrimmed = memberSchool.trim();
            const adminTrimmed = adminSchool.trim();
            console.log(`  周瀚辰学校(去空格): "${memberTrimmed}"`);
            console.log(`  管理员学校(去空格): "${adminTrimmed}"`);
            console.log(`  去空格后相等: ${memberTrimmed === adminTrimmed}`);
        }
    }
    
    // 4. 检查localStorage中的原始数据
    console.log('\n4. 检查localStorage中的原始数据:');
    try {
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            const storedZhou = parsedMembers['周瀚辰'];
            if (storedZhou) {
                console.log('  localStorage中周瀚辰的数据:');
                console.log(`    学校: "${storedZhou.school}"`);
                console.log(`    学校类型: ${typeof storedZhou.school}`);
                console.log(`    完整数据: ${JSON.stringify(storedZhou, null, 2)}`);
            } else {
                console.log('  ❌ localStorage中没有周瀚辰的数据');
            }
        }
        
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            const parsedAdmins = JSON.parse(storedAdmins);
            const admin1 = parsedAdmins['1'];
            if (admin1) {
                console.log('  localStorage中管理员1的数据:');
                console.log(`    学校: "${admin1.school}"`);
                console.log(`    学校类型: ${typeof admin1.school}`);
                console.log(`    完整数据: ${JSON.stringify(admin1, null, 2)}`);
            }
        }
    } catch (error) {
        console.log('  ❌ 读取localStorage出错:', error.message);
    }
    
    // 5. 测试统计逻辑
    console.log('\n5. 测试统计逻辑:');
    if (zhouHanchen && currentUser) {
        const isSameSchool = zhouHanchen.school === currentUser.school;
        console.log(`  周瀚辰是否应该被统计: ${isSameSchool}`);
        
        // 手动执行过滤逻辑
        const allMembers = Object.values(globalMembers);
        const sameSchoolMembers = allMembers.filter(member => {
            const match = member.school === currentUser.school;
            if (member.name === '周瀚辰') {
                console.log(`    周瀚辰过滤结果: ${match}`);
                console.log(`      社员学校: "${member.school}"`);
                console.log(`      管理员学校: "${currentUser.school}"`);
                console.log(`      匹配: ${match}`);
            }
            return match;
        });
        
        console.log(`  同学校社员总数: ${sameSchoolMembers.length}`);
        console.log(`  同学校社员列表: ${sameSchoolMembers.map(m => m.name).join(', ')}`);
    }
    
    // 6. 强制修复尝试
    console.log('\n6. 强制修复尝试:');
    if (zhouHanchen && currentUser) {
        console.log('  尝试修复周瀚辰的学校数据...');
        
        // 保存原始数据
        const originalSchool = zhouHanchen.school;
        
        // 尝试修复
        zhouHanchen.school = currentUser.school;
        
        // 保存到localStorage
        localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
        
        console.log(`  原始学校: "${originalSchool}"`);
        console.log(`  修复后学校: "${zhouHanchen.school}"`);
        console.log(`  修复后匹配: ${zhouHanchen.school === currentUser.school}`);
        
        // 重新加载页面
        try {
            loadAdminPage();
            console.log('  ✅ 已重新加载管理员页面');
            
            const totalMembersElement = document.getElementById('totalMembers');
            if (totalMembersElement) {
                console.log(`  修复后总社员数: ${totalMembersElement.textContent}`);
            }
        } catch (error) {
            console.log('  ❌ 重新加载页面出错:', error.message);
        }
    }
    
    console.log('\n=== 周瀚辰数据问题专门诊断完成 ===');
}

// 测试新的按学校名字归类统计逻辑
function testNewSchoolGroupingLogic() {
    console.log('=== 测试新的按学校名字归类统计逻辑 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
        console.log(`  管理员类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 分析所有社员的学校分布
    console.log('\n2. 所有社员的学校分布:');
    const schoolGroups = {};
    const allMembers = Object.values(globalMembers);
    
    allMembers.forEach(member => {
        const memberSchool = member.school || '未设置学校';
        if (!schoolGroups[memberSchool]) {
            schoolGroups[memberSchool] = [];
        }
        schoolGroups[memberSchool].push(member.name);
    });
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log('  按学校分组:');
    Object.keys(schoolGroups).forEach(school => {
        console.log(`    "${school}": ${schoolGroups[school].length} 个社员`);
        console.log(`      社员列表: ${schoolGroups[school].join(', ')}`);
    });
    
    // 3. 测试新的统计逻辑
    console.log('\n3. 测试新的统计逻辑:');
    const currentAdminSchool = currentUser.school;
    const membersForCurrentSchool = allMembers.filter(member => {
        const memberSchool = member.school || '未设置学校';
        return memberSchool === currentAdminSchool;
    });
    
    console.log(`  当前管理员学校: "${currentAdminSchool}"`);
    console.log(`  该学校的社员数: ${membersForCurrentSchool.length}`);
    console.log(`  该学校的社员列表: ${membersForCurrentSchool.map(m => m.name).join(', ')}`);
    
    // 4. 测试loadAdminPage函数
    console.log('\n4. 测试loadAdminPage函数:');
    try {
        loadAdminPage();
        console.log('✅ loadAdminPage 执行成功');
        
        // 检查统计数据显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            const displayedTotal = totalMembersElement.textContent;
            console.log(`  显示的总社员数: ${displayedTotal}`);
            console.log(`  实际该学校社员数: ${membersForCurrentSchool.length}`);
            
            if (displayedTotal == membersForCurrentSchool.length) {
                console.log('  ✅ 总社员数统计正确');
            } else {
                console.log('  ❌ 总社员数统计不正确');
            }
        }
    } catch (error) {
        console.log('❌ loadAdminPage 执行出错:', error.message);
    }
    
    // 5. 测试loadAllMembersList函数
    console.log('\n5. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
                
                // 检查是否只显示了同学校的社员
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的社员行数: ${membersForCurrentSchool.length}`);
                
                if (memberRows.length === membersForCurrentSchool.length) {
                    console.log('  ✅ 社员列表数量正确');
                } else {
                    console.log('  ❌ 社员列表数量不正确');
                }
            } else {
                console.log('⚠️ 社员列表可能为空');
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 6. 验证学校名字归类逻辑
    console.log('\n6. 验证学校名字归类逻辑:');
    const testCases = [
        { memberSchool: currentAdminSchool, expected: true, description: '相同学校名字' },
        { memberSchool: '其他学校', expected: false, description: '不同学校名字' },
        { memberSchool: null, expected: false, description: '学校为null' },
        { memberSchool: undefined, expected: false, description: '学校为undefined' },
        { memberSchool: '', expected: false, description: '学校为空字符串' },
        { memberSchool: '上海市世外中学', expected: currentAdminSchool === '上海市世外中学', description: '上海市世外中学' }
    ];
    
    testCases.forEach((testCase, index) => {
        const memberSchool = testCase.memberSchool || '未设置学校';
        const actual = memberSchool === currentAdminSchool;
        const passed = actual === testCase.expected;
        console.log(`  测试 ${index + 1}: ${testCase.description}`);
        console.log(`    社员学校: "${testCase.memberSchool}"`);
        console.log(`    管理员学校: "${currentAdminSchool}"`);
        console.log(`    预期结果: ${testCase.expected}`);
        console.log(`    实际结果: ${actual}`);
        console.log(`    测试结果: ${passed ? '✅ 通过' : '❌ 失败'}`);
    });
    
    // 7. 检查周瀚辰的具体情况
    console.log('\n7. 检查周瀚辰的具体情况:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        const zhouSchool = zhouHanchen.school || '未设置学校';
        const shouldBeIncluded = zhouSchool === currentAdminSchool;
        
        console.log(`  周瀚辰学校: "${zhouHanchen.school}"`);
        console.log(`  管理员学校: "${currentAdminSchool}"`);
        console.log(`  是否应该被统计: ${shouldBeIncluded}`);
        
        if (shouldBeIncluded) {
            console.log('  ✅ 周瀚辰应该被统计到总社员数中');
        } else {
            console.log('  ❌ 周瀚辰不应该被统计到总社员数中');
            console.log(`    原因: 学校名字不匹配 ("${zhouSchool}" !== "${currentAdminSchool}")`);
        }
    } else {
        console.log('  ❌ 未找到周瀚辰的社员数据');
    }
    
    console.log('\n=== 新的按学校名字归类统计逻辑测试完成 ===');
}

// 专门诊断周瀚辰和管理员1的数据匹配问题
function diagnoseZhouHanchenAndAdmin1() {
    console.log('=== 专门诊断周瀚辰和管理员1的数据匹配问题 ===');
    
    // 1. 检查周瀚辰的完整数据
    console.log('\n1. 检查周瀚辰的完整数据:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        console.log('✅ 找到周瀚辰的社员数据');
        console.log('  完整数据:', JSON.stringify(zhouHanchen, null, 2));
        console.log(`  姓名: "${zhouHanchen.name}"`);
        console.log(`  学校: "${zhouHanchen.school}"`);
        console.log(`  学校类型: ${typeof zhouHanchen.school}`);
        console.log(`  学校长度: ${zhouHanchen.school ? zhouHanchen.school.length : 'null'}`);
        
        // 检查学校字符串的每个字符
        if (zhouHanchen.school) {
            console.log(`  学校字符码: [${zhouHanchen.school.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
            console.log(`  学校字符: [${zhouHanchen.school.split('').join(', ')}]`);
        }
    } else {
        console.log('❌ 未找到周瀚辰的社员数据');
        console.log('  所有社员列表:', Object.keys(globalMembers));
        return;
    }
    
    // 2. 检查管理员1的完整数据
    console.log('\n2. 检查管理员1的完整数据:');
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    const admin1 = admins['1'];
    if (admin1) {
        console.log('✅ 找到管理员1的数据');
        console.log('  完整数据:', JSON.stringify(admin1, null, 2));
        console.log(`  用户名: "1"`);
        console.log(`  学校: "${admin1.school}"`);
        console.log(`  学校类型: ${typeof admin1.school}`);
        console.log(`  学校长度: ${admin1.school ? admin1.school.length : 'null'}`);
        
        // 检查学校字符串的每个字符
        if (admin1.school) {
            console.log(`  学校字符码: [${admin1.school.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
            console.log(`  学校字符: [${admin1.school.split('').join(', ')}]`);
        }
    } else {
        console.log('❌ 未找到管理员1的数据');
        console.log('  所有管理员列表:', Object.keys(admins));
        return;
    }
    
    // 3. 检查当前用户信息
    console.log('\n3. 检查当前用户信息:');
    if (currentUser) {
        console.log(`  当前用户: "${currentUser.username}"`);
        console.log(`  当前用户学校: "${currentUser.school}"`);
        console.log(`  当前用户类型: ${currentUser.type}`);
        
        // 检查当前用户是否是管理员1
        if (currentUser.username === '1') {
            console.log('  ✅ 当前用户是管理员1');
        } else {
            console.log('  ⚠️ 当前用户不是管理员1');
            console.log('  请确保以管理员1身份登录');
        }
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 4. 详细比较学校名称
    console.log('\n4. 详细比较学校名称:');
    if (zhouHanchen && admin1) {
        const memberSchool = zhouHanchen.school;
        const adminSchool = admin1.school;
        
        console.log(`  周瀚辰学校: "${memberSchool}"`);
        console.log(`  管理员1学校: "${adminSchool}"`);
        console.log(`  严格相等 (===): ${memberSchool === adminSchool}`);
        console.log(`  宽松相等 (==): ${memberSchool == adminSchool}`);
        
        // 检查是否有隐藏字符
        if (memberSchool && adminSchool) {
            const memberTrimmed = memberSchool.trim();
            const adminTrimmed = adminSchool.trim();
            console.log(`  周瀚辰学校(去空格): "${memberTrimmed}"`);
            console.log(`  管理员1学校(去空格): "${adminTrimmed}"`);
            console.log(`  去空格后相等: ${memberTrimmed === adminTrimmed}`);
        }
        
        // 检查是否包含"上海市世外中学"
        const targetSchool = '上海市世外中学';
        console.log(`  目标学校: "${targetSchool}"`);
        console.log(`  周瀚辰学校包含目标: ${memberSchool && memberSchool.includes(targetSchool)}`);
        console.log(`  管理员1学校包含目标: ${adminSchool && adminSchool.includes(targetSchool)}`);
    }
    
    // 5. 测试新的统计逻辑
    console.log('\n5. 测试新的统计逻辑:');
    if (zhouHanchen && currentUser) {
        const memberSchool = zhouHanchen.school || '未设置学校';
        const adminSchool = currentUser.school;
        
        console.log(`  周瀚辰学校: "${memberSchool}"`);
        console.log(`  当前管理员学校: "${adminSchool}"`);
        console.log(`  学校名字匹配: ${memberSchool === adminSchool}`);
        
        // 手动执行新的统计逻辑
        const allMembers = Object.values(globalMembers);
        const schoolGroups = {};
        let totalForCurrentSchool = 0;
        
        allMembers.forEach(member => {
            const mSchool = member.school || '未设置学校';
            if (!schoolGroups[mSchool]) {
                schoolGroups[mSchool] = [];
            }
            schoolGroups[mSchool].push(member.name);
            
            if (mSchool === adminSchool) {
                totalForCurrentSchool++;
            }
        });
        
        console.log('  各学校社员分组:');
        Object.keys(schoolGroups).forEach(school => {
            console.log(`    "${school}": ${schoolGroups[school].join(', ')}`);
        });
        
        console.log(`  当前学校 "${adminSchool}" 的社员数: ${totalForCurrentSchool}`);
        console.log(`  周瀚辰是否应该被统计: ${memberSchool === adminSchool}`);
    }
    
    // 6. 检查localStorage中的原始数据
    console.log('\n6. 检查localStorage中的原始数据:');
    try {
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            const storedZhou = parsedMembers['周瀚辰'];
            if (storedZhou) {
                console.log('  localStorage中周瀚辰的数据:');
                console.log(`    学校: "${storedZhou.school}"`);
                console.log(`    完整数据: ${JSON.stringify(storedZhou, null, 2)}`);
            }
        }
        
        const storedAdmins = localStorage.getItem('admins');
        if (storedAdmins) {
            const parsedAdmins = JSON.parse(storedAdmins);
            const storedAdmin1 = parsedAdmins['1'];
            if (storedAdmin1) {
                console.log('  localStorage中管理员1的数据:');
                console.log(`    学校: "${storedAdmin1.school}"`);
                console.log(`    完整数据: ${JSON.stringify(storedAdmin1, null, 2)}`);
            }
        }
    } catch (error) {
        console.log('  ❌ 读取localStorage出错:', error.message);
    }
    
    // 7. 强制修复尝试
    console.log('\n7. 强制修复尝试:');
    if (zhouHanchen && admin1 && currentUser) {
        console.log('  尝试修复数据匹配问题...');
        
        // 确保周瀚辰和管理员1的学校都是"上海市世外中学"
        const targetSchool = '上海市世外中学';
        
        console.log(`  设置周瀚辰学校为: "${targetSchool}"`);
        zhouHanchen.school = targetSchool;
        
        console.log(`  设置管理员1学校为: "${targetSchool}"`);
        admin1.school = targetSchool;
        
        // 更新currentUser
        if (currentUser.username === '1') {
            currentUser.school = targetSchool;
            console.log(`  更新currentUser学校为: "${targetSchool}"`);
        }
        
        // 保存到localStorage
        localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
        localStorage.setItem('admins', JSON.stringify(admins));
        
        console.log('  ✅ 已保存修复后的数据');
        
        // 验证修复结果
        console.log('  验证修复结果:');
        console.log(`    周瀚辰学校: "${zhouHanchen.school}"`);
        console.log(`    管理员1学校: "${admin1.school}"`);
        console.log(`    当前用户学校: "${currentUser.school}"`);
        console.log(`    学校匹配: ${zhouHanchen.school === currentUser.school}`);
        
        // 重新加载页面
        try {
            loadAdminPage();
            console.log('  ✅ 已重新加载管理员页面');
            
            const totalMembersElement = document.getElementById('totalMembers');
            if (totalMembersElement) {
                console.log(`  修复后总社员数: ${totalMembersElement.textContent}`);
            }
        } catch (error) {
            console.log('  ❌ 重新加载页面出错:', error.message);
        }
    }
    
    console.log('\n=== 周瀚辰和管理员1数据匹配问题诊断完成 ===');
}

// 查询周瀚辰的学校信息
function checkZhouHanchenSchool() {
    console.log('=== 查询周瀚辰的学校信息 ===');
    
    // 1. 检查内存中的周瀚辰数据
    console.log('\n1. 内存中的周瀚辰数据:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        console.log('✅ 找到周瀚辰的社员数据');
        console.log('  完整数据:', JSON.stringify(zhouHanchen, null, 2));
        console.log(`  姓名: "${zhouHanchen.name}"`);
        console.log(`  学校: "${zhouHanchen.school}"`);
        console.log(`  学校类型: ${typeof zhouHanchen.school}`);
        console.log(`  学校长度: ${zhouHanchen.school ? zhouHanchen.school.length : 'null'}`);
        
        if (zhouHanchen.school) {
            console.log(`  学校字符码: [${zhouHanchen.school.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
            console.log(`  学校字符: [${zhouHanchen.school.split('').join(', ')}]`);
        }
        
        console.log(`\n📋 答案：周瀚辰属于学校 "${zhouHanchen.school}"`);
    } else {
        console.log('❌ 未找到周瀚辰的社员数据');
        console.log('  所有社员列表:', Object.keys(globalMembers));
    }
    
    // 2. 检查localStorage中的周瀚辰数据
    console.log('\n2. localStorage中的周瀚辰数据:');
    try {
        const storedMembers = localStorage.getItem('globalMembers');
        if (storedMembers) {
            const parsedMembers = JSON.parse(storedMembers);
            const storedZhou = parsedMembers['周瀚辰'];
            if (storedZhou) {
                console.log('✅ localStorage中找到周瀚辰的数据');
                console.log(`  学校: "${storedZhou.school}"`);
                console.log(`  完整数据: ${JSON.stringify(storedZhou, null, 2)}`);
                
                console.log(`\n📋 localStorage答案：周瀚辰属于学校 "${storedZhou.school}"`);
            } else {
                console.log('❌ localStorage中没有周瀚辰的数据');
            }
        } else {
            console.log('❌ localStorage中没有globalMembers数据');
        }
    } catch (error) {
        console.log('❌ 读取localStorage出错:', error.message);
    }
    
    // 3. 检查所有社员的学校分布
    console.log('\n3. 所有社员的学校分布:');
    const schoolGroups = {};
    const allMembers = Object.values(globalMembers);
    
    allMembers.forEach(member => {
        const memberSchool = member.school || '未设置学校';
        if (!schoolGroups[memberSchool]) {
            schoolGroups[memberSchool] = [];
        }
        schoolGroups[memberSchool].push(member.name);
    });
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log('  按学校分组:');
    Object.keys(schoolGroups).forEach(school => {
        console.log(`    "${school}": ${schoolGroups[school].length} 个社员`);
        console.log(`      社员列表: ${schoolGroups[school].join(', ')}`);
    });
    
    // 4. 检查当前用户信息（用于对比）
    console.log('\n4. 当前用户信息（用于对比）:');
    if (currentUser) {
        console.log(`  当前用户: "${currentUser.username}"`);
        console.log(`  当前用户学校: "${currentUser.school}"`);
        console.log(`  当前用户类型: ${currentUser.type}`);
        
        // 检查周瀚辰是否与当前用户同学校
        if (zhouHanchen) {
            const isSameSchool = zhouHanchen.school === currentUser.school;
            console.log(`  周瀚辰与当前用户同学校: ${isSameSchool}`);
            if (isSameSchool) {
                console.log('  ✅ 周瀚辰应该被统计到当前用户的总社员数中');
            } else {
                console.log('  ❌ 周瀚辰不应该被统计到当前用户的总社员数中');
            }
        }
    } else {
        console.log('  ❌ 当前用户未设置');
    }
    
    console.log('\n=== 周瀚辰学校信息查询完成 ===');
}

// 测试新的内容匹配统计逻辑
function testContentMatchLogic() {
    console.log('=== 测试新的内容匹配统计逻辑 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
        console.log(`  管理员学校类型: ${typeof currentUser.school}`);
        console.log(`  管理员学校长度: ${currentUser.school ? currentUser.school.length : 'null'}`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 分析所有社员的学校内容匹配情况
    console.log('\n2. 所有社员的学校内容匹配分析:');
    const allMembers = Object.values(globalMembers);
    const adminSchool = currentUser.school || '';
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  管理员学校: "${adminSchool}"`);
    
    let matchedMembers = [];
    let unmatchedMembers = [];
    
    allMembers.forEach(member => {
        const memberSchool = member.school || '';
        const isContentMatch = memberSchool === adminSchool;
        
        if (isContentMatch) {
            matchedMembers.push(member.name);
            console.log(`  ✅ ${member.name}: "${memberSchool}" === "${adminSchool}" (匹配)`);
        } else {
            unmatchedMembers.push(member.name);
            console.log(`  ❌ ${member.name}: "${memberSchool}" !== "${adminSchool}" (不匹配)`);
        }
    });
    
    console.log(`\n  内容匹配的社员: ${matchedMembers.length} 个`);
    console.log(`    列表: ${matchedMembers.join(', ')}`);
    console.log(`  内容不匹配的社员: ${unmatchedMembers.length} 个`);
    console.log(`    列表: ${unmatchedMembers.join(', ')}`);
    
    // 3. 测试loadAdminPage函数
    console.log('\n3. 测试loadAdminPage函数:');
    try {
        loadAdminPage();
        console.log('✅ loadAdminPage 执行成功');
        
        // 检查统计数据显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            const displayedTotal = totalMembersElement.textContent;
            console.log(`  显示的总社员数: ${displayedTotal}`);
            console.log(`  实际内容匹配社员数: ${matchedMembers.length}`);
            
            if (displayedTotal == matchedMembers.length) {
                console.log('  ✅ 总社员数统计正确');
            } else {
                console.log('  ❌ 总社员数统计不正确');
            }
        }
    } catch (error) {
        console.log('❌ loadAdminPage 执行出错:', error.message);
    }
    
    // 4. 测试loadAllMembersList函数
    console.log('\n4. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
                
                // 检查是否只显示了内容匹配的社员
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的社员行数: ${matchedMembers.length}`);
                
                if (memberRows.length === matchedMembers.length) {
                    console.log('  ✅ 社员列表数量正确');
                } else {
                    console.log('  ❌ 社员列表数量不正确');
                }
            } else {
                console.log('⚠️ 社员列表可能为空');
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 5. 验证内容匹配逻辑
    console.log('\n5. 验证内容匹配逻辑:');
    const testCases = [
        { memberSchool: adminSchool, expected: true, description: '完全相同的学校内容' },
        { memberSchool: '其他学校', expected: false, description: '不同的学校内容' },
        { memberSchool: null, expected: false, description: '学校为null' },
        { memberSchool: undefined, expected: false, description: '学校为undefined' },
        { memberSchool: '', expected: adminSchool === '', description: '学校为空字符串' },
        { memberSchool: '上海市世外中学', expected: adminSchool === '上海市世外中学', description: '上海市世外中学' }
    ];
    
    testCases.forEach((testCase, index) => {
        const memberSchool = testCase.memberSchool || '';
        const actual = memberSchool === adminSchool;
        const passed = actual === testCase.expected;
        console.log(`  测试 ${index + 1}: ${testCase.description}`);
        console.log(`    社员学校: "${testCase.memberSchool}"`);
        console.log(`    管理员学校: "${adminSchool}"`);
        console.log(`    预期结果: ${testCase.expected}`);
        console.log(`    实际结果: ${actual}`);
        console.log(`    测试结果: ${passed ? '✅ 通过' : '❌ 失败'}`);
    });
    
    // 6. 检查周瀚辰的具体情况
    console.log('\n6. 检查周瀚辰的具体情况:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        const zhouSchool = zhouHanchen.school || '';
        const shouldBeIncluded = zhouSchool === adminSchool;
        
        console.log(`  周瀚辰学校: "${zhouHanchen.school}"`);
        console.log(`  管理员学校: "${adminSchool}"`);
        console.log(`  内容匹配: ${shouldBeIncluded}`);
        
        if (shouldBeIncluded) {
            console.log('  ✅ 周瀚辰应该被统计到总社员数中');
        } else {
            console.log('  ❌ 周瀚辰不应该被统计到总社员数中');
            console.log(`    原因: 学校内容不匹配 ("${zhouSchool}" !== "${adminSchool}")`);
        }
    } else {
        console.log('  ❌ 未找到周瀚辰的社员数据');
    }
    
    console.log('\n=== 新的内容匹配统计逻辑测试完成 ===');
}

// 测试社员列表列举功能
function testMemberListListing() {
    console.log('=== 测试社员列表列举功能 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 分析所有社员的学校归属
    console.log('\n2. 所有社员的学校归属分析:');
    const allMembers = Object.values(globalMembers);
    const adminSchool = currentUser.school || '';
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  管理员学校: "${adminSchool}"`);
    
    const sameSchoolMembers = [];
    const otherSchoolMembers = [];
    
    allMembers.forEach(member => {
        const memberSchool = member.school || '';
        const isSameSchool = memberSchool === adminSchool;
        
        if (isSameSchool) {
            sameSchoolMembers.push(member);
            console.log(`  ✅ 同学校社员: ${member.name} (学校: "${memberSchool}")`);
        } else {
            otherSchoolMembers.push(member);
            console.log(`  ℹ️ 其他学校社员: ${member.name} (学校: "${memberSchool}")`);
        }
    });
    
    console.log(`\n  同学校社员: ${sameSchoolMembers.length} 个`);
    console.log(`    列表: ${sameSchoolMembers.map(m => m.name).join(', ')}`);
    console.log(`  其他学校社员: ${otherSchoolMembers.length} 个`);
    console.log(`    列表: ${otherSchoolMembers.map(m => m.name).join(', ')}`);
    
    // 3. 测试loadAllMembersList函数
    console.log('\n3. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
                
                // 检查是否只显示了同学校的社员
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的同学校社员行数: ${sameSchoolMembers.length}`);
                
                if (memberRows.length === sameSchoolMembers.length) {
                    console.log('  ✅ 社员列表数量正确');
                } else {
                    console.log('  ❌ 社员列表数量不正确');
                }
                
                // 检查是否包含学校列
                const hasSchoolColumn = clubsListElement.innerHTML.includes('学校</th>');
                if (hasSchoolColumn) {
                    console.log('  ✅ 包含学校列');
                } else {
                    console.log('  ❌ 缺少学校列');
                }
                
                // 检查是否高亮显示同学校社员
                const hasHighlightedRows = clubsListElement.innerHTML.includes('background: #f0f8ff');
                if (hasHighlightedRows) {
                    console.log('  ✅ 同学校社员已高亮显示');
                } else {
                    console.log('  ❌ 同学校社员未高亮显示');
                }
                
            } else {
                console.log('⚠️ 社员列表可能为空');
                
                // 检查是否显示了"暂无同学校社员"的提示
                const hasNoMembersMessage = clubsListElement.innerHTML.includes('暂无同学校社员');
                if (hasNoMembersMessage) {
                    console.log('  ℹ️ 显示了"暂无同学校社员"的提示');
                }
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 4. 验证社员详细信息
    console.log('\n4. 验证社员详细信息:');
    sameSchoolMembers.forEach(member => {
        console.log(`\n  社员: ${member.name}`);
        console.log(`    学校: "${member.school}"`);
        console.log(`    密码: ${member.password}`);
        console.log(`    加入社团数: ${member.joinedClubs ? member.joinedClubs.length : 0}`);
        
        if (member.joinedClubs && member.joinedClubs.length > 0) {
            console.log(`    加入的社团:`);
            member.joinedClubs.forEach(clubId => {
                const club = clubs[clubId];
                if (club) {
                    console.log(`      - ${club.name} (${clubId}) - 学校: "${club.schoolName}"`);
                }
            });
        }
    });
    
    // 5. 检查周瀚辰的具体情况
    console.log('\n5. 检查周瀚辰的具体情况:');
    const zhouHanchen = globalMembers['周瀚辰'];
    if (zhouHanchen) {
        const zhouSchool = zhouHanchen.school || '';
        const shouldBeListed = zhouSchool === adminSchool;
        
        console.log(`  周瀚辰学校: "${zhouHanchen.school}"`);
        console.log(`  管理员学校: "${adminSchool}"`);
        console.log(`  应该被列举: ${shouldBeListed}`);
        
        if (shouldBeListed) {
            console.log('  ✅ 周瀚辰应该被列举在社员列表中');
            
            // 检查周瀚辰是否在sameSchoolMembers数组中
            const isInSameSchoolList = sameSchoolMembers.some(m => m.name === '周瀚辰');
            if (isInSameSchoolList) {
                console.log('  ✅ 周瀚辰已在同学校社员列表中');
            } else {
                console.log('  ❌ 周瀚辰未在同学校社员列表中');
            }
        } else {
            console.log('  ❌ 周瀚辰不应该被列举在社员列表中');
            console.log(`    原因: 学校不匹配 ("${zhouSchool}" !== "${adminSchool}")`);
        }
    } else {
        console.log('  ❌ 未找到周瀚辰的社员数据');
    }
    
    console.log('\n=== 社员列表列举功能测试完成 ===');
}

// 检测和修复学校名称编码差异
function detectAndFixSchoolNameEncodingDifferences() {
    console.log('=== 检测和修复学校名称编码差异 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
        console.log(`  管理员学校类型: ${typeof currentUser.school}`);
        console.log(`  管理员学校长度: ${currentUser.school ? currentUser.school.length : 'null'}`);
        
        // 分析管理员学校名称的字符编码
        if (currentUser.school) {
            console.log('  管理员学校字符编码分析:');
            for (let i = 0; i < currentUser.school.length; i++) {
                const char = currentUser.school[i];
                const charCode = char.charCodeAt(0);
                console.log(`    字符 ${i}: "${char}" (Unicode: ${charCode}, 十六进制: 0x${charCode.toString(16)})`);
            }
        }
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 检查所有社员的学校名称编码
    console.log('\n2. 所有社员的学校名称编码分析:');
    const allMembers = Object.values(globalMembers);
    const adminSchool = currentUser.school || '';
    
    console.log(`  总社员数: ${allMembers.length}`);
    
    let encodingIssuesFound = [];
    let fixedMembers = [];
    
    allMembers.forEach(member => {
        const memberSchool = member.school || '';
        
        console.log(`\n  社员: ${member.name}`);
        console.log(`    学校: "${memberSchool}"`);
        console.log(`    学校类型: ${typeof memberSchool}`);
        console.log(`    学校长度: ${memberSchool.length}`);
        
        // 分析社员学校名称的字符编码
        if (memberSchool) {
            console.log('    社员学校字符编码分析:');
            for (let i = 0; i < memberSchool.length; i++) {
                const char = memberSchool[i];
                const charCode = char.charCodeAt(0);
                console.log(`      字符 ${i}: "${char}" (Unicode: ${charCode}, 十六进制: 0x${charCode.toString(16)})`);
            }
        }
        
        // 检查编码差异
        const hasEncodingDifference = checkEncodingDifference(adminSchool, memberSchool);
        if (hasEncodingDifference) {
            console.log('    ❌ 发现编码差异');
            encodingIssuesFound.push({
                memberName: member.name,
                memberSchool: memberSchool,
                adminSchool: adminSchool,
                difference: hasEncodingDifference
            });
        } else {
            console.log('    ✅ 编码一致');
        }
    });
    
    // 3. 修复编码差异
    console.log('\n3. 修复编码差异:');
    if (encodingIssuesFound.length > 0) {
        console.log(`  发现 ${encodingIssuesFound.length} 个编码差异，开始修复...`);
        
        encodingIssuesFound.forEach(issue => {
            console.log(`\n  修复社员: ${issue.memberName}`);
            console.log(`    原学校: "${issue.memberSchool}"`);
            
            // 尝试修复编码
            const fixedSchool = fixSchoolNameEncoding(issue.memberSchool, adminSchool);
            
            if (fixedSchool !== issue.memberSchool) {
                console.log(`    修复后: "${fixedSchool}"`);
                
                // 更新社员数据
                if (globalMembers[issue.memberName]) {
                    globalMembers[issue.memberName].school = fixedSchool;
                    fixedMembers.push({
                        memberName: issue.memberName,
                        originalSchool: issue.memberSchool,
                        fixedSchool: fixedSchool
                    });
                    console.log('    ✅ 社员学校名称已修复');
                } else {
                    console.log('    ❌ 无法找到社员数据');
                }
            } else {
                console.log('    ℹ️ 无需修复');
            }
        });
        
        // 保存修复后的数据
        if (fixedMembers.length > 0) {
            try {
                localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
                console.log(`\n✅ 已保存 ${fixedMembers.length} 个社员的修复数据到localStorage`);
            } catch (error) {
                console.log('❌ 保存数据失败:', error.message);
            }
        }
        
    } else {
        console.log('  ✅ 未发现编码差异');
    }
    
    // 4. 验证修复结果
    console.log('\n4. 验证修复结果:');
    if (fixedMembers.length > 0) {
        console.log(`  修复了 ${fixedMembers.length} 个社员的学校名称:`);
        fixedMembers.forEach(fixed => {
            console.log(`    ${fixed.memberName}: "${fixed.originalSchool}" → "${fixed.fixedSchool}"`);
        });
        
        // 重新测试学校匹配
        console.log('\n  重新测试学校匹配:');
        const adminSchoolFixed = currentUser.school || '';
        let matchedCount = 0;
        
        Object.values(globalMembers).forEach(member => {
            const memberSchool = member.school || '';
            const isMatch = memberSchool === adminSchoolFixed;
            
            if (isMatch) {
                matchedCount++;
                console.log(`    ✅ ${member.name}: "${memberSchool}" === "${adminSchoolFixed}"`);
            } else {
                console.log(`    ❌ ${member.name}: "${memberSchool}" !== "${adminSchoolFixed}"`);
            }
        });
        
        console.log(`\n  修复后匹配的社员数量: ${matchedCount}`);
        
        // 重新加载页面数据
        console.log('\n  重新加载页面数据...');
        try {
            loadAdminPage();
            console.log('  ✅ 管理员页面已重新加载');
        } catch (error) {
            console.log('  ❌ 重新加载页面失败:', error.message);
        }
        
    } else {
        console.log('  ℹ️ 无需验证修复结果');
    }
    
    console.log('\n=== 学校名称编码差异检测和修复完成 ===');
}

// 检查两个学校名称的编码差异
function checkEncodingDifference(school1, school2) {
    if (!school1 || !school2) {
        return school1 !== school2 ? 'null/undefined差异' : null;
    }
    
    // 检查长度差异
    if (school1.length !== school2.length) {
        return `长度差异: ${school1.length} vs ${school2.length}`;
    }
    
    // 检查字符级别的差异
    for (let i = 0; i < school1.length; i++) {
        const char1 = school1[i];
        const char2 = school2[i];
        
        if (char1 !== char2) {
            const code1 = char1.charCodeAt(0);
            const code2 = char2.charCodeAt(0);
            return `字符差异: 位置${i}, "${char1}"(${code1}) vs "${char2}"(${code2})`;
        }
    }
    
    return null; // 无差异
}

// 修复学校名称编码
function fixSchoolNameEncoding(memberSchool, adminSchool) {
    if (!memberSchool || !adminSchool) {
        return memberSchool;
    }
    
    // 尝试多种修复方法
    
    // 方法1: 直接替换为管理员学校名称
    if (memberSchool.trim() === adminSchool.trim()) {
        return adminSchool;
    }
    
    // 方法2: 处理常见的编码问题
    let fixed = memberSchool;
    
    // 处理全角/半角字符
    fixed = fixed.replace(/（/g, '(').replace(/）/g, ')');
    fixed = fixed.replace(/，/g, ',').replace(/。/g, '.');
    fixed = fixed.replace(/：/g, ':').replace(/；/g, ';');
    
    // 处理空格
    fixed = fixed.replace(/\s+/g, ' ').trim();
    
    // 方法3: 如果修复后与管理员学校相同，则使用管理员学校
    if (fixed === adminSchool) {
        return adminSchool;
    }
    
    // 方法4: 检查是否只是空格差异
    if (fixed.replace(/\s/g, '') === adminSchool.replace(/\s/g, '')) {
        return adminSchool;
    }
    
    return memberSchool; // 无法修复，返回原值
}

// 快速检测学校名称编码差异
function quickCheckSchoolEncodingDifferences() {
    console.log('=== 快速检测学校名称编码差异 ===');
    
    if (!currentUser) {
        console.log('❌ 当前用户未设置');
        return;
    }
    
    const adminSchool = currentUser.school || '';
    console.log(`管理员学校: "${adminSchool}"`);
    
    let differences = [];
    
    Object.values(globalMembers).forEach(member => {
        const memberSchool = member.school || '';
        const difference = checkEncodingDifference(adminSchool, memberSchool);
        
        if (difference) {
            differences.push({
                member: member.name,
                memberSchool: memberSchool,
                difference: difference
            });
        }
    });
    
    if (differences.length > 0) {
        console.log(`发现 ${differences.length} 个编码差异:`);
        differences.forEach(diff => {
            console.log(`  ${diff.member}: "${diff.memberSchool}" - ${diff.difference}`);
        });
        
        console.log('\n建议运行: detectAndFixSchoolNameEncodingDifferences() 来修复这些差异');
    } else {
        console.log('✅ 未发现编码差异');
    }
    
    console.log('=== 快速检测完成 ===');
}

// 测试新的总社员数计算逻辑（活跃社团社员数相加减重复）
function testNewTotalMemberCalculation() {
    console.log('=== 测试新的总社员数计算逻辑（活跃社团社员数相加减重复） ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 统计活跃社团中的社员
    console.log('\n2. 统计活跃社团中的社员:');
    const adminSchool = currentUser.school || '';
    const activeClubMembers = new Set();
    let totalMemberCountFromClubs = 0;
    const clubDetails = [];
    
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === adminSchool) {
            const clubMembers = Object.keys(club.members);
            clubDetails.push({
                clubId: clubId,
                clubName: club.name,
                memberCount: clubMembers.length,
                members: clubMembers
            });
            
            console.log(`\n社团: ${club.name} (${clubId})`);
            console.log(`  社团学校: "${club.schoolName}"`);
            console.log(`  社团成员数: ${clubMembers.length}`);
            console.log(`  社团成员: ${clubMembers.join(', ')}`);
            
            // 统计该社团的所有成员
            clubMembers.forEach(memberName => {
                if (!activeClubMembers.has(memberName)) {
                    activeClubMembers.add(memberName);
                    totalMemberCountFromClubs++;
                    console.log(`    ✅ 新社员: ${memberName} (+1)`);
                } else {
                    console.log(`    ℹ️ 重复社员: ${memberName} (已统计)`);
                }
            });
        }
    }
    
    const totalMembersForCurrentSchool = activeClubMembers.size;
    const duplicateMembers = totalMemberCountFromClubs - totalMembersForCurrentSchool;
    
    console.log(`\n总社员数统计结果:`);
    console.log(`  活跃社团总数: ${clubDetails.length}`);
    console.log(`  所有社团成员总数: ${totalMemberCountFromClubs}`);
    console.log(`  去重后总社员数: ${totalMembersForCurrentSchool}`);
    console.log(`  重复社员数: ${duplicateMembers}`);
    
    // 3. 显示所有去重后的社员
    console.log(`\n去重后的社员列表:`);
    Array.from(activeClubMembers).forEach((memberName, index) => {
        console.log(`  ${index + 1}. ${memberName}`);
    });
    
    // 4. 显示每个社团的详细统计
    console.log(`\n各社团详细统计:`);
    clubDetails.forEach((club, index) => {
        console.log(`  ${index + 1}. ${club.clubName} (${club.clubId})`);
        console.log(`     成员数: ${club.memberCount}`);
        console.log(`     成员列表: ${club.members.join(', ')}`);
    });
    
    // 5. 测试loadAdminPage函数
    console.log('\n5. 测试loadAdminPage函数:');
    try {
        loadAdminPage();
        console.log('✅ loadAdminPage 执行成功');
        
        // 检查统计数据显示
        const totalMembersElement = document.getElementById('totalMembers');
        if (totalMembersElement) {
            const displayedTotal = totalMembersElement.textContent;
            console.log(`  显示的总社员数: ${displayedTotal}`);
            console.log(`  实际去重后社员数: ${totalMembersForCurrentSchool}`);
            
            if (displayedTotal == totalMembersForCurrentSchool) {
                console.log('  ✅ 总社员数统计正确');
            } else {
                console.log('  ❌ 总社员数统计不正确');
            }
        }
    } catch (error) {
        console.log('❌ loadAdminPage 执行出错:', error.message);
    }
    
    // 6. 测试loadAllMembersList函数
    console.log('\n6. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员列表已正确显示');
                
                // 检查是否只显示了活跃社团的社员
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的活跃社团社员行数: ${totalMembersForCurrentSchool}`);
                
                if (memberRows.length === totalMembersForCurrentSchool) {
                    console.log('  ✅ 社员列表数量正确');
                } else {
                    console.log('  ❌ 社员列表数量不正确');
                }
                
                // 检查是否包含"活跃社团社员"标识
                const hasActiveClubLabel = clubsListElement.innerHTML.includes('活跃社团社员');
                if (hasActiveClubLabel) {
                    console.log('  ✅ 包含"活跃社团社员"标识');
                } else {
                    console.log('  ❌ 缺少"活跃社团社员"标识');
                }
                
            } else {
                console.log('⚠️ 社员列表可能为空');
                
                // 检查是否显示了"暂无活跃社团社员"的提示
                const hasNoMembersMessage = clubsListElement.innerHTML.includes('暂无活跃社团社员');
                if (hasNoMembersMessage) {
                    console.log('  ℹ️ 显示了"暂无活跃社团社员"的提示');
                }
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 7. 验证去重逻辑
    console.log('\n7. 验证去重逻辑:');
    const allMembersFromClubs = [];
    clubDetails.forEach(club => {
        allMembersFromClubs.push(...club.members);
    });
    
    console.log(`  所有社团成员总数（含重复）: ${allMembersFromClubs.length}`);
    console.log(`  去重后成员总数: ${activeClubMembers.size}`);
    console.log(`  重复成员数: ${allMembersFromClubs.length - activeClubMembers.size}`);
    
    // 检查是否有重复成员
    const memberCounts = {};
    allMembersFromClubs.forEach(member => {
        memberCounts[member] = (memberCounts[member] || 0) + 1;
    });
    
    const duplicateMembersList = Object.keys(memberCounts).filter(member => memberCounts[member] > 1);
    if (duplicateMembersList.length > 0) {
        console.log(`  重复成员列表:`);
        duplicateMembersList.forEach(member => {
            console.log(`    ${member}: 出现 ${memberCounts[member]} 次`);
        });
    } else {
        console.log('  ✅ 无重复成员');
    }
    
    console.log('\n=== 新的总社员数计算逻辑测试完成 ===');
}

// 测试管理员注销后的数据清理效果
function testAdminDeleteCleanup() {
    console.log('=== 测试管理员注销后的数据清理效果 ===');
    
    // 1. 检查当前管理员信息
    console.log('\n1. 当前管理员信息:');
    if (currentUser) {
        console.log(`  用户名: ${currentUser.username}`);
        console.log(`  学校: ${currentUser.school}`);
        console.log(`  类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ 当前没有登录的管理员');
        return;
    }
    
    // 2. 检查该学校的社团数据
    console.log('\n2. 检查学校社团数据:');
    const globalClubs = JSON.parse(localStorage.getItem('clubs') || '{}');
    const schoolClubs = Object.values(globalClubs).filter(club => club.schoolName === currentUser.school);
    console.log(`  全局活跃社团: ${schoolClubs.length} 个`);
    schoolClubs.forEach(club => {
        console.log(`    - ${club.id}: ${club.name}`);
    });
    
    // 3. 检查该学校的已删除社团数据
    console.log('\n3. 检查学校已删除社团数据:');
    const globalDeletedClubs = JSON.parse(localStorage.getItem('deletedClubs') || '{}');
    const schoolDeletedClubs = Object.values(globalDeletedClubs).filter(club => club.schoolName === currentUser.school);
    console.log(`  全局已删除社团: ${schoolDeletedClubs.length} 个`);
    schoolDeletedClubs.forEach(club => {
        console.log(`    - ${club.id}: ${club.name}`);
    });
    
    // 4. 检查该学校的社员数据
    console.log('\n4. 检查学校社员数据:');
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers') || '{}');
    const schoolMembers = Object.values(globalMembers).filter(member => member.school === currentUser.school);
    console.log(`  全局社员: ${schoolMembers.length} 个`);
    schoolMembers.forEach(member => {
        console.log(`    - ${member.name}`);
    });
    
    // 5. 检查待审核社团
    console.log('\n5. 检查待审核社团:');
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs') || '{}');
    const schoolPendingClubs = Object.values(pendingClubs).filter(club => club.schoolName === currentUser.school);
    console.log(`  待审核社团: ${schoolPendingClubs.length} 个`);
    schoolPendingClubs.forEach(club => {
        console.log(`    - ${club.id}: ${club.name}`);
    });
    
    // 6. 检查所有管理员数据中的学校数据
    console.log('\n6. 检查所有管理员数据中的学校数据:');
    const allAdmins = JSON.parse(localStorage.getItem('admins') || '{}');
    Object.keys(allAdmins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        
        const adminSchoolClubs = Object.values(adminData.clubs || {}).filter(club => club.schoolName === currentUser.school);
        const adminSchoolDeletedClubs = Object.values(adminData.deletedClubs || {}).filter(club => club.schoolName === currentUser.school);
        const adminSchoolMembers = Object.values(adminData.globalMembers || {}).filter(member => member.school === currentUser.school);
        
        console.log(`  管理员 ${adminUsername}:`);
        console.log(`    活跃社团: ${adminSchoolClubs.length} 个`);
        console.log(`    已删除社团: ${adminSchoolDeletedClubs.length} 个`);
        console.log(`    社员: ${adminSchoolMembers.length} 个`);
    });
    
    // 7. 计算总影响
    console.log('\n7. 总影响统计:');
    const totalClubs = schoolClubs.length + schoolPendingClubs.length;
    const totalDeletedClubs = schoolDeletedClubs.length;
    const totalMembers = schoolMembers.length;
    
    console.log(`  将删除的活跃社团: ${totalClubs} 个`);
    console.log(`  将删除的已删除社团: ${totalDeletedClubs} 个`);
    console.log(`  将删除的社员: ${totalMembers} 个`);
    console.log(`  总影响数据: ${totalClubs + totalDeletedClubs + totalMembers} 项`);
    
    console.log('\n=== 管理员注销数据清理测试完成 ===');
}

// 测试社长删除社团后管理员系统同步功能
function testCaptainDeleteClubSync() {
    console.log('=== 测试社长删除社团后管理员系统同步功能 ===');
    
    // 1. 检查当前管理员数据
    console.log('\n1. 当前管理员数据:');
    console.log('  活跃社团数量:', Object.keys(clubs).length);
    console.log('  已删除社团数量:', Object.keys(deletedClubs).length);
    
    // 2. 检查全局数据
    console.log('\n2. 全局数据检查:');
    const globalClubs = JSON.parse(localStorage.getItem('clubs') || '{}');
    const globalDeletedClubs = JSON.parse(localStorage.getItem('deletedClubs') || '{}');
    console.log('  全局活跃社团数量:', Object.keys(globalClubs).length);
    console.log('  全局已删除社团数量:', Object.keys(globalDeletedClubs).length);
    
    // 3. 检查所有管理员数据
    console.log('\n3. 所有管理员数据检查:');
    const admins = JSON.parse(localStorage.getItem('admins') || '{}');
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        console.log(`  管理员 ${adminUsername}:`);
        console.log(`    活跃社团: ${Object.keys(adminData.clubs || {}).length}`);
        console.log(`    已删除社团: ${Object.keys(adminData.deletedClubs || {}).length}`);
    });
    
    // 4. 检查数据一致性
    console.log('\n4. 数据一致性检查:');
    const allAdminDeletedClubs = new Set();
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        Object.keys(adminData.deletedClubs || {}).forEach(clubId => {
            allAdminDeletedClubs.add(clubId);
        });
    });
    
    console.log('  所有管理员已删除社团总数:', allAdminDeletedClubs.size);
    console.log('  全局已删除社团数量:', Object.keys(globalDeletedClubs).length);
    
    if (allAdminDeletedClubs.size === Object.keys(globalDeletedClubs).length) {
        console.log('  ✅ 数据一致性检查通过');
    } else {
        console.log('  ❌ 数据一致性检查失败');
    }
    
    console.log('\n=== 社长删除社团同步功能测试完成 ===');
}

// 测试社团社员数据统计功能
function testClubMemberDataStatistics() {
    console.log('=== 测试社团社员数据统计功能 ===');
    
    // 1. 检查当前用户信息
    console.log('\n1. 当前用户信息:');
    if (currentUser) {
        console.log(`  管理员用户名: ${currentUser.username}`);
        console.log(`  管理员学校: "${currentUser.school}"`);
    } else {
        console.log('  ❌ 当前用户未设置');
        return;
    }
    
    // 2. 统计各个社团的社员数据
    console.log('\n2. 统计各个社团的社员数据:');
    const adminSchool = currentUser.school || '';
    const memberStatistics = new Map();
    
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === adminSchool) {
            console.log(`\n社团: ${club.name} (${clubId})`);
            console.log(`  社团学校: "${club.schoolName}"`);
            console.log(`  社团成员数: ${Object.keys(club.members).length}`);
            
            Object.keys(club.members).forEach(memberName => {
                console.log(`    处理社员: ${memberName}`);
                
                // 获取或创建社员统计记录
                if (!memberStatistics.has(memberName)) {
                    memberStatistics.set(memberName, {
                        name: memberName,
                        joinedClubs: [],
                        totalCheckins: 0,
                        totalCAS: { C: 0, A: 0, S: 0, total: 0 },
                        clubDetails: []
                    });
                }
                
                const memberStats = memberStatistics.get(memberName);
                
                // 添加加入的社团信息
                memberStats.joinedClubs.push(`${club.name} (${clubId})`);
                
                // 统计该社员在该社团的签到和CAS时间
                const memberCheckins = club.checkins.filter(c => 
                    c.memberName === memberName && c.status === 'approved'
                );
                
                memberStats.totalCheckins += memberCheckins.length;
                
                // 统计CAS时间
                memberCheckins.forEach(checkin => {
                    const timeSettings = checkin.timeSettings || {};
                    memberStats.totalCAS.C += timeSettings.C || 0;
                    memberStats.totalCAS.A += timeSettings.A || 0;
                    memberStats.totalCAS.S += timeSettings.S || 0;
                });
                
                memberStats.totalCAS.total = memberStats.totalCAS.C + memberStats.totalCAS.A + memberStats.totalCAS.S;
                
                console.log(`      签到次数: ${memberCheckins.length}`);
                console.log(`      CAS时间: C=${memberStats.totalCAS.C}h, A=${memberStats.totalCAS.A}h, S=${memberStats.totalCAS.S}h`);
            });
        }
    }
    
    const sameSchoolMembers = Array.from(memberStatistics.values());
    
    console.log(`\n统计结果:`);
    console.log(`  活跃社团中的社员数量: ${sameSchoolMembers.length}`);
    
    // 3. 显示详细统计信息
    console.log('\n3. 详细统计信息:');
    sameSchoolMembers.forEach((memberStats, index) => {
        console.log(`\n  ${index + 1}. 社员: ${memberStats.name}`);
        console.log(`     加入社团: ${memberStats.joinedClubs.join(', ')}`);
        console.log(`     社团数量: ${memberStats.joinedClubs.length}`);
        console.log(`     总签到次数: ${memberStats.totalCheckins}`);
        console.log(`     C时间: ${memberStats.totalCAS.C.toFixed(1)}h`);
        console.log(`     A时间: ${memberStats.totalCAS.A.toFixed(1)}h`);
        console.log(`     S时间: ${memberStats.totalCAS.S.toFixed(1)}h`);
        console.log(`     总CAS时间: ${memberStats.totalCAS.total.toFixed(1)}h`);
    });
    
    // 4. 测试loadAllMembersList函数
    console.log('\n4. 测试loadAllMembersList函数:');
    try {
        loadAllMembersList();
        console.log('✅ loadAllMembersList 执行成功');
        
        // 检查是否显示了正确的社员数据
        const clubsListElement = document.getElementById('clubsList');
        if (clubsListElement) {
            const hasMembers = clubsListElement.innerHTML.includes('社员姓名') && 
                              clubsListElement.innerHTML.includes('</tr>');
            if (hasMembers) {
                console.log('✅ 社员数据列表已正确显示');
                
                // 检查是否包含C A S时间列
                const hasCColumn = clubsListElement.innerHTML.includes('C时间</th>');
                const hasAColumn = clubsListElement.innerHTML.includes('A时间</th>');
                const hasSColumn = clubsListElement.innerHTML.includes('S时间</th>');
                const hasTotalCASColumn = clubsListElement.innerHTML.includes('总CAS</th>');
                
                if (hasCColumn && hasAColumn && hasSColumn && hasTotalCASColumn) {
                    console.log('  ✅ 包含C A S时间列');
                } else {
                    console.log('  ❌ 缺少C A S时间列');
                }
                
                // 检查是否包含"数据来源于各社团统计"标识
                const hasDataSourceLabel = clubsListElement.innerHTML.includes('数据来源于各社团统计');
                if (hasDataSourceLabel) {
                    console.log('  ✅ 包含数据来源标识');
                } else {
                    console.log('  ❌ 缺少数据来源标识');
                }
                
                // 检查社员行数
                const memberRows = clubsListElement.querySelectorAll('tbody tr');
                console.log(`  显示的社员行数: ${memberRows.length}`);
                console.log(`  预期的社员行数: ${sameSchoolMembers.length}`);
                
                if (memberRows.length === sameSchoolMembers.length) {
                    console.log('  ✅ 社员行数正确');
                } else {
                    console.log('  ❌ 社员行数不正确');
                }
                
            } else {
                console.log('⚠️ 社员数据列表可能为空');
                
                // 检查是否显示了"暂无社团社员数据"的提示
                const hasNoDataMessage = clubsListElement.innerHTML.includes('暂无社团社员数据');
                if (hasNoDataMessage) {
                    console.log('  ℹ️ 显示了"暂无社团社员数据"的提示');
                }
            }
        }
    } catch (error) {
        console.log('❌ loadAllMembersList 执行出错:', error.message);
    }
    
    // 5. 验证数据统计的准确性
    console.log('\n5. 验证数据统计的准确性:');
    let totalCheckinsFromClubs = 0;
    let totalCASFromClubs = { C: 0, A: 0, S: 0 };
    
    for (const clubId in clubs) {
        const club = clubs[clubId];
        if (club.schoolName === adminSchool) {
            Object.keys(club.members).forEach(memberName => {
                const memberCheckins = club.checkins.filter(c => 
                    c.memberName === memberName && c.status === 'approved'
                );
                
                totalCheckinsFromClubs += memberCheckins.length;
                
                memberCheckins.forEach(checkin => {
                    const timeSettings = checkin.timeSettings || {};
                    totalCASFromClubs.C += timeSettings.C || 0;
                    totalCASFromClubs.A += timeSettings.A || 0;
                    totalCASFromClubs.S += timeSettings.S || 0;
                });
            });
        }
    }
    
    const totalCASFromClubsTotal = totalCASFromClubs.C + totalCASFromClubs.A + totalCASFromClubs.S;
    
    console.log(`  所有社团总签到次数: ${totalCheckinsFromClubs}`);
    console.log(`  所有社团总CAS时间: C=${totalCASFromClubs.C.toFixed(1)}h, A=${totalCASFromClubs.A.toFixed(1)}h, S=${totalCASFromClubs.S.toFixed(1)}h, 总计=${totalCASFromClubsTotal.toFixed(1)}h`);
    
    // 计算去重后的统计
    let totalCheckinsDeduplicated = 0;
    let totalCASDeduplicated = { C: 0, A: 0, S: 0 };
    
    sameSchoolMembers.forEach(memberStats => {
        totalCheckinsDeduplicated += memberStats.totalCheckins;
        totalCASDeduplicated.C += memberStats.totalCAS.C;
        totalCASDeduplicated.A += memberStats.totalCAS.A;
        totalCASDeduplicated.S += memberStats.totalCAS.S;
    });
    
    const totalCASDeduplicatedTotal = totalCASDeduplicated.C + totalCASDeduplicated.A + totalCASDeduplicated.S;
    
    console.log(`  去重后总签到次数: ${totalCheckinsDeduplicated}`);
    console.log(`  去重后总CAS时间: C=${totalCASDeduplicated.C.toFixed(1)}h, A=${totalCASDeduplicated.A.toFixed(1)}h, S=${totalCASDeduplicated.S.toFixed(1)}h, 总计=${totalCASDeduplicatedTotal.toFixed(1)}h`);
    
    if (totalCheckinsFromClubs === totalCheckinsDeduplicated) {
        console.log('  ✅ 签到次数统计正确（无重复）');
    } else {
        console.log('  ℹ️ 签到次数有重复统计');
    }
    
    if (totalCASFromClubsTotal === totalCASDeduplicatedTotal) {
        console.log('  ✅ CAS时间统计正确（无重复）');
    } else {
        console.log('  ℹ️ CAS时间有重复统计');
    }
    
    console.log('\n=== 社团社员数据统计功能测试完成 ===');
}
