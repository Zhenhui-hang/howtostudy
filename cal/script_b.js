function generateQuestions() {
    try {
        // 验证每列至少选择了一个运算符
        for (let col = 1; col <= 4; col++) {
            const operators = document.querySelectorAll(`#settings${col} .operator:checked`);
            if (operators.length === 0) {
                alert(`第${col}列至少需要选择一个运算符`);
                return;
            }
        }

        // 验证每列的运算符选择
        for (let col = 1; col <= 4; col++) {
            const panel = document.querySelector(`#settings${col}`);
            const isComplex = panel.querySelector('.operation-type').value === 'complex';

            // 检查第一个运算符
            const operators = document.querySelectorAll(`#settings${col} .operator:checked`);
            if (operators.length === 0) {
                alert(`第${col}列至少需要选择一个运算符`);
                return;
            }

            // 如果是复杂运算，检查第二个运算符
            if (isComplex) {
                const operators2 = document.querySelectorAll(`#settings${col} .operator2:checked`);
                if (operators2.length === 0) {
                    alert(`第${col}列使用复杂运算时，至少需要选择一个运算符2`);
                    return;
                }
            }
        }

        // 保存设置到localStorage
        saveSettings();

        // 为每列生成题目
        for (let col = 1; col <= 4; col++) {
            const settings = getColumnSettings(col);
            const questions = generateColumnQuestions(settings, 25);
            displayQuestions(questions, col);
        }
    } catch (error) {
        console.error('生成题目时出错:', error);
    }
}

function saveSettings() {
    // 保存全局设置
    const globalSettings = {
        operationType: document.querySelector('#settingsGlobal .operation-type').value,
        aRange: {
            min: parseInt(document.querySelector('#settingsGlobal .min-a').value),
            max: parseInt(document.querySelector('#settingsGlobal .max-a').value)
        },
        bRange: {
            min: parseInt(document.querySelector('#settingsGlobal .min-b').value),
            max: parseInt(document.querySelector('#settingsGlobal .max-b').value)
        },
        cRange: {
            min: parseInt(document.querySelector('#settingsGlobal .min-c').value),
            max: parseInt(document.querySelector('#settingsGlobal .max-c').value)
        },
        dRange: {
            min: parseInt(document.querySelector('#settingsGlobal .min-d').value),
            max: parseInt(document.querySelector('#settingsGlobal .max-d').value)
        },
        integersOnly: document.querySelector('#settingsGlobal .integers-only').checked,
        reversePercent: parseInt(document.querySelector('#settingsGlobal .reverse-percent').value),
        operators: Array.from(document.querySelectorAll('#settingsGlobal .operator:checked'))
            .map(cb => cb.value),
        operators2: Array.from(document.querySelectorAll('#settingsGlobal .operator2:checked'))
            .map(cb => cb.value)
    };
    localStorage.setItem('globalSettings', JSON.stringify(globalSettings));

    // 保存每列设置
    for (let col = 1; col <= 4; col++) {
        const settings = {
            operationType: document.querySelector(`#settings${col} .operation-type`).value,
            aRange: {
                min: parseInt(document.querySelector(`#settings${col} .min-a`).value),
                max: parseInt(document.querySelector(`#settings${col} .max-a`).value)
            },
            bRange: {
                min: parseInt(document.querySelector(`#settings${col} .min-b`).value),
                max: parseInt(document.querySelector(`#settings${col} .max-b`).value)
            },
            cRange: {
                min: parseInt(document.querySelector(`#settings${col} .min-c`).value),
                max: parseInt(document.querySelector(`#settings${col} .max-c`).value)
            },
            dRange: {
                min: parseInt(document.querySelector(`#settings${col} .min-d`).value),
                max: parseInt(document.querySelector(`#settings${col} .max-d`).value)
            },
            integersOnly: document.querySelector(`#settings${col} .integers-only`).checked,
            reversePercent: parseInt(document.querySelector(`#settings${col} .reverse-percent`).value),
            operators: Array.from(document.querySelectorAll(`#settings${col} .operator:checked`))
                .map(cb => cb.value),
            operators2: Array.from(document.querySelectorAll(`#settings${col} .operator2:checked`))
                .map(cb => cb.value)
        };
        localStorage.setItem(`column${col}Settings`, JSON.stringify(settings));
    }
}

function getColumnSettings(col) {
    const stored = localStorage.getItem(`column${col}Settings`);
    return stored ? JSON.parse(stored) : getDefaultSettings();
}

function getDefaultSettings() {
    return {
        operationType: 'simple',
        aRange: { min: 1, max: 100 },
        bRange: { min: 1, max: 9 },
        cRange: { min: 1, max: 999 },
        dRange: { min: 1, max: 999 },
        integersOnly: true,
        reversePercent: 0,
        operators: ['+', '-'],
        operators2: ['+', '-']
    };
}

function generateColumnQuestions(settings, count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        const question = generateQuestion(settings);
        // 如果生成题目失败，直接返回空数组
        if (question === null) {
            return [];
        }
        questions.push(question);
    }
    return questions;
}

function generateQuestion(settings) {
    const isComplex = settings.operationType === 'complex';
    const isReverse = Math.random() * 100 < settings.reversePercent;

    // 检查运算符是否为空
    if (settings.operators.length === 0) {
        alert('请至少选择一个运算符');
        return null;
    }

    // 如果是复杂运算，检查运算符2是否为空
    if (isComplex && settings.operators2.length === 0) {
        alert('复杂运算模式下请至少选择一个运算符2');
        return null;
    }

    const operator1 = settings.operators[Math.floor(Math.random() * settings.operators.length)];

    if (isComplex) {
        const operator2 = settings.operators2[Math.floor(Math.random() * settings.operators2.length)];
        let a, b, c, d;
        do {
            a = randomInt(settings.aRange.min, settings.aRange.max);
            b = randomInt(settings.bRange.min, settings.bRange.max);
            c = randomInt(settings.cRange.min, settings.cRange.max);
            d = calculateComplex(a, b, c, operator1, operator2);
        } while (!isValidComplexResult(d, settings));

        if (isReverse) {
            // 随机选择替换哪个数
            const replaceIndex = Math.floor(Math.random() * 3);
            switch (replaceIndex) {
                case 0: return `<span class="underline"></span>${operator1}${b}${operator2}${c}=${d}`;
                case 1: return `${a}${operator1}<span class="underline"></span>${operator2}${c}=${d}`;
                case 2: return `${a}${operator1}${b}${operator2}<span class="underline"></span>=${d}`;
            }
        }
        return `${a}${operator1}${b}${operator2}${c}=<span class="underline"></span>`;
    } else {
        // 原有的简单运算逻辑保持不变
        let a, b, c;
        do {
            a = randomInt(settings.aRange.min, settings.aRange.max);
            b = randomInt(settings.bRange.min, settings.bRange.max);
            c = calculate(a, b, operator1);
        } while (!isValidResult(c, settings));

        if (isReverse) {
            if (Math.random() < 0.5) {
                return `<span class="underline"></span>${operator1}${b}=${c}`;
            } else {
                return `${a}${operator1}<span class="underline"></span>=${c}`;
            }
        }
        return `${a}${operator1}${b}=<span class="underline"></span>`;
    }
}

function calculateComplex(a, b, c, op1, op2) {
    const temp = calculate(a, b, op1);
    return calculate(temp, c, op2);
}

function isValidComplexResult(d, settings) {
    if (settings.integersOnly && !Number.isInteger(d)) return false;
    return d >= settings.dRange.min && d <= settings.dRange.max;
}

// 添加事件监听器，处理运算形式切换
document.querySelectorAll('.operation-type').forEach(select => {
    select.addEventListener('change', function () {
        const parent = this.closest('.column-settings');
        const dRange = parent.querySelector('.d-range');
        const secondOperator = parent.querySelector('.second-operator');

        if (this.value === 'complex') {
            dRange.style.display = 'block';
            secondOperator.style.display = 'block';
            // 检查是否有选择运算符2
            const hasOperator2 = Array.from(secondOperator.querySelectorAll('.operator2:checked')).length > 0;
            if (!hasOperator2) {
                alert('复杂运算模式下请至少选择一个运算符2');
                // 默认选中第一个运算符2
                const firstOperator2 = secondOperator.querySelector('.operator2');
                if (firstOperator2) {
                    firstOperator2.checked = true;
                }
            }
        } else {
            dRange.style.display = 'none';
            secondOperator.style.display = 'none';
        }
    });
});

function calculate(a, b, operator) {
    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷':
            // 防止除数为0
            if (b === 0) return Infinity;
            return a / b;
        default: return 0;
    }
}

function isValidResult(c, settings) {
    if (settings.integersOnly && !Number.isInteger(c)) return false;
    return c >= settings.cRange.min && c <= settings.cRange.max;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayQuestions(questions, col) {
    const column = document.querySelector(`#column${col}`);
    column.innerHTML = questions.map(q =>
        `<div class="question">${q}</div>`
    ).join('');
}

// 页面加载时加载保存的设置
// 修改页面加载时的行为
window.onload = function () {
    console.log('页面开始加载...');
    try {
        // 延迟加载设置
        setTimeout(() => {
            console.log('开始加载设置...');
            loadSettings();
            console.log('设置加载完成');

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

            // 延迟生成题目
            setTimeout(() => {
                console.log('开始生成题目...');
                generateQuestions();
                console.log('题目生成完成');
            }, 100);
        }, 100);
    } catch (error) {
        console.error('页面加载出错:', error);
    }
};

// 新增加载设置的函数，将设置加载逻辑分离
function loadSettings() {
    console.log('开始加载设置...');
    try {
        // 加载全局设置
        const storedGlobalSettings = localStorage.getItem('globalSettings');
        if (storedGlobalSettings) {
            try {
                const globalSettings = JSON.parse(storedGlobalSettings);
                applyGlobalSettingsToPanel(globalSettings);
            } catch (e) {
                console.error('加载全局设置失败:', e);
                localStorage.removeItem('globalSettings');
            }
        }

        // 加载每列设置
        for (let col = 1; col <= 4; col++) {
            try {
                const settings = getColumnSettings(col);
                if (settings) {
                    applyColumnSettings(col, settings);
                }
            } catch (e) {
                console.error(`加载第${col}列设置失败:`, e);
                localStorage.removeItem(`column${col}Settings`);
            }
        }
    } catch (error) {
        console.error('加载设置时出错:', error);
    }
}

function applyGlobalSettingsToPanel(globalSettings) {
    const globalPanel = document.querySelector('#settingsGlobal');
    if (!globalPanel) return;

    // 设置运算类型和相关显示
    const operationType = globalPanel.querySelector('.operation-type');
    operationType.value = globalSettings.operationType;
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
function applyColumnSettings(col, settings) {
    const panel = document.querySelector(`#settings${col}`);
    if (!panel) return;

    // 设置运算类型和相关显示
    const operationType = panel.querySelector('.operation-type');
    operationType.value = settings.operationType;
    const dRange = panel.querySelector('.d-range');
    const secondOperator = panel.querySelector('.second-operator');
    if (settings.operationType === 'complex') {
        dRange.style.display = 'block';
        secondOperator.style.display = 'block';
    } else {
        dRange.style.display = 'none';
        secondOperator.style.display = 'none';
    }

    // 设置范围值
    panel.querySelector('.min-a').value = settings.aRange.min;
    panel.querySelector('.max-a').value = settings.aRange.max;
    panel.querySelector('.min-b').value = settings.bRange.min;
    panel.querySelector('.max-b').value = settings.bRange.max;
    panel.querySelector('.min-c').value = settings.cRange.min;
    panel.querySelector('.max-c').value = settings.cRange.max;
    panel.querySelector('.min-d').value = settings.dRange.min;
    panel.querySelector('.max-d').value = settings.dRange.max;

    // 设置其他选项
    panel.querySelector('.integers-only').checked = settings.integersOnly;
    panel.querySelector('.reverse-percent').value = settings.reversePercent;

    // 设置运算符
    panel.querySelectorAll('.operator').forEach(op => {
        op.checked = settings.operators.includes(op.value);
    });

    // 设置第二运算符
    panel.querySelectorAll('.operator2').forEach(op => {
        op.checked = settings.operators2.includes(op.value);
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

function applyGlobalSettings() {
    const globalPanel = document.querySelector('#settingsGlobal');

    // 获取全局设置的值
    const settings = {
        operationType: globalPanel.querySelector('.operation-type').value,
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
        integersOnly: globalPanel.querySelector('.integers-only').checked,
        reversePercent: parseInt(globalPanel.querySelector('.reverse-percent').value),
        operators: Array.from(globalPanel.querySelectorAll('.operator:checked'))
            .map(cb => cb.value),
        operators2: Array.from(globalPanel.querySelectorAll('.operator2:checked'))
            .map(cb => cb.value)
    };

    // 应用到所有列
    for (let col = 1; col <= 4; col++) {
        const panel = document.querySelector(`#settings${col}`);

        // 设置运算类型和相关显示
        panel.querySelector('.operation-type').value = settings.operationType;
        const dRange = panel.querySelector('.d-range');
        const secondOperator = panel.querySelector('.second-operator');
        if (settings.operationType === 'complex') {
            dRange.style.display = 'block';
            secondOperator.style.display = 'block';
        } else {
            dRange.style.display = 'none';
            secondOperator.style.display = 'none';
        }

        // 设置范围值
        panel.querySelector('.min-a').value = settings.aRange.min;
        panel.querySelector('.max-a').value = settings.aRange.max;
        panel.querySelector('.min-b').value = settings.bRange.min;
        panel.querySelector('.max-b').value = settings.bRange.max;
        panel.querySelector('.min-c').value = settings.cRange.min;
        panel.querySelector('.max-c').value = settings.cRange.max;
        panel.querySelector('.min-d').value = settings.dRange.min;
        panel.querySelector('.max-d').value = settings.dRange.max;

        // 设置其他选项
        panel.querySelector('.integers-only').checked = settings.integersOnly;
        panel.querySelector('.reverse-percent').value = settings.reversePercent;

        // 设置运算符
        panel.querySelectorAll('.operator').forEach(op => {
            op.checked = settings.operators.includes(op.value);
        });

        // 设置第二运算符
        panel.querySelectorAll('.operator2').forEach(op => {
            op.checked = settings.operators2.includes(op.value);
        });
    }

    // 应用设置后自动生成新题目
    generateQuestions();
}