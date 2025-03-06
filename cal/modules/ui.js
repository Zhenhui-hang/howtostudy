/**
 * 口算题生成器 - UI操作模块
 */

function applyGlobalSettingsToPanel(globalSettings) {
    const globalPanel = document.querySelector('#settingsGlobal');
    if (!globalPanel) return;

    // 设置运算类型和相关显示
    const operationType = globalPanel.querySelector('.operation-type');
    operationType.value = globalSettings.operationType;
    
    // 根据运算类型显示相应的设置
    if (globalSettings.operationType === 'compare') {
        // 显示大小比较设置，隐藏其他设置
        const compareSettings = globalPanel.querySelector('.compare-settings');
        const dRange = globalPanel.querySelector('.d-range');
        const secondOperator = globalPanel.querySelector('.second-operator');
        
        if (compareSettings) compareSettings.style.display = 'block';
        if (dRange) dRange.style.display = 'none';
        if (secondOperator) secondOperator.style.display = 'none';

        // 应用大小比较设置
        if (globalSettings.compareSettings) {
            // 设置左右类型选择
            globalPanel.querySelectorAll('.left-type').forEach(cb => {
                cb.checked = globalSettings.compareSettings.leftTypes.includes(cb.value);
            });
            globalPanel.querySelectorAll('.right-type').forEach(cb => {
                cb.checked = globalSettings.compareSettings.rightTypes.includes(cb.value);
            });

            // 设置左侧范围
            const leftRanges = globalSettings.compareSettings.leftRanges;
            if (leftRanges) {
                if (leftRanges.a) {
                    globalPanel.querySelector('.left-min-a').value = leftRanges.a.min;
                    globalPanel.querySelector('.left-max-a').value = leftRanges.a.max;
                }
                if (leftRanges.b) {
                    globalPanel.querySelector('.left-min-b').value = leftRanges.b.min;
                    globalPanel.querySelector('.left-max-b').value = leftRanges.b.max;
                }
                if (leftRanges.c) {
                    globalPanel.querySelector('.left-min-c').value = leftRanges.c.min;
                    globalPanel.querySelector('.left-max-c').value = leftRanges.c.max;
                }
            }

            // 设置右侧范围
            const rightRanges = globalSettings.compareSettings.rightRanges;
            if (rightRanges) {
                if (rightRanges.a) {
                    globalPanel.querySelector('.right-min-a').value = rightRanges.a.min;
                    globalPanel.querySelector('.right-max-a').value = rightRanges.a.max;
                }
                if (rightRanges.b) {
                    globalPanel.querySelector('.right-min-b').value = rightRanges.b.min;
                    globalPanel.querySelector('.right-max-b').value = rightRanges.b.max;
                }
                if (rightRanges.c) {
                    globalPanel.querySelector('.right-min-c').value = rightRanges.c.min;
                    globalPanel.querySelector('.right-max-c').value = rightRanges.c.max;
                }
            }

            // 设置运算符
            globalPanel.querySelectorAll('.left-operator').forEach(op => {
                op.checked = globalSettings.compareSettings.leftOperators.includes(op.value);
            });
            globalPanel.querySelectorAll('.right-operator').forEach(op => {
                op.checked = globalSettings.compareSettings.rightOperators.includes(op.value);
            });

            // 更新左右两侧的显示设置
            const leftSection = globalPanel.querySelector('.compare-left-section');
            const rightSection = globalPanel.querySelector('.compare-right-section');
            if (leftSection) updateCompareTypeSettings(leftSection, 'left');
            if (rightSection) updateCompareTypeSettings(rightSection, 'right');
        }
    } else {
        // 原有的简单和复杂运算设置保持不变
        const dRange = globalPanel.querySelector('.d-range');
        const secondOperator = globalPanel.querySelector('.second-operator');
        if (globalSettings.operationType === 'complex') {
            dRange.style.display = 'block';
            secondOperator.style.display = 'block';
        } else {
            dRange.style.display = 'none';
            secondOperator.style.display = 'none';
        }

        // 设置范围值
        globalPanel.querySelector('.min-a').value = globalSettings.aRange.min;
        globalPanel.querySelector('.max-a').value = globalSettings.aRange.max;
        globalPanel.querySelector('.min-b').value = globalSettings.bRange.min;
        globalPanel.querySelector('.max-b').value = globalSettings.bRange.max;
        globalPanel.querySelector('.min-c').value = globalSettings.cRange.min;
        globalPanel.querySelector('.max-c').value = globalSettings.cRange.max;
        globalPanel.querySelector('.min-d').value = globalSettings.dRange.min;
        globalPanel.querySelector('.max-d').value = globalSettings.dRange.max;

        // 设置其他选项
        globalPanel.querySelector('.integers-only').checked = globalSettings.integersOnly;
        globalPanel.querySelector('.reverse-percent').value = globalSettings.reversePercent;

        // 设置运算符
        globalPanel.querySelectorAll('.operator').forEach(op => {
            op.checked = globalSettings.operators.includes(op.value);
        });

        // 设置第二运算符
        globalPanel.querySelectorAll('.operator2').forEach(op => {
            op.checked = globalSettings.operators2.includes(op.value);
        });
    }
}

function toggleColumnSettings() {
    const columnSettings = document.querySelector('.column-settings-row');
    const toggleBtn = document.getElementById('toggleColumnBtn');

    if (columnSettings.style.display === 'none' || !columnSettings.style.display) {
        columnSettings.style.display = 'flex';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>隐藏每列设置';
    } else {
        columnSettings.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>每列详情设置';
    }

    // 保存展开状态到localStorage
    localStorage.setItem('columnSettingsExpanded', columnSettings.style.display === 'flex');
}

// 初始化事件监听器
function initializeEventListeners() {
    // 监听运算类型变化
    document.querySelectorAll('.operation-type').forEach(select => {
        const panel = select.closest('.column-settings');
        select.addEventListener('change', handleOperationTypeChange);
        // 页面加载时立即触发一次
        handleOperationTypeChange({
            target: select,
            value: select.value
        });
    });

    // 监听比较类型变化
    document.querySelectorAll('.left-type, .right-type').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const section = e.target.closest('.compare-left-section, .compare-right-section');
            const prefix = section.classList.contains('compare-left-section') ? 'left' : 'right';
            updateCompareTypeSettings(section, prefix);
        });
    });
}

// 确保在 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    
    // 初始化所有列的运算类型显示
    document.querySelectorAll('.column-settings').forEach(column => {
        const select = column.querySelector('.operation-type');
        if (select) {
            handleOperationTypeChange({
                target: select,
                value: select.value
            });
        }
    });
    
    // 初始化全局设置面板
    const globalPanel = document.querySelector('#settingsGlobal');
    if (globalPanel) {
        const globalSelect = globalPanel.querySelector('.operation-type');
        if (globalSelect) {
            // 使用特殊处理全局设置面板的函数
            handleGlobalOperationTypeChange({
                target: globalSelect,
                value: globalSelect.value
            });
        }
    }
});

// 添加专门处理全局设置面板的函数
function handleGlobalOperationTypeChange(event) {
    const globalPanel = document.querySelector('#settingsGlobal');
    console.log('处理全局设置面板变化:', event);
    console.log('全局面板元素:', globalPanel);
    
    // 修复值获取方式
    const value = event.target ? event.target.value : event.value;
    console.log('当前运算类型:', value);
    
    try {
        // 获取所有需要控制的元素
        const aRange = globalPanel.querySelector('.min-a:not(.left-min-a):not(.right-min-a)');
        const bRange = globalPanel.querySelector('.min-b:not(.left-min-b):not(.right-min-b)');
        const cRange = globalPanel.querySelector('.min-c:not(.left-min-c):not(.right-min-c)');
        
        // 获取父元素div
        const aRangeDiv = aRange ? aRange.closest('div') : null;
        const bRangeDiv = bRange ? bRange.closest('div') : null;
        const cRangeDiv = cRange ? cRange.closest('div') : null;
        const dRange = globalPanel.querySelector('.d-range');
        const integersOnly = globalPanel.querySelector('.integers-only').closest('div');
        const reverseSettings = globalPanel.querySelector('.reverse-percent').closest('div');
        const operators = globalPanel.querySelector('.operator:not(.left-operator):not(.right-operator)').closest('div');
        const secondOperator = globalPanel.querySelector('.second-operator');
        const compareSettings = globalPanel.querySelector('.compare-settings');
        
        // 先隐藏所有设置
        [aRangeDiv, bRangeDiv, cRangeDiv, dRange, operators, secondOperator, reverseSettings].forEach(el => {
            if (el) {
                el.style.display = 'none';
                console.log('隐藏元素:', el);
            }
        });
        if (compareSettings) compareSettings.style.display = 'none';
        
        // 始终显示整数选项和运算形式选择
        integersOnly.style.display = 'block';
        globalPanel.querySelector('.operation-type').closest('div').style.display = 'block';
        
        // 根据选择显示对应设置
        if (value === 'compare') {
            console.log('显示比较设置');
            // 显示比较设置
            if (compareSettings) {
                compareSettings.style.display = 'block';
                // 确保比较设置内的元素正确显示
                const leftSection = globalPanel.querySelector('.compare-left-section');
                const rightSection = globalPanel.querySelector('.compare-right-section');
                if (leftSection) updateCompareTypeSettings(leftSection, 'left');
                if (rightSection) updateCompareTypeSettings(rightSection, 'right');
            }
        } else {
            console.log('显示普通设置:', value);
            // 显示普通设置
            [aRangeDiv, bRangeDiv, cRangeDiv, operators, reverseSettings].forEach(el => {
                if (el) {
                    el.style.display = 'block';
                    console.log('显示元素:', el);
                }
            });
            
            // 根据是否为复杂运算显示额外设置
            if (value === 'complex') {
                console.log('显示复杂运算额外设置');
                if (dRange) dRange.style.display = 'block';
                if (secondOperator) secondOperator.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('处理全局设置面板时出错:', error);
    }
}

// 修改 applyGlobalSettingsToPanel 函数，确保在应用设置后调用 handleGlobalOperationTypeChange
function applyGlobalSettingsToPanel(globalSettings) {
    const globalPanel = document.querySelector('#settingsGlobal');
    if (!globalPanel) return;

    // 设置运算类型和相关显示
    const operationType = globalPanel.querySelector('.operation-type');
    operationType.value = globalSettings.operationType;
    
    // 设置其他选项（无论运算类型如何）
    globalPanel.querySelector('.integers-only').checked = globalSettings.integersOnly;
    
    // 设置所有范围值（无论是否显示）
    try {
        globalPanel.querySelector('.min-a').value = globalSettings.aRange.min;
        globalPanel.querySelector('.max-a').value = globalSettings.aRange.max;
        globalPanel.querySelector('.min-b').value = globalSettings.bRange.min;
        globalPanel.querySelector('.max-b').value = globalSettings.bRange.max;
        globalPanel.querySelector('.min-c').value = globalSettings.cRange.min;
        globalPanel.querySelector('.max-c').value = globalSettings.cRange.max;
        globalPanel.querySelector('.min-d').value = globalSettings.dRange.min;
        globalPanel.querySelector('.max-d').value = globalSettings.dRange.max;
        globalPanel.querySelector('.reverse-percent').value = globalSettings.reversePercent;
        
        // 设置运算符
        globalPanel.querySelectorAll('.operator').forEach(op => {
            op.checked = globalSettings.operators.includes(op.value);
        });
        
        // 设置第二运算符
        globalPanel.querySelectorAll('.operator2').forEach(op => {
            op.checked = globalSettings.operators2.includes(op.value);
        });
    } catch (error) {
        console.error('设置普通运算值时出错:', error);
    }
    
    // 应用大小比较设置
    if (globalSettings.compareSettings) {
        try {
            // 设置左右类型选择
            globalPanel.querySelectorAll('.left-type').forEach(cb => {
                cb.checked = globalSettings.compareSettings.leftTypes.includes(cb.value);
            });
            globalPanel.querySelectorAll('.right-type').forEach(cb => {
                cb.checked = globalSettings.compareSettings.rightTypes.includes(cb.value);
            });

            // 设置左侧范围
            const leftRanges = globalSettings.compareSettings.leftRanges;
            if (leftRanges) {
                if (leftRanges.a) {
                    globalPanel.querySelector('.left-min-a').value = leftRanges.a.min;
                    globalPanel.querySelector('.left-max-a').value = leftRanges.a.max;
                }
                if (leftRanges.b) {
                    globalPanel.querySelector('.left-min-b').value = leftRanges.b.min;
                    globalPanel.querySelector('.left-max-b').value = leftRanges.b.max;
                }
                if (leftRanges.c) {
                    globalPanel.querySelector('.left-min-c').value = leftRanges.c.min;
                    globalPanel.querySelector('.left-max-c').value = leftRanges.c.max;
                }
            }

            // 设置右侧范围
            const rightRanges = globalSettings.compareSettings.rightRanges;
            if (rightRanges) {
                if (rightRanges.a) {
                    globalPanel.querySelector('.right-min-a').value = rightRanges.a.min;
                    globalPanel.querySelector('.right-max-a').value = rightRanges.a.max;
                }
                if (rightRanges.b) {
                    globalPanel.querySelector('.right-min-b').value = rightRanges.b.min;
                    globalPanel.querySelector('.right-max-b').value = rightRanges.b.max;
                }
                if (rightRanges.c) {
                    globalPanel.querySelector('.right-min-c').value = rightRanges.c.min;
                    globalPanel.querySelector('.right-max-c').value = rightRanges.c.max;
                }
            }

            // 设置运算符
            globalPanel.querySelectorAll('.left-operator').forEach(op => {
                op.checked = globalSettings.compareSettings.leftOperators.includes(op.value);
            });
            globalPanel.querySelectorAll('.right-operator').forEach(op => {
                op.checked = globalSettings.compareSettings.rightOperators.includes(op.value);
            });
        } catch (error) {
            console.error('设置比较运算值时出错:', error);
        }
    }
    
    console.log('准备调用handleGlobalOperationTypeChange');
    // 根据运算类型更新显示
    handleGlobalOperationTypeChange({
        target: operationType,
        value: globalSettings.operationType
    });
    
    // 检查设置后的显示状态
    console.log('设置后的显示状态:');
    globalPanel.querySelectorAll('div').forEach(div => {
        if (div.style.display !== '') {
            console.log(`${div.className || 'div'}: ${div.style.display}`);
        }
    });
}

function toggleColumnSettings() {
    const columnSettings = document.querySelector('.column-settings-row');
    const toggleBtn = document.getElementById('toggleColumnBtn');

    if (columnSettings.style.display === 'none' || !columnSettings.style.display) {
        columnSettings.style.display = 'flex';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>隐藏每列设置';
    } else {
        columnSettings.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>每列详情设置';
    }

    // 保存展开状态到localStorage
    localStorage.setItem('columnSettingsExpanded', columnSettings.style.display === 'flex');
}

// 初始化事件监听器
function initializeEventListeners() {
    // 监听运算类型变化
    document.querySelectorAll('.operation-type').forEach(select => {
        const panel = select.closest('.column-settings');
        select.addEventListener('change', handleOperationTypeChange);
        // 页面加载时立即触发一次
        handleOperationTypeChange({
            target: select,
            value: select.value
        });
    });

    // 监听比较类型变化
    document.querySelectorAll('.left-type, .right-type').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const section = e.target.closest('.compare-left-section, .compare-right-section');
            const prefix = section.classList.contains('compare-left-section') ? 'left' : 'right';
            updateCompareTypeSettings(section, prefix);
        });
    });
}

// 确保在 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    
    // 初始化所有列的运算类型显示
    document.querySelectorAll('.column-settings').forEach(column => {
        const select = column.querySelector('.operation-type');
        if (select) {
            handleOperationTypeChange({
                target: select,
                value: select.value
            });
        }
    });
    
    // 初始化全局设置面板
    const globalPanel = document.querySelector('#settingsGlobal');
    if (globalPanel) {
        const globalSelect = globalPanel.querySelector('.operation-type');
        if (globalSelect) {
            // 使用特殊处理全局设置面板的函数
            handleGlobalOperationTypeChange({
                target: globalSelect,
                value: globalSelect.value
            });
        }
    }
});

// 添加专门处理全局设置面板的函数
function handleGlobalOperationTypeChange(event) {
    const globalPanel = document.querySelector('#settingsGlobal');
    console.log('处理全局设置面板变化:', event);
    
    // 修复值获取方式
    const value = event.target ? event.target.value : event.value;
    console.log('当前运算类型:', value);
    
    try {
        // 获取所有需要控制的元素
        const aRange = globalPanel.querySelector('.min-a:not(.left-min-a):not(.right-min-a)');
        const bRange = globalPanel.querySelector('.min-b:not(.left-min-b):not(.right-min-b)');
        const cRange = globalPanel.querySelector('.min-c:not(.left-min-c):not(.right-min-c)');
        
        // 获取父元素div
        const aRangeDiv = aRange ? aRange.closest('div') : null;
        const bRangeDiv = bRange ? bRange.closest('div') : null;
        const cRangeDiv = cRange ? cRange.closest('div') : null;
        const dRange = globalPanel.querySelector('.d-range');
        const integersOnly = globalPanel.querySelector('.integers-only').closest('div');
        const reverseSettings = globalPanel.querySelector('.reverse-percent').closest('div');
        const operators = globalPanel.querySelector('.operator:not(.left-operator):not(.right-operator)').closest('div');
        const secondOperator = globalPanel.querySelector('.second-operator');
        const compareSettings = globalPanel.querySelector('.compare-settings');
        
        // 先隐藏所有设置
        [aRangeDiv, bRangeDiv, cRangeDiv, dRange, operators, secondOperator, reverseSettings].forEach(el => {
            if (el) {
                el.style.display = 'none';
            }
        });
        if (compareSettings) compareSettings.style.display = 'none';
        
        // 始终显示整数选项和运算形式选择
        integersOnly.style.display = 'block';
        globalPanel.querySelector('.operation-type').closest('div').style.display = 'block';
        
        // 根据选择显示对应设置
        if (value === 'compare') {
            console.log('显示比较设置');
            // 显示比较设置
            if (compareSettings) {
                compareSettings.style.display = 'block';
                
                // 确保比较设置内的左右部分都显示
                const leftSection = globalPanel.querySelector('.compare-left-section');
                const rightSection = globalPanel.querySelector('.compare-right-section');
                
                if (leftSection) {
                    leftSection.style.display = 'block';
                    
                    // 显示左侧所有子元素
                    const leftTypeDiv = leftSection.querySelector('div:first-child');
                    if (leftTypeDiv) leftTypeDiv.style.display = 'block';
                    
                    const leftRanges = leftSection.querySelector('.left-ranges');
                    if (leftRanges) {
                        leftRanges.style.display = 'block';
                        // 确保范围A始终显示
                        const rangeA = leftRanges.querySelector('.range-a');
                        if (rangeA) rangeA.style.display = 'block';
                    }
                    
                    // 更新左侧比较类型设置
                    updateCompareTypeSettings(leftSection, 'left');
                }
                
                if (rightSection) {
                    rightSection.style.display = 'block';
                    
                    // 显示右侧所有子元素
                    const rightTypeDiv = rightSection.querySelector('div:first-child');
                    if (rightTypeDiv) rightTypeDiv.style.display = 'block';
                    
                    const rightRanges = rightSection.querySelector('.right-ranges');
                    if (rightRanges) {
                        rightRanges.style.display = 'block';
                        // 确保范围A始终显示
                        const rangeA = rightRanges.querySelector('.range-a');
                        if (rangeA) rangeA.style.display = 'block';
                    }
                    
                    // 更新右侧比较类型设置
                    updateCompareTypeSettings(rightSection, 'right');
                }
                
                // 检查比较设置内部元素的显示状态
                console.log('比较设置内部元素显示状态:');
                if (leftSection) {
                    console.log('左侧部分:', leftSection.style.display);
                }
                if (rightSection) {
                    console.log('右侧部分:', rightSection.style.display);
                }
            }
        } else {
            console.log('显示普通设置:', value);
            // 显示普通设置
            [aRangeDiv, bRangeDiv, cRangeDiv, operators, reverseSettings].forEach(el => {
                if (el) {
                    el.style.display = 'block';
                }
            });
            
            // 根据是否为复杂运算显示额外设置
            if (value === 'complex') {
                console.log('显示复杂运算额外设置');
                if (dRange) dRange.style.display = 'block';
                if (secondOperator) secondOperator.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('处理全局设置面板时出错:', error);
    }
}

// 将新函数挂载到全局
window.handleGlobalOperationTypeChange = handleGlobalOperationTypeChange;

function handleOperationTypeChange(event) {
    // 确保我们有正确的父元素和值
    const parent = event.target ? event.target.closest('.column-settings') : event;
    const value = event.target ? event.target.value : event.value;

    if (!parent || !parent.querySelector) {
        console.error('无效的父元素:', parent);
        return;
    }

    // 获取所有需要控制的元素
    const aRange = parent.querySelector('[class*="min-a"]:not([class*="left-"]):not([class*="right-"])').closest('div');
    const bRange = parent.querySelector('[class*="min-b"]:not([class*="left-"]):not([class*="right-"])').closest('div');
    const cRange = parent.querySelector('[class*="min-c"]:not([class*="left-"]):not([class*="right-"])').closest('div');
    const dRange = parent.querySelector('.d-range');
    const integersOnly = parent.querySelector('.integers-only').closest('div');
    const reverseSettings = parent.querySelector('.reverse-percent').closest('div');
    const operators = parent.querySelector('.operator:not(.left-operator):not(.right-operator)').closest('div');
    const secondOperator = parent.querySelector('.second-operator');
    const compareSettings = parent.querySelector('.compare-settings');

    // 先隐藏所有普通设置（除了整数选项和运算类型选择）
    [aRange, bRange, cRange, dRange, operators, secondOperator, reverseSettings].forEach(el => {
        if (el) el.style.display = 'none';
    });

    // 始终显示整数选项和运算形式选择
    if (integersOnly) integersOnly.style.display = 'block';
    parent.querySelector('.operation-type').closest('div').style.display = 'block';

    // 根据选择显示对应设置
    switch (value) {
        case 'simple':
            [aRange, bRange, cRange, operators, reverseSettings].forEach(el => {
                if (el) el.style.display = 'block';
            });
            if (compareSettings) compareSettings.style.display = 'none';
            break;
        case 'complex':
            [aRange, bRange, cRange, dRange, operators, secondOperator, reverseSettings].forEach(el => {
                if (el) el.style.display = 'block';
            });
            if (compareSettings) compareSettings.style.display = 'none';
            break;
        case 'compare':
            if (compareSettings) {
                compareSettings.style.display = 'block';
                // 确保比较设置内的元素正确显示
                const leftSection = parent.querySelector('.compare-left-section');
                const rightSection = parent.querySelector('.compare-right-section');
                if (leftSection) updateCompareTypeSettings(leftSection, 'left');
                if (rightSection) updateCompareTypeSettings(rightSection, 'right');
            }
            break;
    }
}

function updateCompareTypeSettings(section, prefix) {
    const checkedTypes = Array.from(section.querySelectorAll(`.${prefix}-type:checked`))
        .map(cb => cb.value);

    // 更新范围设置显示
    const ranges = section.querySelector(`.${prefix}-ranges`);
    ranges.querySelector('.range-a').style.display = 'block';
    ranges.querySelector('.range-b').style.display = checkedTypes.some(t => ['AB', 'ABC'].includes(t)) ? 'block' : 'none';
    ranges.querySelector('.range-c').style.display = checkedTypes.includes('ABC') ? 'block' : 'none';

    // 更新运算符显示
    const operators = section.querySelector(`.${prefix}-operators`);
    operators.style.display = checkedTypes.some(t => ['AB', 'ABC'].includes(t)) ? 'block' : 'none';

    // 更新结果范围显示
    const resultRange = section.querySelector(`.${prefix}-result-range`);
    resultRange.style.display = checkedTypes.some(t => ['AB', 'ABC'].includes(t)) ? 'block' : 'none';
}


function applyGlobalSettings() {
    const globalPanel = document.querySelector('#settingsGlobal');
    
    // 添加调试信息
    console.log('开始应用全局设置');
    console.log('全局面板:', globalPanel);
    
    const settings = {
        operationType: globalPanel.querySelector('.operation-type').value,
        integersOnly: globalPanel.querySelector('.integers-only').checked,
        // 保留原有设置
        aRange: {
            min: parseInt(globalPanel.querySelector('.min-a').value),
            max: parseInt(globalPanel.querySelector('.max-a').value)
        },
        bRange: {
            min: parseInt(globalPanel.querySelector('.min-b').value),
            max: parseInt(globalPanel.querySelector('.max-b').value)
        },
        cRange: {
            min: parseInt(globalPanel.querySelector('.min-c').value),
            max: parseInt(globalPanel.querySelector('.max-c').value)
        },
        dRange: {
            min: parseInt(globalPanel.querySelector('.min-d').value),
            max: parseInt(globalPanel.querySelector('.max-d').value)
        },
        reversePercent: parseInt(globalPanel.querySelector('.reverse-percent').value),
        operators: Array.from(globalPanel.querySelectorAll('.operator:checked')).map(cb => cb.value),
        operators2: Array.from(globalPanel.querySelectorAll('.operator2:checked')).map(cb => cb.value),
        
        // 添加大小比较相关设置
        compareSettings: {
            leftTypes: Array.from(globalPanel.querySelectorAll('.left-type:checked')).map(cb => cb.value),
            rightTypes: Array.from(globalPanel.querySelectorAll('.right-type:checked')).map(cb => cb.value),
            leftRanges: {
                a: {
                    min: parseInt(globalPanel.querySelector('.left-min-a').value),
                    max: parseInt(globalPanel.querySelector('.left-max-a').value)
                },
                b: {
                    min: parseInt(globalPanel.querySelector('.left-min-b').value),
                    max: parseInt(globalPanel.querySelector('.left-max-b').value)
                },
                c: {
                    min: parseInt(globalPanel.querySelector('.left-min-c').value),
                    max: parseInt(globalPanel.querySelector('.left-max-c').value)
                }
            },
            rightRanges: {
                a: {
                    min: parseInt(globalPanel.querySelector('.right-min-a').value),
                    max: parseInt(globalPanel.querySelector('.right-max-a').value)
                },
                b: {
                    min: parseInt(globalPanel.querySelector('.right-min-b').value),
                    max: parseInt(globalPanel.querySelector('.right-max-b').value)
                },
                c: {
                    min: parseInt(globalPanel.querySelector('.right-min-c').value),
                    max: parseInt(globalPanel.querySelector('.right-max-c').value)
                }
            },
            leftOperators: Array.from(globalPanel.querySelectorAll('.left-operator:checked')).map(cb => cb.value),
            rightOperators: Array.from(globalPanel.querySelectorAll('.right-operator:checked')).map(cb => cb.value)
        }
    };

    // 将全局设置应用到每一列
    for (let col = 1; col <= 4; col++) {
        console.log(`正在将全局设置应用到第${col}列`);
        applyColumnSettings(col, settings);
    }
    
    // 保存设置
    saveSettings();

    // 重新生成题目
    generateQuestions();
}

// 将所有函数挂载到全局 window 对象
window.applyGlobalSettingsToPanel = applyGlobalSettingsToPanel;
function applyColumnSettings(columnId, settings) {
    const columnPanel = document.getElementById(`settings${columnId}`);
    if (!columnPanel) {
        console.error(`未找到第${columnId}列设置面板`);
        return;
    }

    // 设置运算类型
    const operationType = columnPanel.querySelector('.operation-type');
    if (operationType) {
        operationType.value = settings.operationType;
        handleOperationTypeChange({
            target: operationType,
            value: settings.operationType
        });
    }

    // 根据运算类型应用不同设置
    if (settings.operationType === 'compare') {
        // 应用大小比较设置
        const compareSettings = settings.compareSettings;
        if (compareSettings) {
            // 设置左侧类型
            columnPanel.querySelectorAll('.left-type').forEach(cb => {
                cb.checked = compareSettings.leftTypes.includes(cb.value);
            });
            // 设置右侧类型
            columnPanel.querySelectorAll('.right-type').forEach(cb => {
                cb.checked = compareSettings.rightTypes.includes(cb.value);
            });

            // 应用左侧范围设置
            Object.entries(compareSettings.leftRanges).forEach(([key, range]) => {
                const minInput = columnPanel.querySelector(`.left-min-${key}`);
                const maxInput = columnPanel.querySelector(`.left-max-${key}`);
                if (minInput && maxInput) {
                    minInput.value = range.min;
                    maxInput.value = range.max;
                }
            });

            // 应用右侧范围设置
            Object.entries(compareSettings.rightRanges).forEach(([key, range]) => {
                const minInput = columnPanel.querySelector(`.right-min-${key}`);
                const maxInput = columnPanel.querySelector(`.right-max-${key}`);
                if (minInput && maxInput) {
                    minInput.value = range.min;
                    maxInput.value = range.max;
                }
            });

            // 设置运算符
            columnPanel.querySelectorAll('.left-operator').forEach(op => {
                op.checked = compareSettings.leftOperators.includes(op.value);
            });
            columnPanel.querySelectorAll('.right-operator').forEach(op => {
                op.checked = compareSettings.rightOperators.includes(op.value);
            });

            // 更新显示设置
            const leftSection = columnPanel.querySelector('.compare-left-section');
            const rightSection = columnPanel.querySelector('.compare-right-section');
            if (leftSection) updateCompareTypeSettings(leftSection, 'left');
            if (rightSection) updateCompareTypeSettings(rightSection, 'right');
        }
    } else {
        // 应用普通运算设置
        // 设置范围值
        columnPanel.querySelector('.min-a').value = settings.aRange.min;
        columnPanel.querySelector('.max-a').value = settings.aRange.max;
        columnPanel.querySelector('.min-b').value = settings.bRange.min;
        columnPanel.querySelector('.max-b').value = settings.bRange.max;
        columnPanel.querySelector('.min-c').value = settings.cRange.min;
        columnPanel.querySelector('.max-c').value = settings.cRange.max;
        
        if (settings.operationType === 'complex') {
            const minD = columnPanel.querySelector('.min-d');
            const maxD = columnPanel.querySelector('.max-d');
            if (minD && maxD) {
                minD.value = settings.dRange.min;
                maxD.value = settings.dRange.max;
            }
        }

        // 设置其他选项
        columnPanel.querySelector('.integers-only').checked = settings.integersOnly;
        columnPanel.querySelector('.reverse-percent').value = settings.reversePercent;

        // 设置运算符
        columnPanel.querySelectorAll('.operator').forEach(op => {
            op.checked = settings.operators.includes(op.value);
        });

        // 设置第二运算符
        if (settings.operationType === 'complex') {
            columnPanel.querySelectorAll('.operator2').forEach(op => {
                op.checked = settings.operators2.includes(op.value);
            });
        }
    }
}

// 确保函数挂载到全局
window.applyColumnSettings = applyColumnSettings;
window.toggleColumnSettings = toggleColumnSettings;
window.initializeEventListeners = initializeEventListeners;
window.handleOperationTypeChange = handleOperationTypeChange;
window.updateCompareTypeSettings = updateCompareTypeSettings;
window.applyGlobalSettings = applyGlobalSettings;

// 添加复制左侧设置到右侧的函数
function copyLeftSettings(element) {
    // 获取当前面板
    const panel = element.closest('.compare-settings');
    const leftSection = panel.querySelector('.compare-left-section');
    const rightSection = panel.querySelector('.compare-right-section');
    
    // 复制类型选择
    const leftTypes = leftSection.querySelectorAll('.left-type');
    const rightTypes = rightSection.querySelectorAll('.right-type');
    leftTypes.forEach((leftType, index) => {
        rightTypes[index].checked = leftType.checked;
    });
    
    // 复制范围设置
    ['a', 'b', 'c'].forEach(letter => {
        const leftMin = leftSection.querySelector(`.left-min-${letter}`);
        const leftMax = leftSection.querySelector(`.left-max-${letter}`);
        const rightMin = rightSection.querySelector(`.right-min-${letter}`);
        const rightMax = rightSection.querySelector(`.right-max-${letter}`);
        
        if (leftMin && leftMax && rightMin && rightMax) {
            rightMin.value = leftMin.value;
            rightMax.value = leftMax.value;
        }
    });
    
    // 复制运算符设置
    const leftOperators = leftSection.querySelectorAll('.left-operator');
    const rightOperators = rightSection.querySelectorAll('.right-operator');
    leftOperators.forEach((leftOp, index) => {
        rightOperators[index].checked = leftOp.checked;
    });
    
    // 复制结果范围
    const leftResultMin = leftSection.querySelector('.left-result-min');
    const leftResultMax = leftSection.querySelector('.left-result-max');
    const rightResultMin = rightSection.querySelector('.right-result-min');
    const rightResultMax = rightSection.querySelector('.right-result-max');
    
    if (leftResultMin && leftResultMax && rightResultMin && rightResultMax) {
        rightResultMin.value = leftResultMin.value;
        rightResultMax.value = leftResultMax.value;
    }
    
    // 复制显示/隐藏状态
    ['range-b', 'range-c', 'operators', 'result-range'].forEach(className => {
        const leftElement = leftSection.querySelector(`.left-${className}`);
        const rightElement = rightSection.querySelector(`.right-${className}`);
        if (leftElement && rightElement) {
            rightElement.style.display = leftElement.style.display;
        }
    });
    
    // 触发右侧的更新
    const rightTypeInputs = rightSection.querySelectorAll('.right-type');
    rightTypeInputs.forEach(input => {
        if (input.checked) {
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}