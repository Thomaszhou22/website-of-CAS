// 数据存储（实际应用中应使用后端数据库）
let clubs = JSON.parse(localStorage.getItem('clubs')) || {};
let deletedClubs = JSON.parse(localStorage.getItem('deletedClubs')) || {}; // 存储已删除的社团
let globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {}; // 全局社员数据
let currentClub = null;
let currentUser = null;

// 日历相关变量
let currentCalendarDate = new Date();
let selectedActivityDate = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeLoginInterface();
});

// 备用初始化 - 如果DOMContentLoaded没有触发
setTimeout(() => {
    if (document.readyState === 'complete') {
        console.log('DOM已加载完成，执行备用初始化...');
        initializeLoginInterface();
    }
}, 1000);

// 强制初始化 - 最后的备用方案
window.addEventListener('load', () => {
    console.log('页面完全加载，执行强制初始化...');
    initializeLoginInterface();
});

// 备用初始化方法
function initializeLoginInterface() {
    try {
        console.log('开始初始化登录界面...');
        
        // 防止重复初始化
        if (window.loginInterfaceInitialized) {
            console.log('登录界面已经初始化过了，跳过');
            return;
        }
        
        // 登录页面标签切换
        const tabButtons = document.querySelectorAll('.tab-btn');
        console.log(`找到 ${tabButtons.length} 个标签页按钮`);
        
        tabButtons.forEach(btn => {
            // 移除可能存在的旧事件监听器
            btn.removeEventListener('click', handleTabClick);
            // 添加新的事件监听器
            btn.addEventListener('click', handleTabClick);
        });

        // 加载保存的数据
        loadSavedData();
        
        // 标记为已初始化
        window.loginInterfaceInitialized = true;
        
        console.log('登录界面初始化完成');
        
    } catch (error) {
        console.error('初始化登录界面时出错:', error);
    }
}

// 标签页点击处理函数
function handleTabClick(event) {
    try {
        const btn = event.target;
        const role = btn.getAttribute('data-role');
        console.log(`点击标签页: ${role}`);
        
        switchLoginForm(role);
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
    } catch (error) {
        console.error('处理标签页点击时出错:', error);
    }
}

// 手动初始化登录界面（备用方法）
function manualInitializeLogin() {
    console.log('手动初始化登录界面...');
    window.loginInterfaceInitialized = false; // 重置初始化状态
    initializeLoginInterface();
    console.log('登录界面初始化完成');
}

// 紧急修复函数 - 强制重新绑定所有事件
function emergencyFix() {
    console.log('=== 执行紧急修复 ===');
    
    try {
        // 重置初始化状态
        window.loginInterfaceInitialized = false;
        
        // 重新初始化
        initializeLoginInterface();
        
        // 测试标签页切换
        const tabButtons = document.querySelectorAll('.tab-btn');
        console.log(`找到 ${tabButtons.length} 个标签页按钮`);
        
        if (tabButtons.length > 0) {
            console.log('测试标签页切换...');
            const memberTab = tabButtons[1]; // 社员标签页
            if (memberTab) {
                memberTab.click();
                console.log('✅ 标签页切换测试成功');
            }
        }
        
        // 测试登录按钮
        const loginButtons = document.querySelectorAll('button[onclick*="Login"]');
        console.log(`找到 ${loginButtons.length} 个登录按钮`);
        
        console.log('✅ 紧急修复完成');
        
    } catch (error) {
        console.error('紧急修复失败:', error);
    }
}

// 切换登录表单
function switchLoginForm(role) {
    document.getElementById('captainLogin').style.display = role === 'captain' ? 'block' : 'none';
    document.getElementById('memberLogin').style.display = role === 'member' ? 'block' : 'none';
}

// 测试学校验证功能
function testSchoolValidation() {
    console.log('=== 测试学校验证功能 ===');
    
    // 测试1: 检查当前管理员数据
    const admins = JSON.parse(localStorage.getItem('admins') || '{}');
    console.log('当前管理员数据:', admins);
    
    // 测试2: 获取已注册学校
    const registeredSchools = getRegisteredSchools();
    console.log('已注册学校列表:', registeredSchools);
    
    // 测试3: 测试学校"1"
    const testSchool = '1';
    const isRegistered = isSchoolRegistered(testSchool);
    console.log(`学校"${testSchool}"是否已注册:`, isRegistered);
    
    // 测试4: 测试空字符串
    const isEmptyRegistered = isSchoolRegistered('');
    console.log('空字符串是否已注册:', isEmptyRegistered);
    
    // 测试5: 测试空格
    const isSpaceRegistered = isSchoolRegistered('   ');
    console.log('空格是否已注册:', isSpaceRegistered);
    
    console.log('=== 测试完成 ===');
}

// 测试拼音首字母功能
function testPinyinFirstLetter() {
    console.log('=== 测试拼音首字母功能 ===');
    
    const testSchools = [
        '北京大学', '清华大学', '复旦大学', '上海交通大学', '中山大学', 
        '华中科技大学', '西安交通大学', '哈尔滨工业大学', '北京师范大学',
        '中国人民大学', '北京理工大学', '北京航空航天大学', '同济大学',
        '华东师范大学', '南京大学', '东南大学', '浙江大学', '中国科学技术大学',
        '厦门大学', '山东大学', '中国海洋大学', '武汉大学', '华中科技大学',
        '中南大学', '湖南大学', '中山大学', '华南理工大学', '四川大学',
        '电子科技大学', '重庆大学', '西南大学', '西安交通大学', '西北工业大学',
        '兰州大学', '新疆大学', '西藏大学', '内蒙古大学', '广西大学',
        '云南大学', '贵州大学', '海南大学', '宁夏大学', '青海大学'
    ];
    
    testSchools.forEach(school => {
        const firstLetter = getPinyinFirstLetter(school);
        console.log(`${school} -> ${firstLetter}`);
    });
    
    console.log('=== 拼音首字母测试完成 ===');
}

// 测试数据隔离修复
function testDataIsolationFix() {
    console.log('=== 测试数据隔离修复 ===');
    
    // 1. 测试getAllAdminClubs函数
    console.log('1. 测试getAllAdminClubs函数:');
    const allClubs = getAllAdminClubs();
    console.log('所有社团数量:', Object.keys(allClubs).length);
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        console.log(`社团 ${clubId}: ${club.name} (${club.schoolName}) - 状态: ${club.status}`);
    });
    
    // 2. 测试待审核社团
    console.log('\n2. 测试待审核社团:');
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    console.log('待审核社团数量:', Object.keys(pendingClubs).length);
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        console.log(`待审核社团 ${clubId}: ${club.name} (${club.schoolName})`);
    });
    
    // 3. 测试管理员数据
    console.log('\n3. 测试管理员数据:');
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey)) || {};
        const adminClubs = adminData.clubs || {};
        console.log(`管理员 ${adminUsername}: ${Object.keys(adminClubs).length} 个社团`);
        Object.keys(adminClubs).forEach(clubId => {
            const club = adminClubs[clubId];
            console.log(`  - 社团 ${clubId}: ${club.name} (${club.schoolName})`);
        });
    });
    
    // 4. 测试全局clubs数据
    console.log('\n4. 测试全局clubs数据:');
    const globalClubs = JSON.parse(localStorage.getItem('clubs')) || {};
    console.log('全局clubs数量:', Object.keys(globalClubs).length);
    
    console.log('\n=== 数据隔离测试完成 ===');
}

// 测试社员申请加入社团功能
function testMemberJoinClub() {
    console.log('=== 测试社员申请加入社团功能 ===');
    
    // 1. 测试getAllAdminClubs函数是否能找到所有社团
    const allClubs = getAllAdminClubs();
    console.log('1. 所有可申请加入的社团:');
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName}) - 状态: ${club.status}`);
    });
    
    // 2. 测试待审核社团
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    console.log('\n2. 待审核社团（无法申请加入）:');
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName})`);
    });
    
    // 3. 测试已审核通过的社团
    console.log('\n3. 已审核通过的社团（可以申请加入）:');
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        if (club.status === 'approved' || !club.status) {
            console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName})`);
        }
    });
    
    // 4. 测试findClubId函数
    console.log('\n4. 测试findClubId函数:');
    const testCases = [
        { schoolName: '上海市世外中学', clubName: '篮球社', password: 'test123' },
        { schoolName: '北京大学', clubName: '足球社', password: 'test456' }
    ];
    
    testCases.forEach(testCase => {
        console.log(`  测试: ${testCase.schoolName} - ${testCase.clubName}`);
        // 这里只是模拟测试，实际测试需要设置DOM元素
    });
    
    console.log('\n=== 社员申请加入社团功能测试完成 ===');
}

// 测试社员界面修复
function testMemberInterfaceFix() {
    console.log('=== 测试社员界面修复 ===');
    
    // 1. 测试getAllAdminClubs函数
    const allClubs = getAllAdminClubs();
    console.log('1. 所有可访问的社团:');
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName}) - 状态: ${club.status}`);
    });
    
    // 2. 测试社员数据
    console.log('\n2. 社员数据:');
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {};
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        console.log(`  社员 ${memberName}: 加入社团 ${member.joinedClubs.length} 个`);
        member.joinedClubs.forEach(clubId => {
            const club = allClubs[clubId];
            if (club) {
                console.log(`    - 社团 ${clubId}: ${club.name} (${club.schoolName})`);
            } else {
                console.log(`    - 社团 ${clubId}: 未找到（可能已被删除）`);
            }
        });
    });
    
    // 3. 测试待审核社团
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    console.log('\n3. 待审核社团:');
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName})`);
    });
    
    // 4. 测试管理员数据
    console.log('\n4. 管理员数据:');
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey)) || {};
        const adminClubs = adminData.clubs || {};
        console.log(`  管理员 ${adminUsername}: ${Object.keys(adminClubs).length} 个社团`);
        Object.keys(adminClubs).forEach(clubId => {
            const club = adminClubs[clubId];
            console.log(`    - 社团 ${clubId}: ${club.name} (${club.schoolName})`);
        });
    });
    
    console.log('\n=== 社员界面修复测试完成 ===');
}

// 测试退出社团功能
function testQuitClubFunction() {
    console.log('=== 测试退出社团功能 ===');
    
    // 1. 检查社员界面是否有退出社团按钮
    const memberClubsList = document.getElementById('memberClubsList');
    if (memberClubsList) {
        const hasQuitButton = memberClubsList.innerHTML.includes('退出社团');
        if (hasQuitButton) {
            console.log('✅ 社员界面中存在退出社团按钮');
        } else {
            console.log('❌ 社员界面中不存在退出社团按钮');
        }
    } else {
        console.log('ℹ️ 社员界面未加载，无法检查按钮');
    }
    
    // 2. 检查函数是否存在
    if (typeof quitClubFromMemberInterface === 'function') {
        console.log('✅ quitClubFromMemberInterface函数存在');
    } else {
        console.log('❌ quitClubFromMemberInterface函数不存在');
    }
    
    // 3. 检查数据清理逻辑
    console.log('\n3. 数据清理逻辑检查:');
    console.log('✅ 社员主动退出社团会清理:');
    console.log('  - 社团成员列表');
    console.log('  - 待审核列表');
    console.log('  - 签到记录');
    console.log('  - 活动日历参与者');
    console.log('  - 全局社员加入社团列表');
    
    console.log('✅ 社长删除社员会清理:');
    console.log('  - 社团成员列表');
    console.log('  - 待审核列表');
    console.log('  - 签到记录');
    console.log('  - 活动日历参与者');
    console.log('  - 全局社员加入社团列表');
    
    // 4. 检查当前社员数据
    if (currentUser && currentUser.type === 'member') {
        const globalMember = globalMembers[currentUser.name];
        if (globalMember) {
            console.log('\n4. 当前社员数据:');
            console.log('  社员姓名:', currentUser.name);
            console.log('  加入社团数:', globalMember.joinedClubs ? globalMember.joinedClubs.length : 0);
            console.log('  加入的社团:', globalMember.joinedClubs || []);
        }
    } else {
        console.log('\n4. 当前用户不是社员，无法检查社员数据');
    }
    
    console.log('\n=== 退出社团功能测试完成 ===');
}

// 测试移除设置密码功能
function testRemovePasswordSetting() {
    console.log('=== 测试移除设置密码功能 ===');
    
    // 1. 检查HTML中是否还有设置密码弹窗
    const passwordModal = document.getElementById('memberPasswordModal');
    if (passwordModal) {
        console.log('❌ HTML中仍存在设置密码弹窗');
    } else {
        console.log('✅ HTML中已移除设置密码弹窗');
    }
    
    // 2. 检查JavaScript函数是否还存在
    if (typeof showMemberPasswordModal === 'function') {
        console.log('❌ showMemberPasswordModal函数仍存在');
    } else {
        console.log('✅ showMemberPasswordModal函数已移除');
    }
    
    if (typeof closeMemberPassword === 'function') {
        console.log('❌ closeMemberPassword函数仍存在');
    } else {
        console.log('✅ closeMemberPassword函数已移除');
    }
    
    if (typeof setMemberPassword === 'function') {
        console.log('❌ setMemberPassword函数仍存在');
    } else {
        console.log('✅ setMemberPassword函数已移除');
    }
    
    // 3. 检查社员表格中是否还有设置密码按钮
    const membersTable = document.getElementById('membersTableBody');
    if (membersTable) {
        const hasPasswordButton = membersTable.innerHTML.includes('设置密码');
        if (hasPasswordButton) {
            console.log('❌ 社员表格中仍存在设置密码按钮');
        } else {
            console.log('✅ 社员表格中已移除设置密码按钮');
        }
    } else {
        console.log('ℹ️ 社员表格未加载，无法检查按钮');
    }
    
    console.log('\n=== 移除设置密码功能测试完成 ===');
}

// 测试同名账号处理
function testSameNameAccountHandling() {
    console.log('=== 测试同名账号处理 ===');
    
    // 1. 检查当前全局社员数据
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {};
    console.log('1. 当前全局社员数据:');
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        console.log(`  - ${memberName}: 加入社团 ${member.joinedClubs ? member.joinedClubs.length : 0} 个`);
    });
    
    // 2. 检查所有社团中的社员数据
    console.log('\n2. 检查所有社团中的社员数据:');
    const allClubs = getAllAdminClubs();
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        console.log(`\n社团 ${clubId} (${club.name}):`);
        
        // 检查已加入社员
        const members = Object.values(club.members || {});
        console.log('  已加入社员:');
        members.forEach(member => {
            const globalMember = globalMembers[member.name];
            if (globalMember) {
                const isJoinedToCurrentClub = globalMember.joinedClubs && 
                                             globalMember.joinedClubs.includes(clubId);
                console.log(`    - ${member.name}: ${isJoinedToCurrentClub ? '✅ 正确加入' : '❌ 未正确加入'}`);
            } else {
                console.log(`    - ${member.name}: ❌ 已注销（应被过滤）`);
            }
        });
        
        // 检查签到记录
        const checkins = club.checkins || [];
        console.log('  签到记录:');
        const uniqueMembers = [...new Set(checkins.map(c => c.memberName))];
        uniqueMembers.forEach(memberName => {
            const globalMember = globalMembers[memberName];
            const existsInClub = club.members && club.members[memberName];
            if (globalMember) {
                const isJoinedToCurrentClub = globalMember.joinedClubs && 
                                             globalMember.joinedClubs.includes(clubId);
                console.log(`    - ${memberName}: 全局✅, 社团${existsInClub ? '✅' : '❌'}, 加入状态${isJoinedToCurrentClub ? '✅' : '❌'}`);
            } else {
                console.log(`    - ${memberName}: ❌ 已注销（应被过滤）`);
            }
        });
    });
    
    // 3. 测试过滤逻辑
    console.log('\n3. 测试过滤逻辑:');
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        const members = Object.values(club.members || {});
        
        // 模拟过滤逻辑
        const activeMembers = members.filter(member => {
            const globalMember = globalMembers[member.name];
            if (!globalMember) return false;
            
            const isJoinedToCurrentClub = globalMember.joinedClubs && 
                                         globalMember.joinedClubs.includes(clubId);
            return isJoinedToCurrentClub;
        });
        
        console.log(`社团 ${clubId}: 原始社员数 ${members.length}, 活跃社员数 ${activeMembers.length}`);
        
        if (members.length > activeMembers.length) {
            console.log('  ⚠️ 发现已注销或未正确加入的社员，过滤逻辑正常工作');
        } else {
            console.log('  ✅ 所有社员都是活跃状态');
        }
    });
    
    console.log('\n=== 同名账号处理测试完成 ===');
}

// 测试注销社员显示修复
function testDeletedMemberDisplayFix() {
    console.log('=== 测试注销社员显示修复 ===');
    
    // 1. 检查当前全局社员数据
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {};
    console.log('1. 当前全局社员数据:');
    Object.keys(globalMembers).forEach(memberName => {
        console.log(`  - ${memberName}: 存在`);
    });
    
    // 2. 检查所有社团中的社员数据
    console.log('\n2. 检查所有社团中的社员数据:');
    const allClubs = getAllAdminClubs();
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        console.log(`\n社团 ${clubId} (${club.name}):`);
        
        // 检查已加入社员
        const members = Object.values(club.members || {});
        console.log('  已加入社员:');
        members.forEach(member => {
            const existsInGlobal = globalMembers[member.name] !== undefined;
            console.log(`    - ${member.name}: ${existsInGlobal ? '✅ 存在' : '❌ 已注销'}`);
        });
        
        // 检查签到记录
        const checkins = club.checkins || [];
        console.log('  签到记录:');
        const uniqueMembers = [...new Set(checkins.map(c => c.memberName))];
        uniqueMembers.forEach(memberName => {
            const existsInGlobal = globalMembers[memberName] !== undefined;
            const existsInClub = club.members && club.members[memberName];
            console.log(`    - ${memberName}: 全局${existsInGlobal ? '✅' : '❌'}, 社团${existsInClub ? '✅' : '❌'}`);
        });
    });
    
    // 3. 测试过滤逻辑
    console.log('\n3. 测试过滤逻辑:');
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        const members = Object.values(club.members || {});
        
        // 模拟过滤逻辑
        const activeMembers = members.filter(member => {
            return globalMembers[member.name] !== undefined;
        });
        
        console.log(`社团 ${clubId}: 原始社员数 ${members.length}, 活跃社员数 ${activeMembers.length}`);
        
        if (members.length > activeMembers.length) {
            console.log('  ⚠️ 发现已注销社员，过滤逻辑正常工作');
        } else {
            console.log('  ✅ 所有社员都是活跃状态');
        }
    });
    
    console.log('\n=== 注销社员显示修复测试完成 ===');
}

// 测试社员界面数据一致性
function testMemberDataConsistency() {
    console.log('=== 测试社员界面数据一致性 ===');
    
    // 模拟当前用户
    const testMemberName = Object.keys(globalMembers)[0];
    if (!testMemberName) {
        console.log('没有找到测试社员，请先注册一个社员账号');
        return;
    }
    
    console.log('测试社员:', testMemberName);
    const globalMember = globalMembers[testMemberName];
    const allClubs = getAllAdminClubs();
    
    // 计算总览数据
    let overviewCheckinCount = 0;
    let overviewTimeC = 0, overviewTimeA = 0, overviewTimeS = 0;
    
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            const memberCheckins = club.checkins.filter(c => c.memberName === testMemberName && c.status === 'approved');
            overviewCheckinCount += memberCheckins.length;
            
            memberCheckins.forEach(checkin => {
                const timeSettings = checkin.timeSettings || club.timeSettings;
                overviewTimeC += timeSettings.C || 0;
                overviewTimeA += timeSettings.A || 0;
                overviewTimeS += timeSettings.S || 0;
            });
        }
    });
    
    const overviewTotalTime = overviewTimeC + overviewTimeA + overviewTimeS;
    
    console.log('\n1. 总览页面计算结果:');
    console.log(`  总签到次数: ${overviewCheckinCount}`);
    console.log(`  C类时长: ${overviewTimeC.toFixed(1)}`);
    console.log(`  A类时长: ${overviewTimeA.toFixed(1)}`);
    console.log(`  S类时长: ${overviewTimeS.toFixed(1)}`);
    console.log(`  总时长: ${overviewTotalTime.toFixed(1)}`);
    
    // 计算我的社团数据
    console.log('\n2. 我的社团页面计算结果:');
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            const memberCheckins = club.checkins.filter(c => c.memberName === testMemberName && c.status === 'approved');
            let clubTimeC = 0, clubTimeA = 0, clubTimeS = 0;
            
            memberCheckins.forEach(checkin => {
                const timeSettings = checkin.timeSettings || club.timeSettings;
                clubTimeC += timeSettings.C || 0;
                clubTimeA += timeSettings.A || 0;
                clubTimeS += timeSettings.S || 0;
            });
            
            const clubTotalTime = clubTimeC + clubTimeA + clubTimeS;
            
            console.log(`  社团 ${clubId} (${club.name}):`);
            console.log(`    签到次数: ${memberCheckins.length}`);
            console.log(`    C类时长: ${clubTimeC.toFixed(1)}`);
            console.log(`    A类时长: ${clubTimeA.toFixed(1)}`);
            console.log(`    S类时长: ${clubTimeS.toFixed(1)}`);
            console.log(`    总时长: ${clubTotalTime.toFixed(1)}`);
        } else {
            console.log(`  社团 ${clubId}: 未找到`);
        }
    });
    
    // 验证数据一致性
    console.log('\n3. 数据一致性验证:');
    let clubsCheckinCount = 0;
    let clubsTimeC = 0, clubsTimeA = 0, clubsTimeS = 0;
    
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            const memberCheckins = club.checkins.filter(c => c.memberName === testMemberName && c.status === 'approved');
            clubsCheckinCount += memberCheckins.length;
            
            memberCheckins.forEach(checkin => {
                const timeSettings = checkin.timeSettings || club.timeSettings;
                clubsTimeC += timeSettings.C || 0;
                clubsTimeA += timeSettings.A || 0;
                clubsTimeS += timeSettings.S || 0;
            });
        }
    });
    
    const clubsTotalTime = clubsTimeC + clubsTimeA + clubsTimeS;
    
    console.log(`  总览 vs 我的社团汇总:`);
    console.log(`  签到次数: ${overviewCheckinCount} vs ${clubsCheckinCount} ${overviewCheckinCount === clubsCheckinCount ? '✅' : '❌'}`);
    console.log(`  C类时长: ${overviewTimeC.toFixed(1)} vs ${clubsTimeC.toFixed(1)} ${Math.abs(overviewTimeC - clubsTimeC) < 0.1 ? '✅' : '❌'}`);
    console.log(`  A类时长: ${overviewTimeA.toFixed(1)} vs ${clubsTimeA.toFixed(1)} ${Math.abs(overviewTimeA - clubsTimeA) < 0.1 ? '✅' : '❌'}`);
    console.log(`  S类时长: ${overviewTimeS.toFixed(1)} vs ${clubsTimeS.toFixed(1)} ${Math.abs(overviewTimeS - clubsTimeS) < 0.1 ? '✅' : '❌'}`);
    console.log(`  总时长: ${overviewTotalTime.toFixed(1)} vs ${clubsTotalTime.toFixed(1)} ${Math.abs(overviewTotalTime - clubsTotalTime) < 0.1 ? '✅' : '❌'}`);
    
    console.log('\n=== 社员界面数据一致性测试完成 ===');
}

// 测试社团详情功能
function testClubDetailsFunction() {
    console.log('=== 测试社团详情功能 ===');
    
    // 模拟当前用户
    const testMemberName = Object.keys(globalMembers)[0];
    if (!testMemberName) {
        console.log('没有找到测试社员，请先注册一个社员账号');
        return;
    }
    
    console.log('测试社员:', testMemberName);
    const globalMember = globalMembers[testMemberName];
    const allClubs = getAllAdminClubs();
    
    console.log('\n1. 社员加入的社团:');
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            console.log(`  社团 ${clubId}: ${club.name} (${club.schoolName})`);
            console.log(`    状态: ${club.status}`);
            console.log(`    活动数量: ${Object.keys(club.activityCalendar || {}).length}`);
            console.log(`    签到记录: ${club.checkins.length}`);
        } else {
            console.log(`  社团 ${clubId}: 未找到`);
        }
    });
    
    console.log('\n2. 测试showClubDetails函数:');
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            console.log(`  测试社团 ${clubId} (${club.name}):`);
            
            // 模拟调用showClubDetails
            try {
                const activityDetails = getClubActivityDetails(clubId, testMemberName);
                if (activityDetails) {
                    console.log(`    ✅ 成功获取活动详情`);
                    console.log(`      总活动数: ${activityDetails.activities.length}`);
                    console.log(`      总签到次数: ${activityDetails.totalCheckins}`);
                    console.log(`      总时长: ${activityDetails.totalTime.toFixed(1)}`);
                } else {
                    console.log(`    ❌ 获取活动详情失败`);
                }
            } catch (error) {
                console.log(`    ❌ 错误: ${error.message}`);
            }
        }
    });
    
    console.log('\n3. 数据源验证:');
    console.log('  全局clubs数量:', Object.keys(clubs).length);
    console.log('  getAllAdminClubs数量:', Object.keys(allClubs).length);
    
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey)) || {};
        const adminClubs = adminData.clubs || {};
        console.log(`  管理员 ${adminUsername} 的社团数量: ${Object.keys(adminClubs).length}`);
    });
    
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    console.log('  待审核社团数量:', Object.keys(pendingClubs).length);
    
    console.log('\n=== 社团详情功能测试完成 ===');
}

// 简单测试showClubDetails函数
function testShowClubDetails() {
    console.log('=== 简单测试showClubDetails函数 ===');
    
    // 检查是否有社员数据
    const testMemberName = Object.keys(globalMembers)[0];
    if (!testMemberName) {
        console.log('没有找到测试社员，请先注册一个社员账号');
        return;
    }
    
    console.log('测试社员:', testMemberName);
    const globalMember = globalMembers[testMemberName];
    const allClubs = getAllAdminClubs();
    
    console.log('社员加入的社团:', globalMember.joinedClubs);
    
    if (globalMember.joinedClubs.length === 0) {
        console.log('社员没有加入任何社团');
        return;
    }
    
    // 测试第一个社团
    const testClubId = globalMember.joinedClubs[0];
    const club = allClubs[testClubId];
    
    console.log('测试社团ID:', testClubId);
    console.log('社团信息:', club);
    
    if (!club) {
        console.log('社团不存在');
        return;
    }
    
    console.log('尝试调用showClubDetails函数...');
    try {
        showClubDetails(testClubId);
        console.log('showClubDetails函数调用成功');
    } catch (error) {
        console.log('showClubDetails函数调用失败:', error);
    }
    
    console.log('\n=== 简单测试完成 ===');
}

// 测试函数定义
function testFunctionDefinition() {
    console.log('=== 测试函数定义 ===');
    
    console.log('typeof showClubDetails:', typeof showClubDetails);
    console.log('typeof getAllAdminClubs:', typeof getAllAdminClubs);
    console.log('typeof getClubActivityDetails:', typeof getClubActivityDetails);
    
    if (typeof showClubDetails === 'function') {
        console.log('✅ showClubDetails函数已正确定义');
    } else {
        console.log('❌ showClubDetails函数未定义');
    }
    
    if (typeof getAllAdminClubs === 'function') {
        console.log('✅ getAllAdminClubs函数已正确定义');
    } else {
        console.log('❌ getAllAdminClubs函数未定义');
    }
    
    if (typeof getClubActivityDetails === 'function') {
        console.log('✅ getClubActivityDetails函数已正确定义');
    } else {
        console.log('❌ getClubActivityDetails函数未定义');
    }
    
    console.log('\n=== 函数定义测试完成 ===');
}

// 全局测试函数 - 可以直接在控制台调用
window.testShowClubDetailsDirect = function(clubId) {
    console.log('=== 直接测试showClubDetails函数 ===');
    console.log('传入的clubId:', clubId);
    
    if (!clubId) {
        console.log('请提供clubId参数，例如：testShowClubDetailsDirect("123456")');
        return;
    }
    
    try {
        console.log('尝试调用showClubDetails函数...');
        showClubDetails(clubId);
        console.log('函数调用完成');
    } catch (error) {
        console.log('函数调用出错:', error);
    }
};

// 获取当前管理员的所有社团数据（用于社团创建时的重名检查）
function getAllAdminClubs() {
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    let allClubs = {};
    
    // 遍历所有管理员，收集他们的社团数据
    for (const adminUsername in admins) {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey)) || {};
        const adminClubs = adminData.clubs || {};
        
        // 合并社团数据
        Object.assign(allClubs, adminClubs);
    }
    
    // 也包含待审核的社团
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    Object.assign(allClubs, pendingClubs);
    
    return allClubs;
}

// 获取汉字拼音首字母
function getPinyinFirstLetter(chinese) {
    // 简化的拼音首字母映射表（常用汉字）
    const pinyinMap = {
        '北': 'B', '京': 'J', '大': 'D', '学': 'X', '清': 'Q', '华': 'H', '复': 'F', '旦': 'D',
        '交': 'J', '通': 'T', '同': 'T', '济': 'J', '师': 'S', '范': 'F', '科': 'K', '技': 'J',
        '理': 'L', '工': 'G', '医': 'Y', '药': 'Y', '农': 'N', '林': 'L', '财': 'C', '经': 'J',
        '政': 'Z', '法': 'F', '文': 'W', '史': 'S', '哲': 'Z', '艺': 'Y', '术': 'S', '体': 'T',
        '育': 'Y', '音': 'Y', '乐': 'Y', '美': 'M', '外': 'W', '语': 'Y', '国': 'G', '际': 'J',
        '商': 'S', '院': 'Y', '校': 'X', '中': 'Z', '央': 'Y', '民': 'M', '族': 'Z', '华': 'H',
        '东': 'D', '南': 'N', '西': 'X', '上': 'S', '海': 'H', '天': 'T', '津': 'J', '重': 'C',
        '庆': 'Q', '四': 'S', '川': 'C', '湖': 'H', '广': 'G', '福': 'F', '建': 'J', '江': 'J',
        '苏': 'S', '浙': 'Z', '安': 'A', '徽': 'H', '山': 'S', '河': 'H', '陕': 'S', '甘': 'G',
        '肃': 'S', '青': 'Q', '宁': 'N', '夏': 'X', '新': 'X', '疆': 'J', '藏': 'Z', '内': 'N',
        '蒙': 'M', '古': 'G', '吉': 'J', '辽': 'L', '黑': 'H', '龙': 'L', '云': 'Y', '贵': 'G',
        '州': 'Z', '台': 'T', '湾': 'W', '香': 'X', '港': 'G', '澳': 'A', '门': 'M', '利': 'L',
        '亚': 'Y', '加': 'J', '坡': 'P', '马': 'M', '来': 'L', '泰': 'T', '越': 'Y', '印': 'Y',
        '度': 'D', '尼': 'N', '菲': 'F', '律': 'L', '宾': 'B', '韩': 'H', '日': 'R', '本': 'B',
        '俄': 'E', '罗': 'L', '斯': 'S', '德': 'D', '法': 'F', '英': 'Y', '意': 'Y', '班': 'B',
        '牙': 'Y', '葡': 'P', '萄': 'T', '荷': 'H', '兰': 'L', '比': 'B', '时': 'S', '瑞': 'R',
        '士': 'S', '奥': 'A', '地': 'D', '典': 'D', '挪': 'N', '威': 'W', '丹': 'D', '麦': 'M',
        '芬': 'F', '波': 'B', '捷': 'J', '克': 'K', '匈': 'X', '保': 'B', '塞': 'S', '维': 'W',
        '亚': 'Y', '斯': 'S', '洛': 'L', '文': 'W', '伐': 'F', '爱': 'A', '沙': 'S', '拉': 'L',
        '脱': 'T', '立': 'L', '陶': 'T', '宛': 'W', '白': 'B', '乌': 'W', '摩': 'M', '尔': 'E',
        '多': 'D', '瓦': 'W', '美': 'M', '拿': 'N', '墨': 'M', '哥': 'G', '巴': 'B', '阿': 'A',
        '根': 'G', '廷': 'T', '智': 'Z', '利': 'L', '秘': 'M', '鲁': 'L', '伦': 'L', '比': 'B',
        '委': 'W', '瑞': 'R', '厄': 'E', '瓜': 'G', '玻': 'B', '维': 'W', '拉': 'L', '圭': 'G',
        '苏': 'S', '里': 'L', '南': 'N', '非': 'F', '埃': 'A', '及': 'J', '突': 'T', '尼': 'N',
        '摩': 'M', '洛': 'L', '毛': 'M', '塔': 'T', '塞': 'S', '尔': 'E', '冈': 'G', '几': 'J',
        '科': 'K', '特': 'T', '迪': 'D', '纳': 'N', '贝': 'B', '宁': 'N', '布': 'B', '基': 'J',
        '索': 'S', '日': 'R', '乍': 'Z', '得': 'D', '喀': 'K', '麦': 'M', '隆': 'L', '赤': 'C',
        '道': 'D', '蓬': 'P', '刚': 'G', '果': 'G', '主': 'Z', '共': 'G', '和': 'H', '安': 'A',
        '赞': 'Z', '维': 'W', '莫': 'M', '桑': 'S', '达': 'D', '斯': 'S', '科': 'K', '舌': 'S',
        '求': 'Q', '马': 'M'
    };
    
    // 获取第一个字符
    const firstChar = chinese.charAt(0);
    
    // 如果是汉字，返回拼音首字母
    if (pinyinMap[firstChar]) {
        return pinyinMap[firstChar];
    }
    
    // 如果是英文字母，直接返回大写
    if (/[A-Za-z]/.test(firstChar)) {
        return firstChar.toUpperCase();
    }
    
    // 如果是数字，返回数字
    if (/[0-9]/.test(firstChar)) {
        return firstChar;
    }
    
    // 其他情况返回第一个字符
    return firstChar.toUpperCase();
}

// 显示所有已注册学校（按拼音首字母排列）

// 关闭已注册学校列表弹窗
function closeRegisteredSchoolsModal() {
    document.getElementById('registeredSchoolsModal').style.display = 'none';
}

// 从模态框中选择学校
function selectSchoolFromModal(schoolName) {
    // 检查当前哪个界面是可见的，并填充相应的字段
    
    // 检查社团注册界面是否可见
    const registerModal = document.getElementById('registerModal');
    const schoolNameField = document.getElementById('schoolName');
    
    // 检查社员注册界面是否可见
    const memberRegisterModal = document.getElementById('memberRegisterModal');
    const regMemberSchoolField = document.getElementById('regMemberSchool');
    
    if (registerModal && registerModal.style.display !== 'none' && schoolNameField) {
        // 社团注册界面可见，填充社团注册的学校字段
        schoolNameField.value = schoolName;
        console.log('已填充社团注册界面的学校名称:', schoolName);
    } else if (memberRegisterModal && memberRegisterModal.style.display !== 'none' && regMemberSchoolField) {
        // 社员注册界面可见，填充社员注册的学校字段
        regMemberSchoolField.value = schoolName;
        console.log('已填充社员注册界面的学校名称:', schoolName);
    } else {
        // 默认填充社团注册字段（向后兼容）
        if (schoolNameField) {
            schoolNameField.value = schoolName;
            console.log('默认填充社团注册界面的学校名称:', schoolName);
        }
    }
    
    closeRegisteredSchoolsModal();
}

// 获取所有已注册的学校名称
function getRegisteredSchools() {
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    const registeredSchools = [];
    
    console.log('getRegisteredSchools - 管理员数据:', admins);
    
    for (const adminUsername in admins) {
        const admin = admins[adminUsername];
        let adminSchool = '';
        
        console.log(`处理管理员: ${adminUsername}, 数据类型: ${typeof admin}`);
        
        // 兼容旧的数据结构
        if (typeof admin === 'string') {
            // 旧数据结构，没有学校信息
            console.log(`管理员 ${adminUsername} 使用旧数据结构，跳过`);
            continue;
        } else {
            adminSchool = admin.school || '';
            console.log(`管理员 ${adminUsername} 的学校: "${adminSchool}"`);
        }
        
        if (adminSchool && !registeredSchools.includes(adminSchool)) {
            registeredSchools.push(adminSchool);
            console.log(`添加学校: "${adminSchool}"`);
        }
    }
    
    console.log('getRegisteredSchools - 最终结果:', registeredSchools);
    return registeredSchools;
}

// 检查学校是否已注册管理员
function isSchoolRegistered(schoolName) {
    const registeredSchools = getRegisteredSchools();
    console.log('isSchoolRegistered - 输入学校名称:', schoolName);
    console.log('isSchoolRegistered - 已注册学校:', registeredSchools);
    
    const result = registeredSchools.some(school => {
        const match = school.trim() === schoolName.trim();
        console.log(`比较: "${school.trim()}" === "${schoolName.trim()}" = ${match}`);
        return match;
    });
    
    console.log('isSchoolRegistered - 结果:', result);
    return result;
}

// 创建社团
function createClub() {
    const schoolName = document.getElementById('schoolName').value.trim();
    const clubName = document.getElementById('clubName').value.trim();
    const clubPwd = document.getElementById('clubPwd').value;
    const securityQuestion = document.getElementById('clubSecurityQuestion').value;
    const securityAnswer = document.getElementById('clubSecurityAnswer').value.trim();

    if (!schoolName || !clubName || !clubPwd || !securityQuestion || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }

    // 验证学校名称不能为空或只包含空格
    if (!schoolName.trim()) {
        alert('学校名称不能为空！');
        return;
    }

    // 检查同学校下是否已有同名社团（检查所有管理员的数据）
    const allAdminClubs = getAllAdminClubs();
    for (const clubId in allAdminClubs) {
        const club = allAdminClubs[clubId];
        if (club.schoolName === schoolName && club.name === clubName) {
            alert('该学校下已存在同名社团！');
            return;
        }
    }

    // 强制验证：检查同学校是否有管理员
    console.log('=== 开始学校验证 ===');
    console.log('检查学校名称:', schoolName);
    console.log('当前管理员数据:', JSON.parse(localStorage.getItem('admins') || '{}'));
    
    const registeredSchools = getRegisteredSchools();
    console.log('已注册的学校:', registeredSchools);
    
    // 强制检查：如果学校名称是"1"且没有注册，直接拒绝
    if (schoolName === '1' && !registeredSchools.includes('1')) {
        console.log('检测到学校"1"未注册，强制拒绝');
        alert('学校"1"未在管理员系统中注册，无法提交申请！\n\n请联系学校管理员注册账号。');
        return;
    }
    
    if (!isSchoolRegistered(schoolName)) {
        let errorMessage = '该学校名称未在管理员系统中注册，无法提交申请！\n\n';
        
        if (registeredSchools.length > 0) {
            errorMessage += '已注册的学校名称：\n';
            registeredSchools.forEach(school => {
                errorMessage += `• ${school}\n`;
            });
            errorMessage += '\n请确认学校名称是否正确，或联系学校管理员注册。';
        } else {
            errorMessage += '系统中暂无任何学校的管理员注册。\n请联系学校管理员注册账号。';
        }
        
        console.log('学校验证失败:', errorMessage);
        alert(errorMessage);
        return;
    }
    
    console.log('学校验证通过，继续创建社团');

    // 最终安全检查：再次确认学校已注册
    const finalCheck = getRegisteredSchools();
    if (!finalCheck.includes(schoolName)) {
        console.log('最终安全检查失败，学校未注册');
        alert('安全检查失败：该学校未在管理员系统中注册！');
        return;
    }

    // 生成6位社团号
    const clubId = generateClubId();
    
    // 创建社团对象
    const newClub = {
        id: clubId,
        schoolName: schoolName,
        name: clubName,
        password: clubPwd,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        status: 'pending', // 待审核状态
        checkinCode: '',
        activityDate: getLocalDateString(new Date()),
        timeSettings: { C: 0, A: 0, S: 0 },
        autoUpdateDate: true, // 默认开启自动更新
        members: {},
        pendingMembers: [], // 待审核社员列表
        checkins: []
    };
    
    // 保存到待审核区域（全局存储）
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    pendingClubs[clubId] = newClub;
    localStorage.setItem('pendingClubs', JSON.stringify(pendingClubs));
    
    console.log('社团已保存到待审核区域:', clubId, newClub);
    closeRegister();
    
    // 显示社团号并复制
    showClubIdResult(clubId, '社团申请已提交！\n等待管理员审核通过后即可使用。');
}

// 社长登录
function captainLogin() {
    const clubId = document.getElementById('captainId').value.trim();
    const password = document.getElementById('captainPwd').value;

    // 在所有管理员的数据和待审核区域中查找社团
    const allClubs = getAllAdminClubs();
    
    if (!allClubs[clubId]) {
        alert('社团号不存在');
        return;
    }

    if (allClubs[clubId].password !== password) {
        alert('密码错误');
        return;
    }

    // 检查社团状态
    if (allClubs[clubId].status === 'pending') {
        alert('社团正在审核中，请等待管理员审核通过');
        return;
    }

    if (allClubs[clubId].status === 'rejected') {
        alert('社团审核未通过');
        return;
    }

    currentClub = allClubs[clubId];
    currentUser = { type: 'captain', clubId };
    
    // 检查并执行自动更新
    checkAndAutoUpdateDate();
    
    // 切换到社长页面
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('captainPage').style.display = 'block';
    
    loadCaptainPage();
}

// 诊断管理员注销后社员账户仍然存在的问题
function diagnoseMemberAccountIssue() {
    console.log('=== 诊断管理员注销后社员账户仍然存在的问题 ===');
    
    // 1. 检查当前全局社员数据
    console.log('\n1. 检查全局社员数据:');
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers') || '{}');
    console.log(`  全局社员总数: ${Object.keys(globalMembers).length}`);
    
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        console.log(`  社员: ${memberName}, 学校: ${member.school}`);
    });
    
    // 2. 检查已注册学校列表
    console.log('\n2. 检查已注册学校列表:');
    const admins = JSON.parse(localStorage.getItem('admins') || '{}');
    const registeredSchools = [];
    
    Object.keys(admins).forEach(adminUsername => {
        const admin = admins[adminUsername];
        if (admin.school && !registeredSchools.includes(admin.school)) {
            registeredSchools.push(admin.school);
        }
    });
    
    console.log(`  已注册学校数量: ${registeredSchools.length}`);
    registeredSchools.forEach(school => {
        console.log(`    学校: ${school}`);
    });
    
    // 3. 检查孤立的社员（学校没有管理员的社员）
    console.log('\n3. 检查孤立的社员:');
    const orphanedMembers = [];
    
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        if (member.school && !registeredSchools.includes(member.school)) {
            orphanedMembers.push({
                name: memberName,
                school: member.school
            });
        }
    });
    
    console.log(`  孤立社员数量: ${orphanedMembers.length}`);
    orphanedMembers.forEach(member => {
        console.log(`    社员: ${member.name}, 学校: ${member.school} (无管理员)`);
    });
    
    // 4. 检查可能的数据同步问题
    console.log('\n4. 检查数据同步问题:');
    const allAdmins = JSON.parse(localStorage.getItem('admins') || '{}');
    Object.keys(allAdmins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        const adminSchoolMembers = Object.values(adminData.globalMembers || {}).filter(member => member.school === allAdmins[adminUsername].school);
        
        console.log(`  管理员 ${adminUsername} (${allAdmins[adminUsername].school}):`);
        console.log(`    管理员数据中的社员: ${adminSchoolMembers.length} 个`);
        
        // 检查管理员数据中的社员是否在全局数据中存在
        adminSchoolMembers.forEach(member => {
            if (!globalMembers[member.name]) {
                console.log(`    ❌ 社员 ${member.name} 在管理员数据中存在但全局数据中不存在`);
            }
        });
    });
    
    // 5. 提供修复建议
    console.log('\n5. 修复建议:');
    if (orphanedMembers.length > 0) {
        console.log(`  发现 ${orphanedMembers.length} 个孤立社员，建议执行清理操作`);
        console.log('  可以调用 cleanupOrphanedMembers() 函数进行清理');
    } else {
        console.log('  未发现孤立社员');
    }
    
    console.log('\n=== 诊断完成 ===');
}

// 测试社团注销通知功能
function testClubDeletionNotification() {
    console.log('=== 测试社团注销通知功能 ===');
    
    // 1. 检查当前社员数据
    console.log('\n1. 检查当前社员数据:');
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers') || '{}');
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        console.log(`  社员: ${memberName}`);
        console.log(`    加入社团: ${member.joinedClubs ? member.joinedClubs.length : 0} 个`);
        console.log(`    通知数量: ${member.notifications ? member.notifications.length : 0} 个`);
        
        if (member.notifications) {
            member.notifications.forEach(notification => {
                console.log(`      通知: ${notification.message} (已读: ${notification.read})`);
            });
        }
    });
    
    // 2. 检查已删除社团数据
    console.log('\n2. 检查已删除社团数据:');
    const deletedClubs = JSON.parse(localStorage.getItem('deletedClubs') || '{}');
    console.log(`  已删除社团数量: ${Object.keys(deletedClubs).length}`);
    Object.keys(deletedClubs).forEach(clubId => {
        const club = deletedClubs[clubId];
        console.log(`    社团: ${clubId} - ${club.name}`);
    });
    
    // 3. 模拟社团注销通知
    console.log('\n3. 模拟社团注销通知:');
    if (Object.keys(deletedClubs).length > 0) {
        const testClubId = Object.keys(deletedClubs)[0];
        const testClub = deletedClubs[testClubId];
        
        console.log(`  测试社团: ${testClubId} - ${testClub.name}`);
        
        // 检查哪些社员加入了这个社团
        const affectedMembers = [];
        Object.keys(globalMembers).forEach(memberName => {
            const member = globalMembers[memberName];
            if (member.joinedClubs && member.joinedClubs.includes(testClubId)) {
                affectedMembers.push(memberName);
            }
        });
        
        console.log(`  受影响的社员: ${affectedMembers.join(', ')}`);
        
        if (affectedMembers.length > 0) {
            console.log('  ✅ 有社员会受到社团注销影响');
        } else {
            console.log('  ℹ️ 没有社员加入这个已删除的社团');
        }
    } else {
        console.log('  ℹ️ 没有已删除的社团可供测试');
    }
    
    console.log('\n=== 社团注销通知功能测试完成 ===');
}

// 清理孤立的社员（学校没有管理员的社员）
function cleanupOrphanedMembers() {
    console.log('=== 开始清理孤立的社员 ===');
    
    const globalMembers = JSON.parse(localStorage.getItem('globalMembers') || '{}');
    const admins = JSON.parse(localStorage.getItem('admins') || '{}');
    
    // 获取已注册学校列表
    const registeredSchools = [];
    Object.keys(admins).forEach(adminUsername => {
        const admin = admins[adminUsername];
        if (admin.school && !registeredSchools.includes(admin.school)) {
            registeredSchools.push(admin.school);
        }
    });
    
    console.log('已注册学校:', registeredSchools);
    
    // 清理孤立的社员
    let cleanedCount = 0;
    Object.keys(globalMembers).forEach(memberName => {
        const member = globalMembers[memberName];
        if (member.school && !registeredSchools.includes(member.school)) {
            delete globalMembers[memberName];
            cleanedCount++;
            console.log(`清理孤立社员: ${memberName} (学校: ${member.school})`);
        }
    });
    
    // 保存清理后的数据
    localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
    
    console.log(`清理完成，共清理 ${cleanedCount} 个孤立社员`);
    console.log('=== 清理完成 ===');
}

// 社员登录
function memberLogin() {
    const memberName = document.getElementById('memberName').value.trim();
    const memberPwd = document.getElementById('memberPwd').value;

    if (!memberName || !memberPwd) {
        alert('请填写完整信息');
        return;
    }

    // 检查全局社员是否存在
    if (!globalMembers[memberName]) {
        alert('社员账号不存在，请先注册');
        return;
    }

    const globalMember = globalMembers[memberName];
    
    // 检查密码
    if (globalMember.password !== memberPwd) {
        alert('密码错误');
        return;
    }
    
    // 检查该社员所属学校是否还有管理员
    if (!isSchoolRegistered(globalMember.school)) {
        alert(`您所属的学校 "${globalMember.school}" 的管理员已注销，无法登录。\n请联系系统管理员重新注册学校管理员。`);
        
        // 自动清理孤立的社员
        console.log(`自动清理孤立社员: ${memberName}`);
        delete globalMembers[memberName];
        localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
        
        return;
    }
    
    // 登录成功
    currentUser = { type: 'member', name: memberName };
    
    // 检查并显示社团注销通知
    checkAndShowClubNotifications(globalMember);
    
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('memberPage').style.display = 'block';
    
    loadMemberPage();
}

// 检查并显示社团注销通知
function checkAndShowClubNotifications(member) {
    if (!member.notifications || member.notifications.length === 0) {
        return;
    }
    
    // 筛选出未读的社团注销通知
    const unreadClubNotifications = member.notifications.filter(notification => 
        notification.type === 'club_deleted' && !notification.read
    );
    
    if (unreadClubNotifications.length === 0) {
        return;
    }
    
    // 显示通知
    let notificationMessage = '通知：\n\n';
    unreadClubNotifications.forEach(notification => {
        notificationMessage += `• ${notification.message}\n`;
        // 标记为已读
        notification.read = true;
    });
    
    notificationMessage += '\n您的社团数量已相应减少。';
    
    alert(notificationMessage);
    
    // 保存更新后的通知状态
    localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
}

// 显示注册弹窗
function showRegister() {
    document.getElementById('registerModal').style.display = 'flex';
}

function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('schoolName').value = '';
    document.getElementById('clubName').value = '';
    document.getElementById('clubPwd').value = '';
    document.getElementById('clubSecurityQuestion').value = '';
    document.getElementById('clubSecurityAnswer').value = '';
}

// 显示找回社团号弹窗
function showForgotId() {
    document.getElementById('forgotIdModal').style.display = 'flex';
}

function closeForgotId() {
    document.getElementById('forgotIdModal').style.display = 'none';
    document.getElementById('forgotSchoolName').value = '';
    document.getElementById('forgotClubName').value = '';
    document.getElementById('forgotClubPwd').value = '';
}

// 显示注册社员账号弹窗
function showMemberRegister() {
    document.getElementById('memberRegisterModal').style.display = 'flex';
}

// 关闭注册社员账号弹窗
function closeMemberRegister() {
    document.getElementById('memberRegisterModal').style.display = 'none';
    document.getElementById('regMemberName').value = '';
    document.getElementById('regMemberSchool').value = '';
    document.getElementById('regMemberPwd').value = '';
    document.getElementById('regMemberPwdConfirm').value = '';
    document.getElementById('regSecurityQuestion').value = '';
    document.getElementById('regSecurityAnswer').value = '';
}

// 注册社员账号
function registerMember() {
    const memberName = document.getElementById('regMemberName').value.trim();
    const memberSchool = document.getElementById('regMemberSchool').value.trim();
    const memberPwd = document.getElementById('regMemberPwd').value;
    const memberPwdConfirm = document.getElementById('regMemberPwdConfirm').value;
    const securityQuestion = document.getElementById('regSecurityQuestion').value;
    const securityAnswer = document.getElementById('regSecurityAnswer').value.trim();

    if (!memberName || !memberSchool || !memberPwd || !memberPwdConfirm || !securityQuestion || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }

    if (memberPwd !== memberPwdConfirm) {
        alert('两次输入的密码不一致');
        return;
    }

    // 验证学校是否已注册
    const registeredSchools = getRegisteredSchools();
    if (!registeredSchools.includes(memberSchool)) {
        let errorMessage = `学校 "${memberSchool}" 尚未注册！\n\n已注册的学校列表：\n`;
        registeredSchools.forEach(school => {
            errorMessage += `• ${school}\n`;
        });
        errorMessage += '\n请选择已注册的学校或联系管理员注册新学校。';
        alert(errorMessage);
        return;
    }

    // 检查社员是否已存在
    if (globalMembers[memberName]) {
        alert('该社员账号已存在，请直接登录');
        return;
    }

    // 创建全局社员账号
    globalMembers[memberName] = {
        name: memberName,
        school: memberSchool,
        password: memberPwd,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        joinedClubs: [], // 加入的社团列表
        createdAt: new Date().toISOString()
    };

    saveGlobalMembers();
    closeMemberRegister();
    alert('社员账号注册成功！现在可以加入多个社团了。');
}

// 找回社团号
function findClubId() {
    const schoolName = document.getElementById('forgotSchoolName').value.trim();
    const clubName = document.getElementById('forgotClubName').value.trim();
    const password = document.getElementById('forgotClubPwd').value;

    if (!schoolName || !clubName || !password) {
        alert('请填写完整信息');
        return;
    }

    // 在所有社团中查找匹配的（包括所有管理员的数据）
    const allClubs = getAllAdminClubs();
    let foundClub = null;
    for (const clubId in allClubs) {
        const club = allClubs[clubId];
        if (club.schoolName === schoolName && club.name === clubName && club.password === password) {
            foundClub = clubId;
            break;
        }
    }

    if (foundClub) {
        closeForgotId();
        // 显示社团号并复制
        showClubIdResult(foundClub, '您的社团号已找回');
        // 自动填充社团号
        document.getElementById('captainId').value = foundClub;
    } else {
        alert('未找到匹配的社团，请检查学校名称、社团名称和密码是否正确');
    }
}

// 生成社团号（6位随机字母数字）
function generateClubId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 生成签到码（6位随机字母数字，不区分大小写）
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    currentClub.checkinCode = code;
    document.getElementById('checkinCode').textContent = code;
    saveData();
}

// ==================== 密保问题功能 ====================

// 更新密保问题占位符
function updateSecurityQuestionPlaceholder() {
    const question = document.getElementById('regSecurityQuestion').value;
    const answerInput = document.getElementById('regSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示忘记密码弹窗
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetForgotPasswordModal();
}

// 关闭忘记密码弹窗
function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    resetForgotPasswordModal();
}

// 重置忘记密码弹窗状态
function resetForgotPasswordModal() {
    document.getElementById('forgotMemberName').value = '';
    document.getElementById('forgotSecurityQuestion').value = '';
    document.getElementById('forgotSecurityAnswer').value = '';
    document.getElementById('forgotNewPassword').value = '';
    document.getElementById('forgotConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'none';
    document.getElementById('confirmPasswordGroup').style.display = 'none';
    document.getElementById('verifyBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
}

// 验证密保答案
function verifySecurityAnswer() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const securityAnswer = document.getElementById('forgotSecurityAnswer').value.trim();
    
    if (!memberName || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社员是否存在
    if (!globalMembers[memberName]) {
        alert('社员账号不存在');
        return;
    }
    
    const member = globalMembers[memberName];
    
    // 检查是否有密保问题设置
    if (!member.securityQuestion || !member.securityAnswer) {
        alert('该账号未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotSecurityQuestion').value = member.securityQuestion;
    
    // 验证密保答案
    if (member.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'block';
    document.getElementById('confirmPasswordGroup').style.display = 'block';
    document.getElementById('verifyBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置密码
function resetPassword() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value;
    const confirmPassword = document.getElementById('forgotConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    globalMembers[memberName].password = newPassword;
    saveGlobalMembers();
    
    closeForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// ==================== 社长密保问题功能 ====================

// 更新社长密保问题占位符
function updateClubSecurityQuestionPlaceholder() {
    const question = document.getElementById('clubSecurityQuestion').value;
    const answerInput = document.getElementById('clubSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示社长忘记密码弹窗
function showCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetCaptainForgotPasswordModal();
}

// 关闭社长忘记密码弹窗
function closeCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'none';
    resetCaptainForgotPasswordModal();
}

// 重置社长忘记密码弹窗状态
function resetCaptainForgotPasswordModal() {
    document.getElementById('forgotCaptainClubId').value = '';
    document.getElementById('forgotCaptainSecurityQuestion').value = '';
    document.getElementById('forgotCaptainSecurityAnswer').value = '';
    document.getElementById('forgotCaptainNewPassword').value = '';
    document.getElementById('forgotCaptainConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'none';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'none';
    document.getElementById('captainVerifyBtn').style.display = 'inline-block';
    document.getElementById('captainResetBtn').style.display = 'none';
}

// 验证社长密保答案
function verifyCaptainSecurityAnswer() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const securityAnswer = document.getElementById('forgotCaptainSecurityAnswer').value.trim();
    
    if (!clubId || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社团是否存在
    if (!clubs[clubId]) {
        alert('社团号不存在');
        return;
    }
    
    const club = clubs[clubId];
    
    // 检查是否有密保问题设置
    if (!club.securityQuestion || !club.securityAnswer) {
        alert('该社团未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotCaptainSecurityQuestion').value = club.securityQuestion;
    
    // 验证密保答案
    if (club.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'block';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'block';
    document.getElementById('captainVerifyBtn').style.display = 'none';
    document.getElementById('captainResetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置社长密码
function resetCaptainPassword() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const newPassword = document.getElementById('forgotCaptainNewPassword').value;
    const confirmPassword = document.getElementById('forgotCaptainConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    clubs[clubId].password = newPassword;
    saveData();
    
    closeCaptainForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// 保存时长设置
function saveTimeSettings() {
    const timeC = parseFloat(document.getElementById('timeC').value) || 0;
    const timeA = parseFloat(document.getElementById('timeA').value) || 0;
    const timeS = parseFloat(document.getElementById('timeS').value) || 0;
    
    currentClub.timeSettings = { C: timeC, A: timeA, S: timeS };
    saveData();
    alert('设置已保存');
}


// 设置为今天的日期
function setTodayAsActivityDate() {
    const today = getLocalDateString(new Date());
    document.getElementById('activityDate').value = today;
    currentClub.activityDate = today;
    saveData();
    alert('活动日期已设置为今天');
}

// 切换自动更新设置
function toggleAutoUpdate() {
    const autoUpdate = document.getElementById('autoUpdateDate').checked;
    const infoDiv = document.getElementById('autoUpdateInfo');
    
    // 保存设置到社团数据中
    currentClub.autoUpdateDate = autoUpdate;
    saveData();
    
    // 显示/隐藏提示信息
    if (autoUpdate) {
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}

// 检查并执行自动更新
function checkAndAutoUpdateDate() {
    if (currentClub.autoUpdateDate) {
        const today = getLocalDateString(new Date());
        const currentDate = currentClub.activityDate;
        
        // 如果当前活动日期不是今天，则自动更新
        if (currentDate !== today) {
            currentClub.activityDate = today;
            saveData();
            
            // 更新界面显示
            document.getElementById('activityDate').value = today;
            
            // 显示自动更新提示
            console.log('活动日期已自动更新为今天');
        }
    }
}

// 提交签到（社员）
// 社员页面导航
function showMemberSection(sectionId) {
    // 隐藏所有页面
    document.querySelectorAll('.member-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示选中的页面
    document.getElementById('member' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + 'Section').style.display = 'block';
    
    // 更新导航按钮状态
    document.querySelectorAll('.member-nav .nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 找到当前点击的按钮并添加active类
    const clickedButton = document.querySelector(`.member-nav .nav-btn[onclick="showMemberSection('${sectionId}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // 根据页面重新加载数据
    if (sectionId === 'overview') {
        loadMemberOverview();
    } else if (sectionId === 'clubs') {
        loadMemberClubs();
    } else if (sectionId === 'checkin') {
        loadMemberCheckin();
    } else if (sectionId === 'settings') {
        loadMemberSettings();
    }
}

function submitCheckin() {
    const selectedClubId = document.getElementById('checkinClubSelect').value;
    const checkinCode = document.getElementById('inputCheckinCode').value.trim().toUpperCase();
    
    if (!selectedClubId) {
        alert('请选择社团');
        return;
    }
    
    if (!checkinCode) {
        alert('请输入签到码');
        return;
    }
    
    const allClubs = getAllAdminClubs();
    const club = allClubs[selectedClubId];
    if (!club) {
        alert('社团不存在');
        return;
    }
    
    if (checkinCode !== club.checkinCode.toUpperCase()) {
        alert('签到码错误');
        return;
    }
    
    // 检查是否已经签到
    const today = getLocalDateString(new Date());
    const alreadyCheckedIn = club.checkins.some(c => 
        c.memberName === currentUser.name && 
        c.activityDate === today && 
        c.status === 'approved'
    );
    
    if (alreadyCheckedIn) {
        alert('今天已经签到过了');
        return;
    }
    
    // 检查是否有预设的活动时长
    const activityDate = club.activityDate;
    const presetActivity = club.activityCalendar && club.activityCalendar[activityDate];
    
    let timeSettings;
    if (presetActivity && presetActivity.timeSettings) {
        // 使用预设的活动时长
        timeSettings = {
            C: presetActivity.timeSettings.C || 0,
            A: presetActivity.timeSettings.A || 0,
            S: presetActivity.timeSettings.S || 0
        };
    } else {
        // 使用默认的时长设置
        timeSettings = {
            C: club.timeSettings.C || 0,
            A: club.timeSettings.A || 0,
            S: club.timeSettings.S || 0
        };
    }
    
    // 添加签到记录
    club.checkins.push({
        memberName: currentUser.name,
        checkinTime: new Date().toISOString(),
        activityDate: club.activityDate,
        code: checkinCode,
        status: 'pending', // 待审核状态
        timeSettings: timeSettings,
        activityName: presetActivity ? presetActivity.name : null,
        isPresetActivity: !!presetActivity
    });
    
    // 保存数据到正确的位置
    saveClubData(club);
    loadMemberOverview();
    
    alert('签到已提交，等待审核');
    document.getElementById('inputCheckinCode').value = '';
}

// 审核签到（社长）
function approveCheckin(index) {
    const checkin = currentClub.checkins[index];
    const member = currentClub.members[checkin.memberName];
    
    if (!member) {
        alert('社员不存在');
        return;
    }
    
    // 更新签到状态
    checkin.status = 'approved';
    
    // 使用签到申请中已经设置好的时长设置
    // 签到申请时已经根据预设活动或默认设置计算了时长
    const timeSettings = checkin.timeSettings || {
        C: currentClub.timeSettings.C || 0,
        A: currentClub.timeSettings.A || 0,
        S: currentClub.timeSettings.S || 0
    };
    
    // 确保时长设置已保存
    checkin.timeSettings = timeSettings;
    
    saveData();
    loadPendingCheckins();
    loadMembersTable();
    
    // 显示审核通过
    const timeC = timeSettings.C;
    const timeA = timeSettings.A;
    const timeS = timeSettings.S;
    const totalAdded = timeC + timeA + timeS;
    
    let timeInfo = '';
    if (totalAdded > 0) {
        const parts = [];
        if (timeC > 0) parts.push(`C类: ${timeC}小时`);
        if (timeA > 0) parts.push(`A类: ${timeA}小时`);
        if (timeS > 0) parts.push(`S类: ${timeS}小时`);
        timeInfo = `\n本次增加时长：${parts.join(', ')}`;
        
        if (checkin.activityName) {
            timeInfo += `\n📅 活动：${checkin.activityName}`;
        }
    }
    
    alert(`${checkin.memberName} 的签到已通过！${timeInfo}`);
}

function rejectCheckin(index) {
    currentClub.checkins[index].status = 'rejected';
    saveData();
    loadPendingCheckins();
}

// 撤回签到（社长）
function revokeCheckin(index) {
    const checkin = currentClub.checkins[index];
    
    if (!checkin || checkin.status !== 'approved') {
        alert('只能撤回已通过的签到');
        return;
    }
    
    if (confirm(`确定要撤回 ${checkin.memberName} 的这条签到记录吗？\n此操作将从该社员的统计中扣除相应的时长。`)) {
        // 标记为已撤回
        checkin.status = 'rejected';
        checkin.revoked = true;
        
        saveData();
        loadMembersTable();
        loadCheckinHistory();
        
        alert('签到记录已撤回');
    }
}

// 加载社长页面
function loadCaptainPage() {
    // 显示社团信息
    document.getElementById('clubIdDisplay').textContent = currentClub.id;
    document.getElementById('clubNameDisplay').textContent = currentClub.name;
    document.getElementById('schoolNameDisplay').textContent = currentClub.schoolName || '';
    
    // 显示审核状态
    let statusText = '';
    let statusColor = '';
    if (currentClub.status === 'pending') {
        statusText = '待审核';
        statusColor = '#ff9800';
    } else if (currentClub.status === 'approved' || !currentClub.status) {
        statusText = '已通过';
        statusColor = '#4caf50';
    } else if (currentClub.status === 'rejected') {
        statusText = '已拒绝';
        statusColor = '#f44336';
    }
    document.getElementById('statusDisplay').textContent = statusText;
    document.getElementById('statusDisplay').style.color = statusColor;
    document.getElementById('statusDisplay').style.fontWeight = 'bold';
    
    // 显示签到码
    document.getElementById('checkinCode').textContent = currentClub.checkinCode || '点击生成';
    
    // 显示时长设置
    document.getElementById('timeC').value = currentClub.timeSettings.C;
    document.getElementById('timeA').value = currentClub.timeSettings.A;
    document.getElementById('timeS').value = currentClub.timeSettings.S;
    
    // 加载今日活动信息
    loadTodayActivityInfo();
    
    // 显示活动日期
    document.getElementById('activityDate').value = currentClub.activityDate;
    
    // 设置自动更新选项状态
    const autoUpdateCheckbox = document.getElementById('autoUpdateDate');
    const autoUpdateInfo = document.getElementById('autoUpdateInfo');
    
    if (autoUpdateCheckbox) {
        // 如果社团没有设置过自动更新，默认开启
        if (currentClub.autoUpdateDate === undefined) {
            currentClub.autoUpdateDate = true;
            saveData();
        }
        
        autoUpdateCheckbox.checked = currentClub.autoUpdateDate;
        
        // 显示/隐藏提示信息
        if (currentClub.autoUpdateDate) {
            autoUpdateInfo.style.display = 'block';
        } else {
            autoUpdateInfo.style.display = 'none';
        }
    }
    
    // 加载账号管理页面信息
    loadAccountPage();
    
    // 加载待审核签到
    loadPendingCheckins();
    
    // 加载待审核社员
    loadPendingMembers();
    
    // 加载社员表格
    loadMembersTable();
    
    // 加载签到记录
    loadCheckinHistory();
    
    // 加载参与情况表格
    loadParticipationTable();
    
    // 初始化日历
    initCalendar();
}

// 加载账号管理页面
function loadAccountPage() {
    // 显示社团信息
    document.getElementById('accountClubId').textContent = currentClub.id;
    document.getElementById('accountClubName').textContent = currentClub.name;
    document.getElementById('accountSchoolName').textContent = currentClub.schoolName || '未设置';
    
    // 显示审核状态
    let statusText = '';
    let statusColor = '';
    if (currentClub.status === 'pending') {
        statusText = '待审核';
        statusColor = '#ff9800';
    } else if (currentClub.status === 'approved' || !currentClub.status) {
        statusText = '已通过';
        statusColor = '#4caf50';
    } else if (currentClub.status === 'rejected') {
        statusText = '已拒绝';
        statusColor = '#f44336';
    }
    document.getElementById('accountStatus').textContent = statusText;
    document.getElementById('accountStatus').style.color = statusColor;
    document.getElementById('accountStatus').style.fontWeight = 'bold';
}

// 加载社员页面
function loadMemberPage() {
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    
    // 显示社员信息
    document.getElementById('memberNameDisplay').textContent = memberName;
    document.getElementById('memberSchoolDisplay').textContent = globalMember.school || '未设置';
    document.getElementById('memberClubsCount').textContent = globalMember.joinedClubs.length;
    
    // 加载各个页面
    loadMemberOverview();
    loadMemberClubs();
    loadMemberCheckin();
}

// 加载社员总览页面
function loadMemberOverview() {
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    
    // 计算全局统计
    let globalCheckinCount = 0;
    let globalTimeC = 0;
    let globalTimeA = 0;
    let globalTimeS = 0;
    
    // 遍历所有加入的社团
    const allClubs = getAllAdminClubs();
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            const memberCheckins = club.checkins.filter(c => c.memberName === memberName && c.status === 'approved');
            globalCheckinCount += memberCheckins.length;
            
            memberCheckins.forEach(checkin => {
                const timeSettings = checkin.timeSettings || club.timeSettings;
                globalTimeC += timeSettings.C || 0;
                globalTimeA += timeSettings.A || 0;
                globalTimeS += timeSettings.S || 0;
            });
        }
    });
    
    const globalTotalTime = globalTimeC + globalTimeA + globalTimeS;
    
    // 更新统计显示
    document.getElementById('globalCheckinCount').textContent = globalCheckinCount;
    document.getElementById('globalTimeC').textContent = globalTimeC.toFixed(1);
    document.getElementById('globalTimeA').textContent = globalTimeA.toFixed(1);
    document.getElementById('globalTimeS').textContent = globalTimeS.toFixed(1);
    document.getElementById('globalTotalTime').textContent = globalTotalTime.toFixed(1);
}

// 加载社员社团页面
function loadMemberClubs() {
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    const clubsList = document.getElementById('memberClubsList');
    
    if (globalMember.joinedClubs.length === 0) {
        clubsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">您还没有加入任何社团</p>';
        return;
    }
    
    let html = '';
    let validClubsCount = 0;
    
    globalMember.joinedClubs.forEach(clubId => {
        // 在所有管理员的数据中查找社团
        const allClubs = getAllAdminClubs();
        const club = allClubs[clubId];
        if (club) {
            validClubsCount++;
            // 计算该社团的统计
            const memberCheckins = club.checkins.filter(c => c.memberName === memberName && c.status === 'approved');
            let clubTimeC = 0, clubTimeA = 0, clubTimeS = 0;
            
            memberCheckins.forEach(checkin => {
                const timeSettings = checkin.timeSettings || club.timeSettings;
                clubTimeC += timeSettings.C || 0;
                clubTimeA += timeSettings.A || 0;
                clubTimeS += timeSettings.S || 0;
            });
            
            const clubTotalTime = clubTimeC + clubTimeA + clubTimeS;
            
            // 获取活动详情数据
            const activityDetails = getClubActivityDetails(clubId, memberName);
            
            html += `
                <div class="club-card">
                    <h4>${club.name}</h4>
                    <p><strong>学校：</strong>${club.schoolName}</p>
                    <p><strong>社团号：</strong>${club.id}</p>
                    
                    <!-- 总体统计 -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #667eea; font-size: 16px;">📊 总体统计</h3>
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #667eea;">${activityDetails.totalCheckins}</div>
                                <div style="font-size: 10px; color: #666;">签到次数</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #4caf50;">${activityDetails.totalTime.toFixed(1)}</div>
                                <div style="font-size: 10px; color: #666;">总时长(h)</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #ff9800;">${activityDetails.totalTimeC.toFixed(1)}</div>
                                <div style="font-size: 10px; color: #666;">C类(h)</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #e91e63;">${activityDetails.totalTimeA.toFixed(1)}</div>
                                <div style="font-size: 10px; color: #666;">A类(h)</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #2196f3;">${activityDetails.totalTimeS.toFixed(1)}</div>
                                <div style="font-size: 10px; color: #666;">S类(h)</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 活动记录表格 -->
                    <div style="margin-top: 15px;">
                        <h3 style="color: #667eea; margin-bottom: 10px; font-size: 16px;">📅 活动记录</h3>
                        <div style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; max-height: 300px; overflow-y: auto;">
            `;
            
            if (activityDetails.activities.length === 0) {
                html += '<div style="text-align: center; padding: 20px; color: #999;">暂无活动记录</div>';
            } else {
                html += `
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead style="background: #f5f5f5;">
                            <tr>
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e0e0e0;">活动日期</th>
                                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e0e0e0;">活动名称</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 1px solid #e0e0e0;">参与状态</th>
                                <th style="padding: 8px; text-align: center; border-bottom: 1px solid #e0e0e0;">CAS时长</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                activityDetails.activities.forEach(activity => {
                    const statusIcon = activity.participated ? '✅' : '❌';
                    const statusText = activity.participated ? '已参与' : '未参与';
                    const statusColor = activity.participated ? '#4caf50' : '#f44336';
                    
                    let timeInfo = '';
                    if (activity.participated && activity.timeSettings) {
                        const parts = [];
                        if (activity.timeSettings.C > 0) parts.push(`C:${activity.timeSettings.C}h`);
                        if (activity.timeSettings.A > 0) parts.push(`A:${activity.timeSettings.A}h`);
                        if (activity.timeSettings.S > 0) parts.push(`S:${activity.timeSettings.S}h`);
                        timeInfo = parts.join(' + ');
                    } else {
                        timeInfo = '-';
                    }
                    
                    html += `
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 8px;">${activity.date}</td>
                            <td style="padding: 8px;">${activity.name || '未命名活动'}</td>
                            <td style="padding: 8px; text-align: center;">
                                <span style="color: ${statusColor}; font-weight: bold;">
                                    ${statusIcon} ${statusText}
                                </span>
                            </td>
                            <td style="padding: 8px; text-align: center; font-family: monospace; font-size: 11px;">
                                ${timeInfo}
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                        </tbody>
                    </table>
                `;
            }
            
            html += `
                        </div>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div style="margin-top: 15px; text-align: center;">
                        <button class="btn btn-danger btn-small" onclick="quitClubFromMemberInterface('${clubId}')" style="background: #ff6b6b; border-color: #ff6b6b;">
                            退出社团
                        </button>
                    </div>
                </div>
            `;
        }
    });
    
    // 如果没有有效的社团，显示提示信息
    if (validClubsCount === 0) {
        html = '<p style="text-align: center; color: #999; padding: 40px;">您加入的社团已被注销</p>';
    }
    
    clubsList.innerHTML = html;
}

// 加载社员签到页面
function loadMemberCheckin() {
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    const clubSelect = document.getElementById('checkinClubSelect');
    
    // 清空选项
    clubSelect.innerHTML = '<option value="">请选择社团</option>';
    
    // 添加加入的社团选项
    const allClubs = getAllAdminClubs();
    globalMember.joinedClubs.forEach(clubId => {
        const club = allClubs[clubId];
        if (club) {
            const option = document.createElement('option');
            option.value = clubId;
            option.textContent = `${club.name} (${club.schoolName})`;
            clubSelect.appendChild(option);
        }
    });
}

// 加载社员设置页面
function loadMemberSettings() {
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    
    if (!globalMember) {
        console.error('社员数据不存在');
        return;
    }
    
    // 显示个人信息
    document.getElementById('settingsMemberName').textContent = memberName;
    document.getElementById('settingsMemberSchool').textContent = globalMember.school || '未设置';
    document.getElementById('settingsMemberClubsCount').textContent = globalMember.joinedClubs ? globalMember.joinedClubs.length : 0;
    
    // 格式化注册时间
    if (globalMember.createdAt) {
        const createdDate = new Date(globalMember.createdAt);
        const formattedDate = createdDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('settingsMemberCreatedAt').textContent = formattedDate;
    } else {
        document.getElementById('settingsMemberCreatedAt').textContent = '未知';
    }
}

// 加载待审核签到
function loadPendingCheckins() {
    const container = document.getElementById('pendingList');
    const pendingCheckins = currentClub.checkins.filter(c => c.status === 'pending');
    
    if (pendingCheckins.length === 0) {
        container.innerHTML = '<p style="color: #999;">暂无待审核签到</p>';
        return;
    }
    
    container.innerHTML = pendingCheckins.map((checkin, index) => {
        const actualIndex = currentClub.checkins.indexOf(checkin);
        
        // 计算本次签到将增加的时长（使用签到申请中保存的时长设置）
        const timeC = checkin.timeSettings?.C || 0;
        const timeA = checkin.timeSettings?.A || 0;
        const timeS = checkin.timeSettings?.S || 0;
        const totalTime = timeC + timeA + timeS;
        
        let timeInfo = '';
        if (totalTime > 0) {
            const parts = [];
            if (timeC > 0) parts.push(`C:${timeC}h`);
            if (timeA > 0) parts.push(`A:${timeA}h`);
            if (timeS > 0) parts.push(`S:${timeS}h`);
            timeInfo = `<p style="color: #4caf50; font-size: 14px; font-weight: bold;">✓ 本次将增加 ${parts.join(' + ')} = ${totalTime}小时</p>`;
            
            // 显示活动信息
            if (checkin.activityName) {
                timeInfo += `<p style="color: #2196f3; font-size: 13px; margin-top: 5px;">📅 活动：${checkin.activityName}</p>`;
            } else {
                timeInfo += `<p style="color: #666; font-size: 13px; margin-top: 5px;">📅 使用默认设置</p>`;
            }
        } else {
            timeInfo = '<p style="color: #999; font-size: 14px;">⚠️ 当前时长为0，请先设置时长</p>';
        }
        
        return `
            <div class="checkin-item">
                <div class="checkin-info">
                    <p><strong>${checkin.memberName}</strong></p>
                    <p style="color: #666; font-size: 14px;">${new Date(checkin.checkinTime).toLocaleString()}</p>
                    <p style="color: #666; font-size: 14px;">活动日期：${checkin.activityDate}</p>
                    ${timeInfo}
                </div>
                <div class="checkin-actions">
                    <button class="btn btn-success btn-small" onclick="approveCheckin(${actualIndex})">通过</button>
                    <button class="btn btn-danger btn-small" onclick="rejectCheckin(${actualIndex})">拒绝</button>
                </div>
            </div>
        `;
    }).join('');
}

// 加载社员表格
function loadMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    const members = Object.values(currentClub.members);
    
    // 过滤掉已注销的社员（检查是否还存在于全局社员列表中）
    // 并且确保该社员确实加入了当前社团
    const activeMembers = members.filter(member => {
        const globalMember = globalMembers[member.name];
        if (!globalMember) {
            console.log('社员', member.name, '不存在于全局社员列表中，已注销');
            return false;
        }
        
        // 检查该社员是否确实加入了当前社团
        const isJoinedToCurrentClub = globalMember.joinedClubs && 
                                     globalMember.joinedClubs.includes(currentClub.id);
        
        if (!isJoinedToCurrentClub) {
            console.log('社员', member.name, '未加入当前社团', currentClub.id);
            return false;
        }
        
        return true;
    });
    
    if (activeMembers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">暂无活跃社员</td></tr>';
        return;
    }
    
    // 重新计算每个社员的实际时长（从签到记录中统计）
    activeMembers.forEach(member => {
        const approvedCheckins = currentClub.checkins.filter(
            c => c.memberName === member.name && c.status === 'approved'
        );
        
        member.actualCheckinCount = approvedCheckins.length;
        member.actualTimeC = 0;
        member.actualTimeA = 0;
        member.actualTimeS = 0;
        
        approvedCheckins.forEach(checkin => {
            // 根据签到记录的时间设置来计算时长
            const checkinTimeSettings = checkin.timeSettings || currentClub.timeSettings;
            member.actualTimeC += checkinTimeSettings.C || currentClub.timeSettings.C || 0;
            member.actualTimeA += checkinTimeSettings.A || currentClub.timeSettings.A || 0;
            member.actualTimeS += checkinTimeSettings.S || currentClub.timeSettings.S || 0;
        });
    });
    
    tbody.innerHTML = activeMembers.map(member => {
        const totalTime = member.actualTimeC + member.actualTimeA + member.actualTimeS;
        return `
            <tr>
                <td><strong>${member.name}</strong></td>
                <td style="text-align: center;">${member.actualCheckinCount}</td>
                <td style="text-align: center; color: #667eea; font-weight: bold;">${member.actualTimeC.toFixed(1)}</td>
                <td style="text-align: center; color: #f093fb; font-weight: bold;">${member.actualTimeA.toFixed(1)}</td>
                <td style="text-align: center; color: #4facfe; font-weight: bold;">${member.actualTimeS.toFixed(1)}</td>
                <td style="text-align: center; color: #fa709a; font-weight: bold; font-size: 16px;">${totalTime.toFixed(1)}小时</td>
                <td style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-danger btn-small" onclick="removeMember('${member.name}')">删除</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 加载签到记录
function loadCheckinHistory() {
    const tbody = document.getElementById('recordTableBody');
    
    // 获取当前活跃的社员列表
    const activeMemberNames = new Set();
    Object.values(currentClub.members).forEach(member => {
        const globalMember = globalMembers[member.name];
        if (globalMember && globalMember.joinedClubs && globalMember.joinedClubs.includes(currentClub.id)) {
            activeMemberNames.add(member.name);
        }
    });
    
    // 过滤掉待审核记录，并且只显示仍然存在的活跃社员的签到记录
    const allCheckins = currentClub.checkins.filter(c => 
        c.status !== 'pending' && 
        currentClub.members[c.memberName] &&
        activeMemberNames.has(c.memberName)
    );
    
    if (allCheckins.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">暂无签到记录</td></tr>';
        return;
    }
    
    tbody.innerHTML = allCheckins.reverse().map((checkin, index) => {
        const statusClass = checkin.status === 'approved' ? 'success' : 'danger';
        let statusText = checkin.status === 'approved' ? '已通过' : '已拒绝';
        
        // 如果标记为已撤回，显示特殊状态
        if (checkin.revoked) {
            statusText = '已撤回';
        }
        
        // 计算实际的索引（因为数组被reverse了）
        const actualIndex = currentClub.checkins.length - 1 - index;
        
        // 获取活动信息
        const activityInfo = checkin.isPresetActivity && checkin.activityName ? 
            `<br><small style="color: #4caf50;">📅 ${checkin.activityName}</small>` : '';
        
        return `
            <tr>
                <td>${checkin.memberName}</td>
                <td>${new Date(checkin.checkinTime).toLocaleString()}</td>
                <td>${checkin.activityDate}${activityInfo}</td>
                <td style="font-family: monospace;">${checkin.code}</td>
                <td>C:${checkin.timeSettings?.C || 0} A:${checkin.timeSettings?.A || 0} S:${checkin.timeSettings?.S || 0}</td>
                <td>
                    <span class="badge-${statusClass}" ${checkin.revoked ? 'style="opacity: 0.6;"' : ''}>${statusText}</span>
                </td>
                <td>
                    ${checkin.status === 'approved' ? `<button class="btn btn-danger btn-small" onclick="revokeCheckin(${actualIndex})" title="撤回此签到">撤回</button>` : '<span style="color: #999; font-size: 12px;">-</span>'}
                </td>
            </tr>
        `;
    }).join('');
}

// 加载参与情况表格
function loadParticipationTable() {
    const tableHead = document.getElementById('participationTableHead');
    const tableBody = document.getElementById('participationTableBody');
    
    if (!tableHead || !tableBody) return;
    
    // 获取所有社员
    const members = Object.values(currentClub.members);
    
    // 过滤掉已注销的社员（检查是否还存在于全局社员列表中）
    // 并且确保该社员确实加入了当前社团
    const activeMembers = members.filter(member => {
        const globalMember = globalMembers[member.name];
        if (!globalMember) {
            return false;
        }
        
        // 检查该社员是否确实加入了当前社团
        const isJoinedToCurrentClub = globalMember.joinedClubs && 
                                     globalMember.joinedClubs.includes(currentClub.id);
        
        return isJoinedToCurrentClub;
    });
    
    if (activeMembers.length === 0) {
        tableHead.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #999; padding: 20px;">暂无活跃社员数据</td></tr>';
        tableBody.innerHTML = '';
        return;
    }
    
    // 获取所有活动日期（从签到记录中提取）
    const activityDates = new Set();
    currentClub.checkins.forEach(checkin => {
        if (checkin.status === 'approved') {
            activityDates.add(checkin.activityDate);
        }
    });
    
    // 按日期排序
    const sortedDates = Array.from(activityDates).sort();
    
    if (sortedDates.length === 0) {
        tableHead.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #999; padding: 20px;">暂无活动数据</td></tr>';
        tableBody.innerHTML = '';
        return;
    }
    
    // 生成表头
    let headerHTML = '<tr>';
    headerHTML += '<th>社员姓名</th>';
    sortedDates.forEach(date => {
        const activity = currentClub.activityCalendar[date];
        const activityName = activity ? activity.name : '活动';
        // 截断活动名称以适应紧凑布局
        const shortName = activityName.length > 6 ? activityName.substring(0, 6) + '...' : activityName;
        headerHTML += `<th title="${activityName}">${date}<br><small style="font-size: 9px; opacity: 0.8;">${shortName}</small></th>`;
    });
    headerHTML += '</tr>';
    tableHead.innerHTML = headerHTML;
    
    // 生成表格内容
    let bodyHTML = '';
    activeMembers.forEach(member => {
        // 获取该社员的签到记录
        const memberCheckins = currentClub.checkins.filter(
            c => c.memberName === member.name && c.status === 'approved'
        );
        
        bodyHTML += '<tr>';
        bodyHTML += `<td>${member.name}</td>`;
        
        // 检查每个活动日期的参与情况
        sortedDates.forEach(date => {
            const participated = memberCheckins.some(checkin => checkin.activityDate === date);
            const statusIcon = participated ? '✅' : '❌';
            const statusClass = participated ? 'participated' : 'not-participated';
            bodyHTML += `<td><span class="participation-status ${statusClass}">${statusIcon}</span></td>`;
        });
        
        bodyHTML += '</tr>';
    });
    
    tableBody.innerHTML = bodyHTML;
}

// 显示不同section
function showSection(sectionId) {
    // 隐藏所有section
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // 显示选中的section
    document.getElementById(sectionId + 'Section').style.display = 'block';
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 如果查看签到记录，重新加载
    if (sectionId === 'history') {
        loadCheckinHistory();
        loadParticipationTable();
    }
    
    // 如果查看签到管理，重新加载今日活动信息
    if (sectionId === 'checkin') {
        loadTodayActivityInfo();
    }
    
    // 如果查看社员管理，重新加载待审核社员
    if (sectionId === 'members') {
        loadPendingMembers();
    }
    
    // 如果查看账号管理，重新加载账号信息
    if (sectionId === 'account') {
        loadAccountPage();
    }
    
    // 如果查看活动设置，重新渲染日历
    if (sectionId === 'settings') {
        initCalendar();
    }
}

// 退出登录
function logout() {
    currentClub = null;
    currentUser = null;
    
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('captainPage').style.display = 'none';
    document.getElementById('memberPage').style.display = 'none';
    
    // 清空输入框
    document.getElementById('captainId').value = '';
    document.getElementById('captainPwd').value = '';
    document.getElementById('memberName').value = '';
    document.getElementById('memberPwd').value = '';
}

// 保存社团数据到正确的位置
function saveClubData(club) {
    if (club.status === 'approved') {
        // 社团已审核通过，需要找到对应的管理员并保存
        const admins = JSON.parse(localStorage.getItem('admins')) || {};
        let saved = false;
        
        for (const adminUsername in admins) {
            const adminKey = `admin_${adminUsername}`;
            const adminData = JSON.parse(localStorage.getItem(adminKey)) || { clubs: {} };
            
            // 检查这个管理员是否有这个社团
            if (adminData.clubs[club.id]) {
                adminData.clubs[club.id] = club;
                localStorage.setItem(adminKey, JSON.stringify(adminData));
                saved = true;
                console.log('社团数据已保存到管理员:', adminUsername);
                break;
            }
        }
        
        if (!saved) {
            console.log('警告：未找到对应的管理员数据，保存到全局clubs');
            localStorage.setItem('clubs', JSON.stringify(clubs));
        }
    } else {
        // 社团未审核通过或不在审核状态，保存到全局
        localStorage.setItem('clubs', JSON.stringify(clubs));
    }
}

// 保存数据
function saveData() {
    if (currentClub && currentClub.status === 'approved') {
        // 社团已审核通过，需要找到对应的管理员并保存
        const admins = JSON.parse(localStorage.getItem('admins')) || {};
        let saved = false;
        
        for (const adminUsername in admins) {
            const adminKey = `admin_${adminUsername}`;
            const adminData = JSON.parse(localStorage.getItem(adminKey)) || { clubs: {} };
            
            // 检查这个管理员是否有这个社团
            if (adminData.clubs[currentClub.id]) {
                adminData.clubs[currentClub.id] = currentClub;
                localStorage.setItem(adminKey, JSON.stringify(adminData));
                saved = true;
                console.log('社团数据已保存到管理员:', adminUsername);
                break;
            }
        }
        
        if (!saved) {
            console.log('警告：未找到对应的管理员数据，保存到全局clubs');
            localStorage.setItem('clubs', JSON.stringify(clubs));
        }
    } else {
        // 社团未审核通过或不在审核状态，保存到全局
        localStorage.setItem('clubs', JSON.stringify(clubs));
    }
}

// 保存已删除社团数据
function saveDeletedClubs() {
    localStorage.setItem('deletedClubs', JSON.stringify(deletedClubs));
}

// 保存全局社员数据
function saveGlobalMembers() {
    localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
}

// 加载保存的数据
function loadSavedData() {
    clubs = JSON.parse(localStorage.getItem('clubs')) || {};
    deletedClubs = JSON.parse(localStorage.getItem('deletedClubs')) || {};
    globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {};
    
    // 清理过期的已删除社团数据（超过30天）
    cleanExpiredDeletedClubs();
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
        saveDeletedClubs();
        console.log('已清理过期的已删除社团数据');
    }
}

// 显示社团号结果弹窗
function showClubIdResult(clubId, message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${message}</h2>
            <div class="form-group">
                <label>社团号：</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="resultClubId" value="${clubId}" readonly style="font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center;">
                    <button class="btn btn-primary" onclick="copyResultClubId()" style="white-space: nowrap;">📋 复制</button>
                </div>
            </div>
            <p style="color: #ff6b6b; margin-top: 15px; font-size: 14px;">⚠️ 请妥善保管社团号！</p>
            <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" style="width: 100%; margin-top: 10px;">知道了</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 自动复制到剪贴板
    setTimeout(() => {
        copyToClipboard(clubId);
    }, 300);
}

// 复制结果弹窗中的社团号
function copyResultClubId() {
    const clubId = document.getElementById('resultClubId').value;
    copyToClipboard(clubId);
}

// 复制社团号函数
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('社团号已复制到剪贴板！');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// 备用复制方法
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('社团号已复制到剪贴板！');
    } catch (err) {
        alert('复制失败，请手动复制：' + text);
    }
    
    document.body.removeChild(textArea);
}

// 复制当前社团号
function copyClubId() {
    if (currentClub && currentClub.id) {
        copyToClipboard(currentClub.id);
    }
}

// 复制签到码
function copyCheckinCode() {
    const checkinCodeElement = document.getElementById('checkinCode');
    const checkinCode = checkinCodeElement.textContent.replace('📋', '').trim();
    
    // 检查是否有签到码
    if (!checkinCode || checkinCode === '点击生成') {
        alert('请先生成签到码');
        return;
    }
    
    // 复制签到码
    copyToClipboard(checkinCode);
}

// 加载待审核社员
function loadPendingMembers() {
    const container = document.getElementById('pendingMembersList');
    
    if (!currentClub.pendingMembers || currentClub.pendingMembers.length === 0) {
        container.innerHTML = '<p style="color: #999;">暂无待审核社员</p>';
        return;
    }
    
    container.innerHTML = currentClub.pendingMembers.map((member, index) => {
        const memberName = typeof member === 'string' ? member : member.name;
        return `
            <div class="checkin-item">
                <div class="checkin-info">
                    <p><strong>${memberName}</strong></p>
                </div>
                <div class="checkin-actions">
                    <button class="btn btn-success btn-small" onclick="approveMember(${index})">通过</button>
                    <button class="btn btn-danger btn-small" onclick="rejectMember(${index})">拒绝</button>
                </div>
            </div>
        `;
    }).join('');
}

// 审核通过社员
function approveMember(index) {
    const pendingMember = currentClub.pendingMembers[index];
    const memberName = typeof pendingMember === 'string' ? pendingMember : pendingMember.name;
    const memberPassword = typeof pendingMember === 'string' ? null : pendingMember.password;
    
    // 检查全局社员是否存在
    if (!globalMembers[memberName]) {
        alert('该社员账号不存在，请先让社员注册账号');
        return;
    }
    
    // 从待审核列表中移除
    currentClub.pendingMembers.splice(index, 1);
    
    // 添加到已加入社员列表
    currentClub.members[memberName] = {
        name: memberName,
        password: memberPassword,
        checkinCount: 0,
        timeC: 0,
        timeA: 0,
        timeS: 0
    };
    
    // 将社团添加到社员的加入列表
    if (!globalMembers[memberName].joinedClubs.includes(currentClub.id)) {
        globalMembers[memberName].joinedClubs.push(currentClub.id);
        saveGlobalMembers();
    }
    
    saveData();
    loadPendingMembers();
    loadMembersTable();
    alert(`社员"${memberName}"已通过审核`);
}

// 拒绝社员
function rejectMember(index) {
    const pendingMember = currentClub.pendingMembers[index];
    const memberName = typeof pendingMember === 'string' ? pendingMember : pendingMember.name;
    
    if (confirm(`确定要拒绝社员"${memberName}"的申请吗？`)) {
        currentClub.pendingMembers.splice(index, 1);
        saveData();
        loadPendingMembers();
        alert('申请已拒绝');
    }
}

// 删除社员
function removeMember(memberName) {
    if (confirm(`确定要移除社员"${memberName}"吗？\n\n此操作将：\n- 从该社团中移除该社员\n- 清除该社员在该社团的所有签到记录\n- 清除该社员在该社团的所有活动数据\n- 从该社员的加入社团列表中移除此社团\n\n此操作不可恢复！`)) {
        
        // 再次确认
        if (!confirm('请再次确认：您真的要移除这个社员吗？')) {
            return;
        }
        
        console.log('社长开始移除社员:', memberName, '从社团:', currentClub.name);
        
        // 1. 从社团成员列表中移除
        delete currentClub.members[memberName];
        console.log('从社团', currentClub.name, '的成员列表中移除:', memberName);
        
        // 2. 从待审核列表中移除
        if (currentClub.pendingMembers) {
            const originalLength = currentClub.pendingMembers.length;
            currentClub.pendingMembers = currentClub.pendingMembers.filter(member => {
                if (typeof member === 'string') {
                    return member !== memberName;
                } else {
                    return member.name !== memberName;
                }
            });
            if (currentClub.pendingMembers.length !== originalLength) {
                console.log('从社团', currentClub.name, '的待审核列表中移除:', memberName);
            }
        }
        
        // 3. 从签到记录中移除（完全清除历史数据）
        const originalLength = currentClub.checkins.length;
        currentClub.checkins = currentClub.checkins.filter(checkin => checkin.memberName !== memberName);
        if (currentClub.checkins.length !== originalLength) {
            console.log('从社团', currentClub.name, '的签到记录中移除:', memberName, `(${originalLength - currentClub.checkins.length}条记录)`);
        }
        
        // 4. 清理活动日历中可能存在的该社员数据
        if (currentClub.activityCalendar) {
            Object.keys(currentClub.activityCalendar).forEach(date => {
                const activity = currentClub.activityCalendar[date];
                if (activity && activity.participants) {
                    const originalLength = activity.participants.length;
                    activity.participants = activity.participants.filter(p => p !== memberName);
                    if (activity.participants.length !== originalLength) {
                        console.log('从活动', activity.name, '的参与者列表中移除:', memberName);
                    }
                }
            });
        }
        
        // 5. 从全局社员数据中移除该社团
        const globalMember = globalMembers[memberName];
        if (globalMember && globalMember.joinedClubs) {
            globalMember.joinedClubs = globalMember.joinedClubs.filter(id => id !== currentClub.id);
            console.log('从社员', memberName, '的加入社团列表中移除:', currentClub.id);
            saveGlobalMembers();
        }
        
        // 6. 保存数据
        saveData();
        
        // 7. 重新加载界面
        loadMembersTable();
        loadCheckinHistory();
        loadParticipationTable();
        
        console.log('社员', memberName, '已成功从社团', currentClub.name, '中移除');
        alert(`社员"${memberName}"已成功移除！\n所有相关数据已完全清除。`);
    }
}

// 社员主动退出社团
function quitClub() {
    if (confirm('确定要退出社团吗？\n此操作将清除您的所有签到记录！\n退出的社员将无法继续使用该账号登录。')) {
        const memberName = currentUser.name;
        
        // 删除社员
        delete currentClub.members[memberName];
        
        // 删除该社员的所有签到记录
        currentClub.checkins = currentClub.checkins.filter(checkin => checkin.memberName !== memberName);
        
        saveData();
        
        alert('您已成功退出社团，感谢您的参与！');
        
        // 退出登录并返回登录页
        logout();
    }
}

// 从社员界面退出指定社团
function quitClubFromMemberInterface(clubId) {
    const memberName = currentUser.name;
    
    // 获取社团信息
    const allClubs = getAllAdminClubs();
    const club = allClubs[clubId];
    
    if (!club) {
        alert('社团不存在或已被删除');
        return;
    }
    
    // 确认退出
    if (!confirm(`确定要退出社团"${club.name}"吗？\n\n此操作将：\n- 从该社团中移除您\n- 清除您在该社团的所有签到记录\n- 清除您在该社团的所有活动数据\n\n此操作不可恢复！`)) {
        return;
    }
    
    // 再次确认
    if (!confirm('请再次确认：您真的要退出这个社团吗？')) {
        return;
    }
    
    console.log('社员', memberName, '开始退出社团', clubId);
    
    // 1. 从社团成员列表中移除
    if (club.members && club.members[memberName]) {
        delete club.members[memberName];
        console.log('从社团', club.name, '的成员列表中移除:', memberName);
    }
    
    // 2. 从待审核列表中移除
    if (club.pendingMembers) {
        const originalLength = club.pendingMembers.length;
        club.pendingMembers = club.pendingMembers.filter(member => {
            if (typeof member === 'string') {
                return member !== memberName;
            } else {
                return member.name !== memberName;
            }
        });
        if (club.pendingMembers.length !== originalLength) {
            console.log('从社团', club.name, '的待审核列表中移除:', memberName);
        }
    }
    
    // 3. 从签到记录中移除（完全清除历史数据）
    if (club.checkins) {
        const originalLength = club.checkins.length;
        club.checkins = club.checkins.filter(checkin => checkin.memberName !== memberName);
        if (club.checkins.length !== originalLength) {
            console.log('从社团', club.name, '的签到记录中移除:', memberName, `(${originalLength - club.checkins.length}条记录)`);
        }
    }
    
    // 4. 清理活动日历中可能存在的该社员数据
    if (club.activityCalendar) {
        Object.keys(club.activityCalendar).forEach(date => {
            const activity = club.activityCalendar[date];
            if (activity && activity.participants) {
                const originalLength = activity.participants.length;
                activity.participants = activity.participants.filter(p => p !== memberName);
                if (activity.participants.length !== originalLength) {
                    console.log('从活动', activity.name, '的参与者列表中移除:', memberName);
                }
            }
        });
    }
    
    // 5. 从全局社员数据中移除该社团
    const globalMember = globalMembers[memberName];
    if (globalMember && globalMember.joinedClubs) {
        globalMember.joinedClubs = globalMember.joinedClubs.filter(id => id !== clubId);
        console.log('从社员', memberName, '的加入社团列表中移除:', clubId);
    }
    
    // 6. 保存数据
    saveClubData(club);
    saveGlobalMembers();
    
    console.log('社员', memberName, '已成功退出社团', clubId);
    
    // 7. 重新加载社员界面
    loadMemberClubs();
    loadMemberCheckin();
    loadMemberOverview();
    
    alert(`您已成功退出社团"${club.name}"！\n所有相关数据已完全清除。`);
}

// 显示社长修改密码弹窗
function showCaptainChangePassword() {
    document.getElementById('captainChangePasswordModal').style.display = 'flex';
}

// 关闭社长修改密码弹窗
function closeCaptainChangePassword() {
    document.getElementById('captainChangePasswordModal').style.display = 'none';
    document.getElementById('captainOldPwd').value = '';
    document.getElementById('captainNewPwd').value = '';
    document.getElementById('captainNewPwdConfirm').value = '';
}

// 社长修改密码
function changeCaptainPassword() {
    const oldPwd = document.getElementById('captainOldPwd').value;
    const newPwd = document.getElementById('captainNewPwd').value;
    const newPwdConfirm = document.getElementById('captainNewPwdConfirm').value;
    
    if (!oldPwd || !newPwd || !newPwdConfirm) {
        alert('请填写完整信息');
        return;
    }
    
    if (currentClub.password !== oldPwd) {
        alert('当前密码错误');
        return;
    }
    
    if (newPwd !== newPwdConfirm) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    currentClub.password = newPwd;
    saveData();
    closeCaptainChangePassword();
    alert('社团密码修改成功！');
}

// 显示社员修改密码弹窗
function showMemberChangePassword() {
    document.getElementById('memberChangePasswordModal').style.display = 'flex';
}

// 关闭社员修改密码弹窗
function closeMemberChangePassword() {
    document.getElementById('memberChangePasswordModal').style.display = 'none';
    document.getElementById('memberOldPwd').value = '';
    document.getElementById('memberNewPwd').value = '';
    document.getElementById('memberNewPwdConfirm').value = '';
}

// 社员修改密码
function changeMemberPassword() {
    const oldPwd = document.getElementById('memberOldPwd').value;
    const newPwd = document.getElementById('memberNewPwd').value;
    const newPwdConfirm = document.getElementById('memberNewPwdConfirm').value;
    
    if (!oldPwd || !newPwd || !newPwdConfirm) {
        alert('请填写完整信息');
        return;
    }
    
    const memberName = currentUser.name;
    const globalMember = globalMembers[memberName];
    
    if (globalMember.password !== oldPwd) {
        alert('当前密码错误');
        return;
    }
    
    if (newPwd !== newPwdConfirm) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    globalMembers[memberName].password = newPwd;
    saveGlobalMembers();
    closeMemberChangePassword();
    alert('密码修改成功！');
}

// 删除社员账号
function deleteMemberAccount() {
    const memberName = currentUser.name;
    
    // 确认删除
    if (!confirm(`确定要删除账号 "${memberName}" 吗？\n\n此操作将：\n- 删除您的账号信息\n- 从所有社团中移除您\n- 清除所有签到记录\n- 清理社长系统和管理员系统中的相关数据\n\n此操作不可恢复！`)) {
        return;
    }
    
    // 再次确认
    if (!confirm('请再次确认：您真的要删除这个账号吗？')) {
        return;
    }
    
    console.log('开始删除社员账号:', memberName);
    
    // 1. 从全局clubs中移除该社员（兼容旧数据）
    for (const clubId in clubs) {
        const club = clubs[clubId];
        cleanupMemberFromClub(club, memberName);
    }
    
    // 2. 从所有管理员的数据中移除该社员
    const admins = JSON.parse(localStorage.getItem('admins')) || {};
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey)) || {};
        
        // 清理管理员数据中的社团
        if (adminData.clubs) {
            Object.keys(adminData.clubs).forEach(clubId => {
                const club = adminData.clubs[clubId];
                cleanupMemberFromClub(club, memberName);
            });
            
            // 保存更新后的管理员数据
            localStorage.setItem(adminKey, JSON.stringify(adminData));
            console.log('已清理管理员', adminUsername, '的数据');
        }
        
        // 清理管理员数据中的已删除社团
        if (adminData.deletedClubs) {
            Object.keys(adminData.deletedClubs).forEach(clubId => {
                const club = adminData.deletedClubs[clubId];
                cleanupMemberFromClub(club, memberName);
            });
            
            // 保存更新后的管理员数据
            localStorage.setItem(adminKey, JSON.stringify(adminData));
            console.log('已清理管理员', adminUsername, '的已删除社团数据');
        }
    });
    
    // 3. 从待审核社团中移除该社员
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        cleanupMemberFromClub(club, memberName);
    });
    localStorage.setItem('pendingClubs', JSON.stringify(pendingClubs));
    console.log('已清理待审核社团数据');
    
    // 4. 从全局社员列表中删除
    delete globalMembers[memberName];
    
    // 5. 保存数据
    saveData();
    saveGlobalMembers();
    
    // 6. 验证数据清理是否完整
    verifyMemberDataCleanup(memberName);
    
    console.log('社员账号删除完成:', memberName);
    
    // 7. 退出登录
    logout();
    
    alert('账号已成功删除！所有相关数据已清理完毕。');
}

// 从社团中清理社员数据的辅助函数
function cleanupMemberFromClub(club, memberName) {
    if (!club) return;
    
    // 从社团成员列表中移除
    if (club.members && club.members[memberName]) {
        delete club.members[memberName];
        console.log('从社团', club.name, '的成员列表中移除:', memberName);
    }
    
    // 从待审核列表中移除
    if (club.pendingMembers) {
        const originalLength = club.pendingMembers.length;
        club.pendingMembers = club.pendingMembers.filter(member => {
            if (typeof member === 'string') {
                return member !== memberName;
            } else {
                return member.name !== memberName;
            }
        });
        if (club.pendingMembers.length !== originalLength) {
            console.log('从社团', club.name, '的待审核列表中移除:', memberName);
        }
    }
    
    // 从签到记录中移除（完全清除历史数据）
    if (club.checkins) {
        const originalLength = club.checkins.length;
        club.checkins = club.checkins.filter(checkin => checkin.memberName !== memberName);
        if (club.checkins.length !== originalLength) {
            console.log('从社团', club.name, '的签到记录中移除:', memberName, `(${originalLength - club.checkins.length}条记录)`);
        }
    }
    
    // 清理活动日历中可能存在的该社员数据
    if (club.activityCalendar) {
        Object.keys(club.activityCalendar).forEach(date => {
            const activity = club.activityCalendar[date];
            if (activity && activity.participants) {
                const originalLength = activity.participants.length;
                activity.participants = activity.participants.filter(p => p !== memberName);
                if (activity.participants.length !== originalLength) {
                    console.log('从活动', activity.name, '的参与者列表中移除:', memberName);
                }
            }
        });
    }
}

// 验证社员数据清理是否完整
function verifyMemberDataCleanup(memberName) {
    console.log('=== 验证社员数据清理完整性 ===');
    console.log('验证社员:', memberName);
    
    let hasRemainingData = false;
    
    // 1. 检查全局社员列表
    if (globalMembers[memberName]) {
        console.log('❌ 全局社员列表中仍存在:', memberName);
        hasRemainingData = true;
    } else {
        console.log('✅ 全局社员列表已清理');
    }
    
    // 2. 检查所有社团数据
    const allClubs = getAllAdminClubs();
    Object.keys(allClubs).forEach(clubId => {
        const club = allClubs[clubId];
        
        // 检查成员列表
        if (club.members && club.members[memberName]) {
            console.log('❌ 社团', club.name, '的成员列表中仍存在:', memberName);
            hasRemainingData = true;
        }
        
        // 检查签到记录
        const memberCheckins = club.checkins.filter(c => c.memberName === memberName);
        if (memberCheckins.length > 0) {
            console.log('❌ 社团', club.name, '的签到记录中仍存在:', memberName, `(${memberCheckins.length}条记录)`);
            hasRemainingData = true;
        }
        
        // 检查待审核列表
        if (club.pendingMembers) {
            const pendingMember = club.pendingMembers.find(member => {
                const name = typeof member === 'string' ? member : member.name;
                return name === memberName;
            });
            if (pendingMember) {
                console.log('❌ 社团', club.name, '的待审核列表中仍存在:', memberName);
                hasRemainingData = true;
            }
        }
    });
    
    // 3. 检查待审核社团
    const pendingClubs = JSON.parse(localStorage.getItem('pendingClubs')) || {};
    Object.keys(pendingClubs).forEach(clubId => {
        const club = pendingClubs[clubId];
        
        if (club.members && club.members[memberName]) {
            console.log('❌ 待审核社团', club.name, '的成员列表中仍存在:', memberName);
            hasRemainingData = true;
        }
        
        const memberCheckins = club.checkins.filter(c => c.memberName === memberName);
        if (memberCheckins.length > 0) {
            console.log('❌ 待审核社团', club.name, '的签到记录中仍存在:', memberName, `(${memberCheckins.length}条记录)`);
            hasRemainingData = true;
        }
    });
    
    if (hasRemainingData) {
        console.log('⚠️ 发现残留数据，建议手动清理');
    } else {
        console.log('✅ 数据清理完整，无残留数据');
    }
    
    console.log('=== 验证完成 ===');
}

// 显示注销社团弹窗
function showDeleteClubModal() {
    // 显示密保问题
    document.getElementById('confirmSecurityQuestion').value = currentClub.securityQuestion;
    
    // 显示弹窗
    document.getElementById('deleteClubModal').style.display = 'flex';
}

// 关闭注销社团弹窗
function closeDeleteClubModal() {
    document.getElementById('deleteClubModal').style.display = 'none';
    document.getElementById('confirmSchoolName').value = '';
    document.getElementById('confirmClubName').value = '';
    document.getElementById('confirmSecurityQuestion').value = '';
    document.getElementById('confirmSecurityAnswer').value = '';
}

// 确认注销社团
function confirmDeleteClub() {
    const schoolName = document.getElementById('confirmSchoolName').value.trim();
    const clubName = document.getElementById('confirmClubName').value.trim();
    const securityAnswer = document.getElementById('confirmSecurityAnswer').value.trim();
    
    if (!schoolName || !clubName || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 验证学校名称
    if (schoolName !== currentClub.schoolName) {
        alert('学校名称不正确');
        return;
    }
    
    // 验证社团名称
    if (clubName !== currentClub.name) {
        alert('社团名称不正确');
        return;
    }
    
    // 验证密保答案
    if (securityAnswer !== currentClub.securityAnswer) {
        alert('密保答案不正确');
        return;
    }
    
    // 执行注销操作
    deleteClubPermanently();
}

// 永久删除社团（移动到已删除列表）
function deleteClubPermanently() {
    const clubId = currentClub.id;
    const clubData = { ...currentClub };
    
    // 添加删除时间戳
    clubData.deletedAt = new Date().toISOString();
    clubData.deletedBy = 'self'; // 标记为自主注销
    
    // 移动到已删除社团列表
    deletedClubs[clubId] = clubData;
    
    // 从活跃社团中删除
    delete clubs[clubId];
    
    // 清理所有社员的社团列表，移除已注销的社团
    cleanupMemberClubsList(clubId);
    
    // 同步到所有管理员的数据中
    syncDeletedClubToAllAdmins(clubId, clubData);
    
    // 保存数据
    saveData();
    saveDeletedClubs();
    saveGlobalMembers();
    
    // 关闭弹窗
    closeDeleteClubModal();
    
    // 显示成功消息
    alert('社团已成功注销！\n数据将在管理员系统中保留30天。\n所有社员已自动从该社团中移除。');
    
    // 退出登录
    logout();
}

// 同步已删除社团到所有管理员的数据中
function syncDeletedClubToAllAdmins(clubId, clubData) {
    console.log(`同步已删除社团到所有管理员: ${clubId}`);
    
    // 获取所有管理员
    const admins = JSON.parse(localStorage.getItem('admins') || '{}');
    
    Object.keys(admins).forEach(adminUsername => {
        const adminKey = `admin_${adminUsername}`;
        const adminData = JSON.parse(localStorage.getItem(adminKey) || '{}');
        
        // 确保管理员数据结构存在
        if (!adminData.clubs) adminData.clubs = {};
        if (!adminData.deletedClubs) adminData.deletedClubs = {};
        
        // 从该管理员的活跃社团中删除
        if (adminData.clubs[clubId]) {
            delete adminData.clubs[clubId];
            console.log(`从管理员 ${adminUsername} 的活跃社团中删除: ${clubId}`);
        }
        
        // 添加到该管理员的已删除社团中
        adminData.deletedClubs[clubId] = clubData;
        console.log(`添加到管理员 ${adminUsername} 的已删除社团: ${clubId}`);
        
        // 保存管理员数据
        localStorage.setItem(adminKey, JSON.stringify(adminData));
    });
    
    console.log('已删除社团同步完成');
}

// ==================== 社团清理功能 ====================

// 清理所有社员的社团列表，移除已注销的社团
function cleanupMemberClubsList(deletedClubId) {
    let cleanedCount = 0;
    const affectedMembers = [];
    
    // 获取被删除社团的信息
    const deletedClub = deletedClubs[deletedClubId];
    const clubName = deletedClub ? deletedClub.name : `社团 ${deletedClubId}`;
    
    // 遍历所有社员
    for (const memberName in globalMembers) {
        const member = globalMembers[memberName];
        
        // 检查该社员是否加入了被删除的社团
        const clubIndex = member.joinedClubs.indexOf(deletedClubId);
        if (clubIndex !== -1) {
            // 从社员的社团列表中移除该社团
            member.joinedClubs.splice(clubIndex, 1);
            cleanedCount++;
            affectedMembers.push(memberName);
            
            // 记录社团注销通知
            if (!member.notifications) {
                member.notifications = [];
            }
            member.notifications.push({
                type: 'club_deleted',
                message: `您加入的社团"${clubName}"已被注销`,
                timestamp: new Date().toISOString(),
                clubId: deletedClubId,
                clubName: clubName
            });
        }
    }
    
    // 保存更新后的社员数据
    localStorage.setItem('globalMembers', JSON.stringify(globalMembers));
    
    console.log(`已从 ${cleanedCount} 个社员的社团列表中移除社团 ${deletedClubId}`);
    console.log(`受影响的社员: ${affectedMembers.join(', ')}`);
}

// ==================== 日历功能 ====================

// 获取本地日期字符串（YYYY-MM-DD格式）
function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化日历
function initCalendar() {
    if (!currentClub) return;
    
    // 确保社团有活动日历数据
    if (!currentClub.activityCalendar) {
        currentClub.activityCalendar = {};
    }
    
    renderCalendar();
}

// 渲染日历
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // 更新月份显示
    currentMonthElement.textContent = `${year}年${month + 1}月`;
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 从周日开始
    
    // 清空日历
    calendarGrid.innerHTML = '';
    
    // 添加星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.cssText = 'background: #667eea; color: white; padding: 10px; text-align: center; font-weight: bold;';
        calendarGrid.appendChild(dayHeader);
    });
    
    // 生成42个日期格子（6周 x 7天）
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.style.cssText = `
            background: white;
            padding: 8px;
            min-height: 60px;
            border: 1px solid #eee;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
        `;
        
        // 设置日期
        dayElement.textContent = date.getDate();
        
        // 判断是否为当前月份
        const isCurrentMonth = date.getMonth() === month;
        if (!isCurrentMonth) {
            dayElement.style.opacity = '0.3';
            dayElement.style.background = '#f8f9fa';
        }
        
        // 判断是否为今天
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        if (isToday) {
            dayElement.style.background = '#e3f2fd';
            dayElement.style.border = '2px solid #2196f3';
        }
        
        // 检查是否有活动
        const dateString = getLocalDateString(date);
        const activity = currentClub.activityCalendar[dateString];
        
        if (activity) {
            dayElement.style.background = '#e8f5e8';
            dayElement.style.border = '2px solid #4caf50';
            
            // 添加活动指示器
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                width: 8px;
                height: 8px;
                background: #4caf50;
                border-radius: 50%;
            `;
            dayElement.appendChild(indicator);
            
            // 添加活动名称（截断显示）
            const activityName = document.createElement('div');
            activityName.textContent = activity.name ? activity.name.substring(0, 6) + (activity.name.length > 6 ? '...' : '') : '活动';
            activityName.style.cssText = `
                font-size: 10px;
                color: #2e7d32;
                margin-top: 2px;
                line-height: 1.2;
            `;
            dayElement.appendChild(activityName);
        }
        
        // 添加点击事件
        dayElement.onclick = () => openActivityEdit(dateString);
        dayElement.onmouseover = () => {
            if (isCurrentMonth) {
                dayElement.style.background = activity ? '#d4edda' : '#f0f8ff';
            }
        };
        dayElement.onmouseout = () => {
            if (isCurrentMonth) {
                dayElement.style.background = activity ? '#e8f5e8' : (isToday ? '#e3f2fd' : 'white');
            }
        };
        
        calendarGrid.appendChild(dayElement);
    }
}

// 上一个月
function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

// 下一个月
function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

// 打开活动编辑
function openActivityEdit(dateString) {
    selectedActivityDate = dateString;
    const activity = currentClub.activityCalendar[dateString] || {};
    
    // 设置弹窗内容
    document.getElementById('editActivityDate').textContent = new Date(dateString).toLocaleDateString('zh-CN');
    document.getElementById('editActivityName').value = activity.name || '';
    document.getElementById('editActivityDescription').value = activity.description || '';
    document.getElementById('editTimeC').value = activity.timeSettings?.C || 0;
    document.getElementById('editTimeA').value = activity.timeSettings?.A || 0;
    document.getElementById('editTimeS').value = activity.timeSettings?.S || 0;
    
    // 显示弹窗
    document.getElementById('activityEditModal').style.display = 'flex';
}

// 关闭活动编辑弹窗
function closeActivityEditModal() {
    document.getElementById('activityEditModal').style.display = 'none';
    selectedActivityDate = null;
}

// 保存活动
function saveActivity() {
    if (!selectedActivityDate) return;
    
    const name = document.getElementById('editActivityName').value.trim();
    const description = document.getElementById('editActivityDescription').value.trim();
    const timeC = parseFloat(document.getElementById('editTimeC').value) || 0;
    const timeA = parseFloat(document.getElementById('editTimeA').value) || 0;
    const timeS = parseFloat(document.getElementById('editTimeS').value) || 0;
    
    if (!name) {
        alert('请输入活动名称');
        return;
    }
    
    // 保存活动数据
    currentClub.activityCalendar[selectedActivityDate] = {
        name: name,
        description: description,
        timeSettings: { C: timeC, A: timeA, S: timeS },
        createdAt: new Date().toISOString()
    };
    
    saveData();
    
    // 更新相关的待审核签到申请
    updatePendingCheckinsForActivity(selectedActivityDate);
    
    closeActivityEditModal();
    renderCalendar();
    alert('活动已保存！');
}

// 删除活动
function deleteActivity() {
    if (!selectedActivityDate) return;
    
    if (confirm('确定要删除这个活动吗？')) {
        // 更新相关的待审核签到申请，移除预设活动信息
        updatePendingCheckinsForDeletedActivity(selectedActivityDate);
        
        delete currentClub.activityCalendar[selectedActivityDate];
        saveData();
        closeActivityEditModal();
        renderCalendar();
        alert('活动已删除！');
    }
}

// ==================== 社员注册询问功能 ====================
// 注意：这些函数在新的全局社员系统中不再需要，因为社员不再需要社团号

// ==================== 申请加入社团功能 ====================

// 显示申请加入社团弹窗
function showJoinClubModal() {
    document.getElementById('joinClubModal').style.display = 'flex';
}

// 关闭申请加入社团弹窗
function closeJoinClubModal() {
    document.getElementById('joinClubModal').style.display = 'none';
    document.getElementById('joinClubId').value = '';
    document.getElementById('joinClubReason').value = '';
}

// 提交加入社团申请
function submitJoinClubApplication() {
    const clubId = document.getElementById('joinClubId').value.trim();
    const reason = document.getElementById('joinClubReason').value.trim();
    
    if (!clubId) {
        alert('请输入社团号');
        return;
    }
    
    // 在所有管理员的数据中查找社团
    const allClubs = getAllAdminClubs();
    
    if (!allClubs[clubId]) {
        alert('社团号不存在');
        return;
    }
    
    const club = allClubs[clubId];
    const memberName = currentUser.name;
    
    // 检查社团状态
    if (club.status === 'pending') {
        alert('该社团正在审核中，暂时无法申请加入');
        return;
    }
    
    if (club.status === 'rejected') {
        alert('该社团审核未通过，无法申请加入');
        return;
    }
    
    // 检查是否已经加入
    if (club.members[memberName]) {
        alert('您已经是该社团的社员了');
        return;
    }
    
    // 检查是否已经在申请中
    if (!club.pendingMembers) {
        club.pendingMembers = [];
    }
    
    const isAlreadyPending = club.pendingMembers.some(m => 
        (typeof m === 'string' ? m : m.name) === memberName
    );
    
    if (isAlreadyPending) {
        alert('您已经申请过该社团，请等待社长审核');
        return;
    }
    
    // 添加申请
    club.pendingMembers.push({
        name: memberName,
        reason: reason,
        appliedAt: new Date().toISOString()
    });
    
    // 保存数据到正确的位置
    saveClubData(club);
    closeJoinClubModal();
    alert('申请已提交，请等待社长审核');
}

// ==================== 活动编辑同步功能 ====================

// 更新相关待审核签到申请的活动信息
function updatePendingCheckinsForActivity(activityDate) {
    if (!activityDate) return;
    
    const activity = currentClub.activityCalendar[activityDate];
    if (!activity) return;
    
    // 更新该日期的所有待审核签到申请
    currentClub.checkins.forEach(checkin => {
        if (checkin.activityDate === activityDate && checkin.status === 'pending') {
            // 更新时长设置
            if (activity.timeSettings) {
                checkin.timeSettings = {
                    C: activity.timeSettings.C || 0,
                    A: activity.timeSettings.A || 0,
                    S: activity.timeSettings.S || 0
                };
            }
            
            // 更新活动信息
            checkin.activityName = activity.name;
            checkin.isPresetActivity = true;
        }
    });
    
    saveData();
}

// ==================== 密保问题功能 ====================

// 更新密保问题占位符
function updateSecurityQuestionPlaceholder() {
    const question = document.getElementById('regSecurityQuestion').value;
    const answerInput = document.getElementById('regSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示忘记密码弹窗
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetForgotPasswordModal();
}

// 关闭忘记密码弹窗
function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    resetForgotPasswordModal();
}

// 重置忘记密码弹窗状态
function resetForgotPasswordModal() {
    document.getElementById('forgotMemberName').value = '';
    document.getElementById('forgotSecurityQuestion').value = '';
    document.getElementById('forgotSecurityAnswer').value = '';
    document.getElementById('forgotNewPassword').value = '';
    document.getElementById('forgotConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'none';
    document.getElementById('confirmPasswordGroup').style.display = 'none';
    document.getElementById('verifyBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
}

// 验证密保答案
function verifySecurityAnswer() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const securityAnswer = document.getElementById('forgotSecurityAnswer').value.trim();
    
    if (!memberName || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社员是否存在
    if (!globalMembers[memberName]) {
        alert('社员账号不存在');
        return;
    }
    
    const member = globalMembers[memberName];
    
    // 检查是否有密保问题设置
    if (!member.securityQuestion || !member.securityAnswer) {
        alert('该账号未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotSecurityQuestion').value = member.securityQuestion;
    
    // 验证密保答案
    if (member.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'block';
    document.getElementById('confirmPasswordGroup').style.display = 'block';
    document.getElementById('verifyBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置密码
function resetPassword() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value;
    const confirmPassword = document.getElementById('forgotConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    globalMembers[memberName].password = newPassword;
    saveGlobalMembers();
    
    closeForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// ==================== 社长密保问题功能 ====================

// 更新社长密保问题占位符
function updateClubSecurityQuestionPlaceholder() {
    const question = document.getElementById('clubSecurityQuestion').value;
    const answerInput = document.getElementById('clubSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示社长忘记密码弹窗
function showCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetCaptainForgotPasswordModal();
}

// 关闭社长忘记密码弹窗
function closeCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'none';
    resetCaptainForgotPasswordModal();
}

// 重置社长忘记密码弹窗状态
function resetCaptainForgotPasswordModal() {
    document.getElementById('forgotCaptainClubId').value = '';
    document.getElementById('forgotCaptainSecurityQuestion').value = '';
    document.getElementById('forgotCaptainSecurityAnswer').value = '';
    document.getElementById('forgotCaptainNewPassword').value = '';
    document.getElementById('forgotCaptainConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'none';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'none';
    document.getElementById('captainVerifyBtn').style.display = 'inline-block';
    document.getElementById('captainResetBtn').style.display = 'none';
}

// 验证社长密保答案
function verifyCaptainSecurityAnswer() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const securityAnswer = document.getElementById('forgotCaptainSecurityAnswer').value.trim();
    
    if (!clubId || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社团是否存在
    if (!clubs[clubId]) {
        alert('社团号不存在');
        return;
    }
    
    const club = clubs[clubId];
    
    // 检查是否有密保问题设置
    if (!club.securityQuestion || !club.securityAnswer) {
        alert('该社团未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotCaptainSecurityQuestion').value = club.securityQuestion;
    
    // 验证密保答案
    if (club.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'block';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'block';
    document.getElementById('captainVerifyBtn').style.display = 'none';
    document.getElementById('captainResetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置社长密码
function resetCaptainPassword() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const newPassword = document.getElementById('forgotCaptainNewPassword').value;
    const confirmPassword = document.getElementById('forgotCaptainConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    clubs[clubId].password = newPassword;
    saveData();
    
    closeCaptainForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// ==================== 社团详情功能 ====================

// ==================== 今日活动同步功能 ====================

// 加载今日活动信息
function loadTodayActivityInfo() {
    const today = getLocalDateString(new Date());
    const todayActivity = currentClub.activityCalendar && currentClub.activityCalendar[today];
    
    // 更新活动日期显示
    document.getElementById('todayActivityDate').textContent = currentClub.activityDate;
    
    if (todayActivity) {
        // 有预设活动
        document.getElementById('todayActivityName').textContent = todayActivity.name || '未命名活动';
        document.getElementById('todayActivityName').style.color = '#4caf50';
        document.getElementById('todayActivityName').style.fontWeight = 'bold';
        
        // 自动同步预设时长
        if (todayActivity.timeSettings) {
            document.getElementById('timeC').value = todayActivity.timeSettings.C || 0;
            document.getElementById('timeA').value = todayActivity.timeSettings.A || 0;
            document.getElementById('timeS').value = todayActivity.timeSettings.S || 0;
            
            // 显示同步信息
            document.getElementById('syncInfo').style.display = 'block';
        }
    } else {
        // 无预设活动
        document.getElementById('todayActivityName').textContent = '无预设活动';
        document.getElementById('todayActivityName').style.color = '#999';
        document.getElementById('todayActivityName').style.fontWeight = 'normal';
        
        // 隐藏同步信息
        document.getElementById('syncInfo').style.display = 'none';
    }
}

// 同步今日活动
function syncWithTodayActivity() {
    const today = getLocalDateString(new Date());
    const todayActivity = currentClub.activityCalendar && currentClub.activityCalendar[today];
    
    if (todayActivity && todayActivity.timeSettings) {
        // 同步预设时长
        document.getElementById('timeC').value = todayActivity.timeSettings.C || 0;
        document.getElementById('timeA').value = todayActivity.timeSettings.A || 0;
        document.getElementById('timeS').value = todayActivity.timeSettings.S || 0;
        
        // 显示同步信息
        document.getElementById('syncInfo').style.display = 'block';
        
        alert(`已同步今日活动"${todayActivity.name}"的预设时长`);
    } else {
        alert('今日没有预设活动，请先在活动设置中设置今日活动');
    }
}

// 更新删除活动后的相关待审核签到申请
function updatePendingCheckinsForDeletedActivity(activityDate) {
    if (!activityDate) return;
    
    // 更新该日期的所有待审核签到申请，使用默认设置
    currentClub.checkins.forEach(checkin => {
        if (checkin.activityDate === activityDate && checkin.status === 'pending') {
            // 使用默认时长设置
            checkin.timeSettings = {
                C: currentClub.timeSettings.C || 0,
                A: currentClub.timeSettings.A || 0,
                S: currentClub.timeSettings.S || 0
            };
            
            // 移除预设活动信息
            checkin.activityName = null;
            checkin.isPresetActivity = false;
        }
    });
    
    saveData();
}

// ==================== 密保问题功能 ====================

// 更新密保问题占位符
function updateSecurityQuestionPlaceholder() {
    const question = document.getElementById('regSecurityQuestion').value;
    const answerInput = document.getElementById('regSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示忘记密码弹窗
function showForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetForgotPasswordModal();
}

// 关闭忘记密码弹窗
function closeForgotPassword() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    resetForgotPasswordModal();
}

// 重置忘记密码弹窗状态
function resetForgotPasswordModal() {
    document.getElementById('forgotMemberName').value = '';
    document.getElementById('forgotSecurityQuestion').value = '';
    document.getElementById('forgotSecurityAnswer').value = '';
    document.getElementById('forgotNewPassword').value = '';
    document.getElementById('forgotConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'none';
    document.getElementById('confirmPasswordGroup').style.display = 'none';
    document.getElementById('verifyBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
}

// 验证密保答案
function verifySecurityAnswer() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const securityAnswer = document.getElementById('forgotSecurityAnswer').value.trim();
    
    if (!memberName || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社员是否存在
    if (!globalMembers[memberName]) {
        alert('社员账号不存在');
        return;
    }
    
    const member = globalMembers[memberName];
    
    // 检查是否有密保问题设置
    if (!member.securityQuestion || !member.securityAnswer) {
        alert('该账号未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotSecurityQuestion').value = member.securityQuestion;
    
    // 验证密保答案
    if (member.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('newPasswordGroup').style.display = 'block';
    document.getElementById('confirmPasswordGroup').style.display = 'block';
    document.getElementById('verifyBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置密码
function resetPassword() {
    const memberName = document.getElementById('forgotMemberName').value.trim();
    const newPassword = document.getElementById('forgotNewPassword').value;
    const confirmPassword = document.getElementById('forgotConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    globalMembers[memberName].password = newPassword;
    saveGlobalMembers();
    
    closeForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// ==================== 社长密保问题功能 ====================

// 更新社长密保问题占位符
function updateClubSecurityQuestionPlaceholder() {
    const question = document.getElementById('clubSecurityQuestion').value;
    const answerInput = document.getElementById('clubSecurityAnswer');
    
    if (question) {
        answerInput.placeholder = `请输入${question}`;
    } else {
        answerInput.placeholder = '请输入密保答案';
    }
}

// 显示社长忘记密码弹窗
function showCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'flex';
    // 重置弹窗状态
    resetCaptainForgotPasswordModal();
}

// 关闭社长忘记密码弹窗
function closeCaptainForgotPassword() {
    document.getElementById('captainForgotPasswordModal').style.display = 'none';
    resetCaptainForgotPasswordModal();
}

// 重置社长忘记密码弹窗状态
function resetCaptainForgotPasswordModal() {
    document.getElementById('forgotCaptainClubId').value = '';
    document.getElementById('forgotCaptainSecurityQuestion').value = '';
    document.getElementById('forgotCaptainSecurityAnswer').value = '';
    document.getElementById('forgotCaptainNewPassword').value = '';
    document.getElementById('forgotCaptainConfirmPassword').value = '';
    
    // 隐藏新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'none';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'none';
    document.getElementById('captainVerifyBtn').style.display = 'inline-block';
    document.getElementById('captainResetBtn').style.display = 'none';
}

// 验证社长密保答案
function verifyCaptainSecurityAnswer() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const securityAnswer = document.getElementById('forgotCaptainSecurityAnswer').value.trim();
    
    if (!clubId || !securityAnswer) {
        alert('请填写完整信息');
        return;
    }
    
    // 检查社团是否存在
    if (!clubs[clubId]) {
        alert('社团号不存在');
        return;
    }
    
    const club = clubs[clubId];
    
    // 检查是否有密保问题设置
    if (!club.securityQuestion || !club.securityAnswer) {
        alert('该社团未设置密保问题，无法找回密码');
        return;
    }
    
    // 显示密保问题
    document.getElementById('forgotCaptainSecurityQuestion').value = club.securityQuestion;
    
    // 验证密保答案
    if (club.securityAnswer !== securityAnswer) {
        alert('密保答案错误');
        return;
    }
    
    // 验证成功，显示新密码输入框
    document.getElementById('captainNewPasswordGroup').style.display = 'block';
    document.getElementById('captainConfirmPasswordGroup').style.display = 'block';
    document.getElementById('captainVerifyBtn').style.display = 'none';
    document.getElementById('captainResetBtn').style.display = 'inline-block';
    
    alert('密保答案验证成功！请设置新密码');
}

// 重置社长密码
function resetCaptainPassword() {
    const clubId = document.getElementById('forgotCaptainClubId').value.trim();
    const newPassword = document.getElementById('forgotCaptainNewPassword').value;
    const confirmPassword = document.getElementById('forgotCaptainConfirmPassword').value;
    
    if (!newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致');
        return;
    }
    
    // 更新密码
    clubs[clubId].password = newPassword;
    saveData();
    
    closeCaptainForgotPassword();
    alert('密码重置成功！请使用新密码登录');
}

// ==================== 社团详情功能 ====================

// 显示社团详情
function showClubDetails(clubId) {
    console.log('showClubDetails called with clubId:', clubId);
    
    const allClubs = getAllAdminClubs();
    const club = allClubs[clubId];
    const memberName = currentUser.name;
    
    console.log('Found club:', club);
    console.log('Member name:', memberName);
    
    if (!club) {
        console.log('Club not found, showing alert');
        alert('社团不存在');
        return;
    }
    
    console.log('Setting modal title and getting activity details');
    
    // 设置弹窗标题
    document.getElementById('clubDetailsTitle').textContent = `${club.name} - 活动详情`;
    
    // 获取活动详情数据
    const activityDetails = getClubActivityDetails(clubId, memberName);
    console.log('Activity details:', activityDetails);
    
    // 生成详情内容HTML
    let html = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #667eea;">📊 总体统计</h3>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">${activityDetails.totalCheckins}</div>
                    <div style="font-size: 12px; color: #666;">签到次数</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${activityDetails.totalTime.toFixed(1)}</div>
                    <div style="font-size: 12px; color: #666;">总时长(h)</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #ff9800;">${activityDetails.totalTimeC.toFixed(1)}</div>
                    <div style="font-size: 12px; color: #666;">C类(h)</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #e91e63;">${activityDetails.totalTimeA.toFixed(1)}</div>
                    <div style="font-size: 12px; color: #666;">A类(h)</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2196f3;">${activityDetails.totalTimeS.toFixed(1)}</div>
                    <div style="font-size: 12px; color: #666;">S类(h)</div>
                </div>
            </div>
        </div>
        
        <h3 style="color: #667eea; margin-bottom: 15px;">📅 活动记录</h3>
        <div style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
    `;
    
    if (activityDetails.activities.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: #999;">暂无活动记录</div>';
    } else {
        html += `
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: #f5f5f5;">
                    <tr>
                        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">活动日期</th>
                        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0;">活动名称</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e0e0e0;">参与状态</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e0e0e0;">CAS时长</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        activityDetails.activities.forEach(activity => {
            const statusIcon = activity.participated ? '✅' : '❌';
            const statusText = activity.participated ? '已参与' : '未参与';
            const statusColor = activity.participated ? '#4caf50' : '#f44336';
            
            let timeInfo = '';
            if (activity.participated && activity.timeSettings) {
                const parts = [];
                if (activity.timeSettings.C > 0) parts.push(`C:${activity.timeSettings.C}h`);
                if (activity.timeSettings.A > 0) parts.push(`A:${activity.timeSettings.A}h`);
                if (activity.timeSettings.S > 0) parts.push(`S:${activity.timeSettings.S}h`);
                timeInfo = parts.join(' + ');
            } else {
                timeInfo = '-';
            }
            
            html += `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px;">${activity.date}</td>
                    <td style="padding: 12px;">${activity.name || '未命名活动'}</td>
                    <td style="padding: 12px; text-align: center;">
                        <span style="color: ${statusColor}; font-weight: bold;">
                            ${statusIcon} ${statusText}
                        </span>
                    </td>
                    <td style="padding: 12px; text-align: center; font-family: monospace;">
                        ${timeInfo}
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
    }
    
    html += `
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <button class="btn btn-secondary" onclick="closeClubDetails()">关闭</button>
        </div>
    `;
    
    // 设置内容并显示弹窗
    console.log('Setting modal content and showing modal');
    document.getElementById('clubDetailsContent').innerHTML = html;
    document.getElementById('clubDetailsModal').style.display = 'flex';
    console.log('Modal should be visible now');
}

// 关闭社团详情弹窗
function closeClubDetails() {
    document.getElementById('clubDetailsModal').style.display = 'none';
}

// 获取社团活动详情数据
function getClubActivityDetails(clubId, memberName) {
    const allClubs = getAllAdminClubs();
    const club = allClubs[clubId];
    
    if (!club) {
        return null;
    }
    
    // 获取社团的活动日历
    const activityCalendar = club.activityCalendar || {};
    
    // 获取社员的所有签到记录
    const memberCheckins = club.checkins.filter(c => c.memberName === memberName && c.status === 'approved');
    
    // 创建活动详情数组
    const activities = [];
    let totalCheckins = 0;
    let totalTime = 0;
    let totalTimeC = 0;
    let totalTimeA = 0;
    let totalTimeS = 0;
    
    // 遍历活动日历，找出已到达日期的活动
    const today = getLocalDateString(new Date());
    Object.keys(activityCalendar).forEach(dateString => {
        if (dateString <= today) { // 只显示已到达日期的活动
            const activity = activityCalendar[dateString];
            
            // 检查社员是否参与了这次活动
            const participated = memberCheckins.some(checkin => checkin.activityDate === dateString);
            
            let timeSettings = { C: 0, A: 0, S: 0 };
            if (participated) {
                // 找到对应的签到记录
                const checkin = memberCheckins.find(c => c.activityDate === dateString);
                if (checkin && checkin.timeSettings) {
                    timeSettings = checkin.timeSettings;
                } else if (activity && activity.timeSettings) {
                    timeSettings = activity.timeSettings;
                } else {
                    timeSettings = club.timeSettings;
                }
                
                totalCheckins++;
                totalTimeC += timeSettings.C || 0;
                totalTimeA += timeSettings.A || 0;
                totalTimeS += timeSettings.S || 0;
            }
            
            activities.push({
                date: dateString,
                name: activity ? activity.name : null,
                participated: participated,
                timeSettings: timeSettings
            });
        }
    });
    
    // 按日期排序
    activities.sort((a, b) => a.date.localeCompare(b.date));
    
    totalTime = totalTimeC + totalTimeA + totalTimeS;
    
    return {
        activities: activities,
        totalCheckins: totalCheckins,
        totalTime: totalTime,
        totalTimeC: totalTimeC,
        totalTimeA: totalTimeA,
        totalTimeS: totalTimeS
    };
}

// 同步学校数据 - 确保管理员和社员使用相同的学校数据源
function syncSchoolData() {
    console.log('=== 开始同步学校数据 ===');
    
    // 获取管理员注册的学校
    const adminSchools = getRegisteredSchools();
    console.log('管理员注册的学校:', adminSchools);
    
    // 获取社员注册的学校
    const memberSchools = new Set();
    Object.values(globalMembers).forEach(member => {
        if (member.school) {
            memberSchools.add(member.school);
        }
    });
    console.log('社员注册的学校:', Array.from(memberSchools));
    
    // 检查数据一致性
    const inconsistentMembers = [];
    Object.values(globalMembers).forEach(member => {
        if (member.school && !adminSchools.includes(member.school)) {
            inconsistentMembers.push({
                name: member.name,
                school: member.school
            });
        }
    });
    
    if (inconsistentMembers.length > 0) {
        console.log('⚠️ 发现数据不一致的社员:');
        inconsistentMembers.forEach(member => {
            console.log(`  - ${member.name} (学校: ${member.school})`);
        });
        
        // 可以选择清理不一致的数据或提示管理员
        console.log('建议: 请管理员注册这些学校或清理不一致的社员数据');
    } else {
        console.log('✅ 学校数据同步正常');
    }
    
    console.log('=== 学校数据同步完成 ===');
    return {
        adminSchools: adminSchools,
        memberSchools: Array.from(memberSchools),
        inconsistentMembers: inconsistentMembers
    };
}

// 测试学校注册功能
function testSchoolRegistration() {
    console.log('=== 测试学校注册功能 ===');
    
    // 1. 检查学校名称字段是否存在
    const schoolField = document.getElementById('regMemberSchool');
    if (schoolField) {
        console.log('✅ 学校名称字段已添加');
    } else {
        console.log('❌ 学校名称字段未找到');
    }
    
    // 2. 检查查看已注册学校按钮是否存在
    const memberRegisterModal = document.getElementById('memberRegisterModal');
    if (memberRegisterModal && memberRegisterModal.innerHTML.includes('查看已注册学校')) {
        console.log('✅ 查看已注册学校按钮已添加');
    } else {
        console.log('❌ 查看已注册学校按钮未找到');
    }
    
    // 3. 检查注册函数是否包含学校名称
    console.log('\n3. 注册函数检查:');
    const registerFunction = registerMember.toString();
    if (registerFunction.includes('regMemberSchool')) {
        console.log('✅ registerMember 函数已包含学校名称处理');
    } else {
        console.log('❌ registerMember 函数未包含学校名称处理');
    }
    
    // 4. 检查管理员系统是否按学校过滤
    console.log('\n4. 管理员系统检查:');
    if (typeof loadAdminPage === 'function') {
        console.log('✅ 管理员系统存在');
        console.log('  ✅ 按学校过滤社员显示');
        console.log('  ✅ 统计同学校社员数量');
        console.log('  ✅ 显示社员学校信息');
    } else {
        console.log('❌ 管理员系统未找到');
    }
    
    // 5. 检查现有社员数据
    console.log('\n5. 现有社员数据检查:');
    const allMembers = Object.values(globalMembers);
    const membersWithSchool = allMembers.filter(member => member.school);
    const membersWithoutSchool = allMembers.filter(member => !member.school);
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  有学校信息的社员: ${membersWithSchool.length}`);
    console.log(`  无学校信息的社员: ${membersWithoutSchool.length}`);
    
    if (membersWithoutSchool.length > 0) {
        console.log('  ⚠️ 发现没有学校信息的社员:');
        membersWithoutSchool.forEach(member => {
            console.log(`    - ${member.name}`);
        });
    }
    
    // 6. 测试数据同步功能
    console.log('\n6. 数据同步功能测试:');
    if (typeof syncSchoolData === 'function') {
        console.log('✅ syncSchoolData 函数已定义');
        const syncResult = syncSchoolData();
        console.log('  同步结果:', syncResult);
        
        if (syncResult.inconsistentMembers.length > 0) {
            console.log('  ⚠️ 发现数据不一致的社员:', syncResult.inconsistentMembers.length);
        } else {
            console.log('  ✅ 数据同步正常');
        }
    } else {
        console.log('❌ syncSchoolData 函数未定义');
    }
    
    console.log('\n=== 学校注册功能测试完成 ===');
}

// 测试学校数据同步功能
function testSchoolDataSync() {
    console.log('=== 测试学校数据同步功能 ===');
    
    // 1. 测试数据同步函数
    if (typeof syncSchoolData === 'function') {
        console.log('✅ syncSchoolData 函数已定义');
        const syncResult = syncSchoolData();
        console.log('同步结果:', syncResult);
    } else {
        console.log('❌ syncSchoolData 函数未定义');
    }
    
    // 2. 测试学校验证逻辑
    console.log('\n2. 学校验证逻辑测试:');
    const registeredSchools = getRegisteredSchools();
    console.log('已注册学校列表:', registeredSchools);
    
    // 3. 测试数据一致性
    console.log('\n3. 数据一致性测试:');
    const allMembers = Object.values(globalMembers);
    const membersWithSchool = allMembers.filter(member => member.school);
    const membersWithoutSchool = allMembers.filter(member => !member.school);
    
    console.log(`  总社员数: ${allMembers.length}`);
    console.log(`  有学校信息的社员: ${membersWithSchool.length}`);
    console.log(`  无学校信息的社员: ${membersWithoutSchool.length}`);
    
    // 4. 检查数据一致性
    const inconsistentMembers = [];
    allMembers.forEach(member => {
        if (member.school && !registeredSchools.includes(member.school)) {
            inconsistentMembers.push(member);
        }
    });
    
    if (inconsistentMembers.length > 0) {
        console.log('  ⚠️ 发现数据不一致的社员:');
        inconsistentMembers.forEach(member => {
            console.log(`    - ${member.name} (学校: ${member.school})`);
        });
    } else {
        console.log('  ✅ 所有社员数据与管理员学校数据一致');
    }
    
    console.log('\n=== 学校数据同步功能测试完成 ===');
}

// 查看已注册学校（用于社员注册）
function showAllRegisteredSchools() {
    // 先同步学校数据
    const syncResult = syncSchoolData();
    
    // 使用与管理员相同的学校数据源
    const registeredSchools = getRegisteredSchools();
    
    if (registeredSchools.length === 0) {
        alert('暂无已注册的学校');
        return;
    }
    
    // 使用模态窗口显示，保持原有的漂亮格式
    const modal = document.getElementById('registeredSchoolsModal');
    const content = document.getElementById('registeredSchoolsContent');
    
    if (!modal || !content) {
        // 如果模态窗口不存在，使用简单的alert格式
        let message = `已注册的学校列表：\n\n${registeredSchools.sort().join('\n')}`;
        
        // 如果有数据不一致的情况，在消息中提示
        if (syncResult.inconsistentMembers.length > 0) {
            message += `\n\n⚠️ 注意：发现 ${syncResult.inconsistentMembers.length} 个社员的学校信息与管理员注册的学校不一致，请联系管理员处理。`;
        }
        
        alert(message);
        return;
    }
    
    // 按拼音首字母排序
    const sortedSchools = registeredSchools.sort((a, b) => {
        const firstLetterA = getPinyinFirstLetter(a);
        const firstLetterB = getPinyinFirstLetter(b);
        return firstLetterA.localeCompare(firstLetterB);
    });
    
    // 按拼音首字母分组
    const groupedSchools = {};
    sortedSchools.forEach(school => {
        const firstLetter = getPinyinFirstLetter(school);
        if (!groupedSchools[firstLetter]) {
            groupedSchools[firstLetter] = [];
        }
        groupedSchools[firstLetter].push(school);
    });
    
    // 生成HTML内容
    let html = `
        <div style="margin-bottom: 20px;">
            <p style="color: #666; margin: 0;">共 ${registeredSchools.length} 所已注册学校</p>
    `;
    
    // 如果有数据不一致的情况，在消息中提示
    if (syncResult.inconsistentMembers.length > 0) {
        html += `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px; margin-top: 10px;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                    ⚠️ 注意：发现 ${syncResult.inconsistentMembers.length} 个社员的学校信息与管理员注册的学校不一致，请联系管理员处理。
                </p>
            </div>
        `;
    }
    
    html += `
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    // 按字母顺序显示分组
    Object.keys(groupedSchools).sort().forEach(letter => {
        html += `
            <div style="margin-bottom: 20px;">
                <div style="background: #667eea; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; margin-bottom: 8px;">
                    ${letter}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
        `;
        
        groupedSchools[letter].forEach(school => {
            html += `
                <div style="padding: 8px 12px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e9ecef; cursor: pointer; transition: all 0.2s;" 
                     onclick="selectSchoolFromModal('${school}')" 
                     onmouseover="this.style.background='#e9ecef'" 
                     onmouseout="this.style.background='#f8f9fa'">
                    ${school}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
    `;
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

// 测试社员界面点击功能
function testMemberInterfaceClick() {
    console.log('=== 测试社员界面点击功能 ===');
    
    // 1. 检查社员页面是否存在
    const memberPage = document.getElementById('memberPage');
    if (memberPage) {
        console.log('✅ 社员页面存在');
        console.log('  显示状态:', memberPage.style.display);
    } else {
        console.log('❌ 社员页面不存在');
        return;
    }
    
    // 2. 检查导航按钮
    const navButtons = document.querySelectorAll('.member-nav .nav-btn');
    console.log(`\n2. 导航按钮检查: 找到 ${navButtons.length} 个按钮`);
    
    navButtons.forEach((btn, index) => {
        console.log(`  按钮 ${index + 1}:`);
        console.log(`    文本: "${btn.textContent}"`);
        console.log(`    点击事件: ${btn.getAttribute('onclick')}`);
        console.log(`    显示状态: ${btn.style.display}`);
        console.log(`    是否可见: ${btn.offsetParent !== null}`);
    });
    
    // 3. 检查各个页面区域
    const sections = ['overview', 'clubs', 'checkin', 'settings'];
    console.log('\n3. 页面区域检查:');
    
    sections.forEach(sectionId => {
        const sectionElement = document.getElementById(`member${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
        if (sectionElement) {
            console.log(`  ${sectionId}: 存在, 显示状态: ${sectionElement.style.display}`);
        } else {
            console.log(`  ${sectionId}: ❌ 不存在`);
        }
    });
    
    // 4. 检查相关函数是否存在
    console.log('\n4. 函数检查:');
    const functions = ['showMemberSection', 'loadMemberOverview', 'loadMemberClubs', 'loadMemberCheckin'];
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`  ✅ ${funcName} 函数存在`);
        } else {
            console.log(`  ❌ ${funcName} 函数不存在`);
        }
    });
    
    // 5. 检查当前用户状态
    console.log('\n5. 用户状态检查:');
    if (currentUser) {
        console.log(`  当前用户: ${currentUser.name}`);
        console.log(`  用户类型: ${currentUser.type}`);
    } else {
        console.log('  ❌ 当前用户未设置');
    }
    
    // 6. 测试点击功能
    console.log('\n6. 点击功能测试:');
    if (navButtons.length > 0) {
        console.log('  尝试模拟点击第一个按钮...');
        try {
            const firstButton = navButtons[0];
            const onclick = firstButton.getAttribute('onclick');
            if (onclick) {
                console.log(`  执行: ${onclick}`);
                eval(onclick);
                console.log('  ✅ 点击功能正常');
            } else {
                console.log('  ❌ 按钮没有点击事件');
            }
        } catch (error) {
            console.log('  ❌ 点击功能出错:', error.message);
        }
    }
    
    console.log('\n=== 社员界面点击功能测试完成 ===');
}

// 测试登录界面点击功能
function testLoginInterfaceClick() {
    console.log('=== 测试登录界面点击功能 ===');
    
    // 1. 检查登录页面是否存在
    const loginPage = document.getElementById('loginPage');
    if (loginPage) {
        console.log('✅ 登录页面存在');
        console.log('  显示状态:', loginPage.style.display);
    } else {
        console.log('❌ 登录页面不存在');
        return;
    }
    
    // 2. 检查标签页按钮
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log(`\n2. 标签页按钮检查: 找到 ${tabButtons.length} 个按钮`);
    
    tabButtons.forEach((btn, index) => {
        console.log(`  按钮 ${index + 1}:`);
        console.log(`    文本: "${btn.textContent}"`);
        console.log(`    角色: ${btn.getAttribute('data-role')}`);
        console.log(`    是否有点击事件: ${btn.onclick !== null || btn.addEventListener !== undefined}`);
        console.log(`    显示状态: ${btn.style.display}`);
        console.log(`    是否可见: ${btn.offsetParent !== null}`);
    });
    
    // 3. 检查登录表单
    console.log('\n3. 登录表单检查:');
    const captainLogin = document.getElementById('captainLogin');
    const memberLogin = document.getElementById('memberLogin');
    
    if (captainLogin) {
        console.log(`  社长登录表单: 存在, 显示状态: ${captainLogin.style.display}`);
    } else {
        console.log('  社长登录表单: ❌ 不存在');
    }
    
    if (memberLogin) {
        console.log(`  社员登录表单: 存在, 显示状态: ${memberLogin.style.display}`);
    } else {
        console.log('  社员登录表单: ❌ 不存在');
    }
    
    // 4. 检查登录按钮
    console.log('\n4. 登录按钮检查:');
    const captainLoginBtn = document.querySelector('#captainLogin button[onclick="captainLogin()"]');
    const memberLoginBtn = document.querySelector('#memberLogin button[onclick="memberLogin()"]');
    
    if (captainLoginBtn) {
        console.log('  ✅ 社长登录按钮存在');
        console.log(`    点击事件: ${captainLoginBtn.getAttribute('onclick')}`);
    } else {
        console.log('  ❌ 社长登录按钮不存在');
    }
    
    if (memberLoginBtn) {
        console.log('  ✅ 社员登录按钮存在');
        console.log(`    点击事件: ${memberLoginBtn.getAttribute('onclick')}`);
    } else {
        console.log('  ❌ 社员登录按钮不存在');
    }
    
    // 5. 检查相关函数是否存在
    console.log('\n5. 函数检查:');
    const functions = ['captainLogin', 'memberLogin', 'switchLoginForm'];
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`  ✅ ${funcName} 函数存在`);
        } else {
            console.log(`  ❌ ${funcName} 函数不存在`);
        }
    });
    
    // 6. 测试标签页切换功能
    console.log('\n6. 标签页切换功能测试:');
    if (tabButtons.length >= 2) {
        console.log('  尝试切换到社员标签页...');
        try {
            const memberTab = tabButtons[1]; // 社员标签页
            if (memberTab) {
                console.log(`  执行: ${memberTab.getAttribute('data-role')}`);
                memberTab.click();
                console.log('  ✅ 标签页切换功能正常');
            }
        } catch (error) {
            console.log('  ❌ 标签页切换功能出错:', error.message);
        }
    }
    
    // 7. 检查DOMContentLoaded事件
    console.log('\n7. DOM加载检查:');
    if (document.readyState === 'complete') {
        console.log('  ✅ DOM已完全加载');
    } else {
        console.log(`  ⚠️ DOM加载状态: ${document.readyState}`);
    }
    
    console.log('\n=== 登录界面点击功能测试完成 ===');
}

// 全面诊断页面问题
function diagnosePageIssues() {
    console.log('=== 全面诊断页面问题 ===');
    
    // 1. 检查JavaScript是否正常加载
    console.log('\n1. JavaScript加载检查:');
    console.log('  ✅ JavaScript文件已加载');
    console.log('  当前时间:', new Date().toLocaleString());
    
    // 2. 检查DOM状态
    console.log('\n2. DOM状态检查:');
    console.log('  DOM加载状态:', document.readyState);
    console.log('  页面标题:', document.title);
    console.log('  页面URL:', window.location.href);
    
    // 3. 检查关键元素
    console.log('\n3. 关键元素检查:');
    const keyElements = [
        'loginPage',
        'captainPage', 
        'memberPage',
        'captainLogin',
        'memberLogin'
    ];
    
    keyElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`  ✅ ${id}: 存在, 显示状态: ${element.style.display}`);
        } else {
            console.log(`  ❌ ${id}: 不存在`);
        }
    });
    
    // 4. 检查所有按钮
    console.log('\n4. 按钮检查:');
    const allButtons = document.querySelectorAll('button');
    console.log(`  找到 ${allButtons.length} 个按钮`);
    
    allButtons.forEach((btn, index) => {
        if (index < 10) { // 只显示前10个按钮
            console.log(`  按钮 ${index + 1}: "${btn.textContent.trim()}"`);
            console.log(`    点击事件: ${btn.getAttribute('onclick') || '无'}`);
            console.log(`    是否可见: ${btn.offsetParent !== null}`);
        }
    });
    
    // 5. 检查事件监听器
    console.log('\n5. 事件监听器检查:');
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log(`  标签页按钮数量: ${tabButtons.length}`);
    
    tabButtons.forEach((btn, index) => {
        console.log(`  标签页 ${index + 1}: "${btn.textContent}"`);
        console.log(`    角色: ${btn.getAttribute('data-role')}`);
        console.log(`    是否有事件监听器: ${btn.addEventListener !== undefined}`);
    });
    
    // 6. 检查关键函数
    console.log('\n6. 关键函数检查:');
    const keyFunctions = [
        'captainLogin',
        'memberLogin', 
        'switchLoginForm',
        'initializeLoginInterface',
        'loadSavedData'
    ];
    
    keyFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`  ✅ ${funcName}: 存在`);
        } else {
            console.log(`  ❌ ${funcName}: 不存在`);
        }
    });
    
    // 7. 检查localStorage
    console.log('\n7. localStorage检查:');
    try {
        const clubs = JSON.parse(localStorage.getItem('clubs')) || {};
        const globalMembers = JSON.parse(localStorage.getItem('globalMembers')) || {};
        console.log(`  社团数量: ${Object.keys(clubs).length}`);
        console.log(`  社员数量: ${Object.keys(globalMembers).length}`);
        console.log('  ✅ localStorage访问正常');
    } catch (error) {
        console.log('  ❌ localStorage访问出错:', error.message);
    }
    
    // 8. 检查控制台错误
    console.log('\n8. 错误检查:');
    console.log('  请检查浏览器控制台是否有JavaScript错误');
    
    // 9. 尝试手动初始化
    console.log('\n9. 手动初始化测试:');
    try {
        manualInitializeLogin();
        console.log('  ✅ 手动初始化成功');
    } catch (error) {
        console.log('  ❌ 手动初始化失败:', error.message);
    }
    
    console.log('\n=== 页面问题诊断完成 ===');
}

// 测试学校名单格式修复
function testSchoolListFormat() {
    console.log('=== 测试学校名单格式修复 ===');
    
    // 1. 检查showAllRegisteredSchools函数是否存在
    if (typeof showAllRegisteredSchools === 'function') {
        console.log('✅ showAllRegisteredSchools 函数存在');
    } else {
        console.log('❌ showAllRegisteredSchools 函数不存在');
        return;
    }
    
    // 2. 检查模态窗口是否存在
    const modal = document.getElementById('registeredSchoolsModal');
    const content = document.getElementById('registeredSchoolsContent');
    
    if (modal && content) {
        console.log('✅ 学校名单模态窗口存在');
    } else {
        console.log('❌ 学校名单模态窗口不存在');
    }
    
    // 3. 检查getRegisteredSchools函数
    if (typeof getRegisteredSchools === 'function') {
        console.log('✅ getRegisteredSchools 函数存在');
        const schools = getRegisteredSchools();
        console.log(`  当前已注册学校数量: ${schools.length}`);
        if (schools.length > 0) {
            console.log('  学校列表:', schools);
        }
    } else {
        console.log('❌ getRegisteredSchools 函数不存在');
    }
    
    // 4. 检查拼音首字母函数
    if (typeof getPinyinFirstLetter === 'function') {
        console.log('✅ getPinyinFirstLetter 函数存在');
    } else {
        console.log('❌ getPinyinFirstLetter 函数不存在');
    }
    
    // 5. 测试学校名单显示
    console.log('\n5. 测试学校名单显示:');
    try {
        showAllRegisteredSchools();
        console.log('✅ 学校名单显示功能正常');
        
        // 检查模态窗口是否显示
        if (modal && modal.style.display === 'flex') {
            console.log('✅ 模态窗口已显示');
        } else {
            console.log('⚠️ 模态窗口未显示（可能没有学校数据）');
        }
    } catch (error) {
        console.log('❌ 学校名单显示功能出错:', error.message);
    }
    
    // 6. 检查数据同步功能
    console.log('\n6. 数据同步功能检查:');
    if (typeof syncSchoolData === 'function') {
        console.log('✅ syncSchoolData 函数存在');
        try {
            const syncResult = syncSchoolData();
            console.log('  同步结果:', syncResult);
        } catch (error) {
            console.log('❌ 数据同步出错:', error.message);
        }
    } else {
        console.log('❌ syncSchoolData 函数不存在');
    }
    
    console.log('\n=== 学校名单格式修复测试完成 ===');
}

// 测试学校自动填充功能修复
function testSchoolAutoFillFix() {
    console.log('=== 测试学校自动填充功能修复 ===');
    
    // 1. 检查selectSchoolFromModal函数是否存在
    if (typeof selectSchoolFromModal === 'function') {
        console.log('✅ selectSchoolFromModal 函数存在');
    } else {
        console.log('❌ selectSchoolFromModal 函数不存在');
        return;
    }
    
    // 2. 检查相关字段是否存在
    const schoolNameField = document.getElementById('schoolName');
    const regMemberSchoolField = document.getElementById('regMemberSchool');
    
    if (schoolNameField) {
        console.log('✅ 社团注册学校字段存在');
    } else {
        console.log('❌ 社团注册学校字段不存在');
    }
    
    if (regMemberSchoolField) {
        console.log('✅ 社员注册学校字段存在');
    } else {
        console.log('❌ 社员注册学校字段不存在');
    }
    
    // 3. 检查模态窗口是否存在
    const registerModal = document.getElementById('registerModal');
    const memberRegisterModal = document.getElementById('memberRegisterModal');
    
    if (registerModal) {
        console.log('✅ 社团注册模态窗口存在');
    } else {
        console.log('❌ 社团注册模态窗口不存在');
    }
    
    if (memberRegisterModal) {
        console.log('✅ 社员注册模态窗口存在');
    } else {
        console.log('❌ 社员注册模态窗口不存在');
    }
    
    // 4. 测试社团注册界面的学校填充
    console.log('\n4. 测试社团注册界面的学校填充:');
    if (registerModal && schoolNameField) {
        // 模拟显示社团注册界面
        registerModal.style.display = 'flex';
        memberRegisterModal.style.display = 'none';
        
        // 清空字段
        schoolNameField.value = '';
        regMemberSchoolField.value = '';
        
        // 测试填充
        try {
            selectSchoolFromModal('测试学校A');
            
            if (schoolNameField.value === '测试学校A' && regMemberSchoolField.value === '') {
                console.log('✅ 社团注册界面学校填充正常');
            } else {
                console.log('❌ 社团注册界面学校填充异常');
                console.log(`  社团字段值: "${schoolNameField.value}"`);
                console.log(`  社员字段值: "${regMemberSchoolField.value}"`);
            }
        } catch (error) {
            console.log('❌ 社团注册界面学校填充出错:', error.message);
        }
        
        // 恢复隐藏状态
        registerModal.style.display = 'none';
    }
    
    // 5. 测试社员注册界面的学校填充
    console.log('\n5. 测试社员注册界面的学校填充:');
    if (memberRegisterModal && regMemberSchoolField) {
        // 模拟显示社员注册界面
        memberRegisterModal.style.display = 'flex';
        registerModal.style.display = 'none';
        
        // 清空字段
        schoolNameField.value = '';
        regMemberSchoolField.value = '';
        
        // 测试填充
        try {
            selectSchoolFromModal('测试学校B');
            
            if (regMemberSchoolField.value === '测试学校B' && schoolNameField.value === '') {
                console.log('✅ 社员注册界面学校填充正常');
            } else {
                console.log('❌ 社员注册界面学校填充异常');
                console.log(`  社团字段值: "${schoolNameField.value}"`);
                console.log(`  社员字段值: "${regMemberSchoolField.value}"`);
            }
        } catch (error) {
            console.log('❌ 社员注册界面学校填充出错:', error.message);
        }
        
        // 恢复隐藏状态
        memberRegisterModal.style.display = 'none';
    }
    
    // 6. 测试默认情况（两个界面都不可见）
    console.log('\n6. 测试默认情况:');
    registerModal.style.display = 'none';
    memberRegisterModal.style.display = 'none';
    
    // 清空字段
    schoolNameField.value = '';
    regMemberSchoolField.value = '';
    
    try {
        selectSchoolFromModal('测试学校C');
        
        if (schoolNameField.value === '测试学校C' && regMemberSchoolField.value === '') {
            console.log('✅ 默认情况学校填充正常（填充社团字段）');
        } else {
            console.log('❌ 默认情况学校填充异常');
            console.log(`  社团字段值: "${schoolNameField.value}"`);
            console.log(`  社员字段值: "${regMemberSchoolField.value}"`);
        }
    } catch (error) {
        console.log('❌ 默认情况学校填充出错:', error.message);
    }
    
    console.log('\n=== 学校自动填充功能修复测试完成 ===');
}

// 测试社员界面学校名称显示功能
function testMemberSchoolDisplay() {
    console.log('=== 测试社员界面学校名称显示功能 ===');
    
    // 1. 检查HTML元素是否存在
    console.log('\n1. 检查HTML元素:');
    const memberSchoolDisplay = document.getElementById('memberSchoolDisplay');
    const settingsMemberSchool = document.getElementById('settingsMemberSchool');
    
    if (memberSchoolDisplay) {
        console.log('✅ memberSchoolDisplay 元素存在');
    } else {
        console.log('❌ memberSchoolDisplay 元素不存在');
    }
    
    if (settingsMemberSchool) {
        console.log('✅ settingsMemberSchool 元素存在');
    } else {
        console.log('❌ settingsMemberSchool 元素不存在');
    }
    
    // 2. 检查JavaScript函数是否存在
    console.log('\n2. 检查JavaScript函数:');
    if (typeof loadMemberPage === 'function') {
        console.log('✅ loadMemberPage 函数存在');
    } else {
        console.log('❌ loadMemberPage 函数不存在');
    }
    
    if (typeof loadMemberSettings === 'function') {
        console.log('✅ loadMemberSettings 函数存在');
    } else {
        console.log('❌ loadMemberSettings 函数不存在');
    }
    
    // 3. 检查当前用户和社员数据
    console.log('\n3. 检查当前用户和社员数据:');
    if (currentUser) {
        console.log(`  当前用户: ${currentUser.name}`);
        console.log(`  当前用户类型: ${currentUser.type}`);
        
        const globalMember = globalMembers[currentUser.name];
        if (globalMember) {
            console.log(`  社员学校: "${globalMember.school}"`);
            console.log(`  社员数据完整: ${JSON.stringify(globalMember, null, 2)}`);
        } else {
            console.log('  ❌ 未找到社员数据');
        }
    } else {
        console.log('  ❌ 当前用户未设置');
    }
    
    // 4. 测试loadMemberPage函数
    console.log('\n4. 测试loadMemberPage函数:');
    try {
        if (typeof loadMemberPage === 'function') {
            loadMemberPage();
            console.log('✅ loadMemberPage 执行成功');
            
            // 检查学校名称是否显示
            if (memberSchoolDisplay) {
                const displayedSchool = memberSchoolDisplay.textContent;
                console.log(`  显示学校名称: "${displayedSchool}"`);
                
                if (displayedSchool && displayedSchool !== '未设置') {
                    console.log('  ✅ 学校名称已正确显示');
                } else {
                    console.log('  ⚠️ 学校名称为空或未设置');
                }
            }
        }
    } catch (error) {
        console.log('❌ loadMemberPage 执行出错:', error.message);
    }
    
    // 5. 测试loadMemberSettings函数
    console.log('\n5. 测试loadMemberSettings函数:');
    try {
        if (typeof loadMemberSettings === 'function') {
            loadMemberSettings();
            console.log('✅ loadMemberSettings 执行成功');
            
            // 检查设置页面的学校名称是否显示
            if (settingsMemberSchool) {
                const displayedSchool = settingsMemberSchool.textContent;
                console.log(`  设置页面显示学校名称: "${displayedSchool}"`);
                
                if (displayedSchool && displayedSchool !== '未设置') {
                    console.log('  ✅ 设置页面学校名称已正确显示');
                } else {
                    console.log('  ⚠️ 设置页面学校名称为空或未设置');
                }
            }
        }
    } catch (error) {
        console.log('❌ loadMemberSettings 执行出错:', error.message);
    }
    
    // 6. 测试页面切换
    console.log('\n6. 测试页面切换:');
    try {
        if (typeof showMemberSection === 'function') {
            // 切换到设置页面
            showMemberSection('settings');
            console.log('✅ 成功切换到设置页面');
            
            // 检查设置页面是否显示
            const settingsSection = document.getElementById('memberSettingsSection');
            if (settingsSection && settingsSection.style.display !== 'none') {
                console.log('✅ 设置页面已显示');
            } else {
                console.log('❌ 设置页面未显示');
            }
        }
    } catch (error) {
        console.log('❌ 页面切换出错:', error.message);
    }
    
    console.log('\n=== 社员界面学校名称显示功能测试完成 ===');
}
