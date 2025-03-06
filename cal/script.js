/**
 * 口算题生成器 - 主入口文件
 */

// 页面加载时的初始化
window.onload = function() {
    console.log('页面开始加载...');
    try {
        // 初始化事件监听器
        initializeEventListeners();
        loadSettings();
        
        // 恢复列设置的展开状态
        const isExpanded = localStorage.getItem('columnSettingsExpanded') === 'true';
        const columnSettings = document.querySelector('.column-settings-row');
        const toggleBtn = document.getElementById('toggleColumnBtn');
        
        if (isExpanded) {
            columnSettings.style.display = 'flex';
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i>隐藏每列设置';
        } else {
            columnSettings.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i>每列详情设置';
        }
        
        // 初始生成题目
        generateQuestions();
    } catch (error) {
        console.error('页面加载出错:', error);
    }
};