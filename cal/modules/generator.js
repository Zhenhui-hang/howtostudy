/**
 * 口算题生成器 - 题目生成模块
 * 
 * 功能：
 * 1. 生成单道题目（简单运算和复杂运算）
 * 2. 批量生成题目
 * 3. 验证题目是否符合设置要求
 * 4. 处理题目的显示逻辑
 * 5. 支持正算和反算两种模式
 * 
 */

// import { calculate, randomInt } from './utils.js';
// import { saveSettings, getColumnSettings } from './settings.js';

/**
 * 口算题生成器 - 题目生成模块
 */

function generateQuestions() {
    try {
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
        let hasError = false;
        for (let col = 1; col <= 4; col++) {
            try {
                const settings = getColumnSettings(col);
                const questions = generateColumnQuestions(settings, 25);
                if (questions.length > 0) {
                    displayQuestions(questions, col);
                } else if (!hasError) {
                    hasError = true;
                    alert(`第${col}列题目生成失败，请检查设置范围`);
                    return;
                }
            } catch (error) {
                if (!hasError) {
                    hasError = true;
                    alert(`第${col}列: ${error.message}`);
                    return;
                }
            }
        }
    } catch (error) {
        console.error('生成题目时出错:', error);
        alert(error.message);
    }
}

function generateColumnQuestions(settings, count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        const question = generateQuestion(settings);
        if (question === null) {
            return [];
        }
        questions.push(question);
    }
    return questions;
}

function generateQuestion(settings) {
    const startTime = Date.now();
    const timeout = 1000; // 1秒超时

    // 首先验证范围的合理性
    if (!validateRanges(settings)) {
        throw new Error('设置的范围不合理，请检查');
    }

    let attempts = 0;
    const maxAttempts = 100; // 最大尝试次数

    while (attempts < maxAttempts) {
        // 检查是否超时
        if (Date.now() - startTime > timeout) {
            throw new Error('生成题目超时，请检查设置范围是否合理');
        }

        attempts++;
        if (settings.operationType === 'compare') {
            // 验证大小比较的设置
            if (settings.compareSettings.leftTypes.length === 0 ||
                settings.compareSettings.rightTypes.length === 0) {
                alert('请至少选择一种左侧和右侧的表达式类型');
                return null;
            }
            return generateCompareQuestion(settings);
        }
        const isComplex = settings.operationType === 'complex';
        const isReverse = Math.random() * 100 < settings.reversePercent;
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
                const replaceIndex = Math.floor(Math.random() * 3);
                switch (replaceIndex) {
                    case 0: return `<span class="underline"></span>${operator1}${b}${operator2}${c}=${d}`;
                    case 1: return `${a}${operator1}<span class="underline"></span>${operator2}${c}=${d}`;
                    case 2: return `${a}${operator1}${b}${operator2}<span class="underline"></span>=${d}`;
                }
            }
            return `${a}${operator1}${b}${operator2}${c}=<span class="underline"></span>`;
        } else {
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

    throw new Error('无法生成符合条件的题目，请调整范围');
}

// 添加范围验证函数
function validateRanges(settings) {
    if (settings.operationType === 'simple') {
        // 验证简单运算的范围
        for (const op of settings.operators) {
            switch (op) {
                case '+':
                    // 加法：确保 A + B 的最小值不大于 C 的最大值
                    if (settings.aRange.min + settings.bRange.min > settings.cRange.max) {
                        return false;
                    }
                    break;
                case '-':
                    // 减法：确保 A - B 的最大值不小于 C 的最小值
                    if (settings.aRange.max - settings.bRange.min < settings.cRange.min) {
                        return false;
                    }
                    break;
                case '×':
                    // 乘法：确保 A × B 的最小值不大于 C 的最大值
                    if (settings.aRange.min * settings.bRange.min > settings.cRange.max) {
                        return false;
                    }
                    break;
                case '÷':
                    // 除法：确保有可能产生整数结果
                    if (settings.integersOnly && settings.aRange.min < settings.bRange.min) {
                        return false;
                    }
                    break;
            }
        }
    }
    return true;
}

// 修改生成列题目的函数
function generateColumnQuestions(settings, count) {
    const questions = [];
    let failures = 0;
    const maxFailures = 3; // 最大失败次数

    try {
        for (let i = 0; i < count; i++) {
            try {
                const question = generateQuestion(settings);
                if (question === null) {
                    failures++;
                    if (failures >= maxFailures) {
                        throw new Error('生成题目失败次数过多');
                    }
                    i--; // 重试当前题目
                    continue;
                }
                questions.push(question);
            } catch (error) {
                console.error('生成单个题目失败:', error);
                failures++;
                if (failures >= maxFailures) {
                    throw error;
                }
                i--; // 重试当前题目
            }
        }
    } catch (error) {
        alert('生成题目失败: ' + error.message);
        return [];
    }

    return questions;
}

function calculateComplex(a, b, c, op1, op2) {
    const temp = calculate(a, b, op1);
    return calculate(temp, c, op2);
}

function isValidComplexResult(d, settings) {
    if (settings.integersOnly && !Number.isInteger(d)) return false;
    return d >= settings.dRange.min && d <= settings.dRange.max;
}

function isValidResult(c, settings) {
    if (settings.integersOnly && !Number.isInteger(c)) return false;
    return c >= settings.cRange.min && c <= settings.cRange.max;
}

function generateCompareQuestion(settings) {
    // 确保 compareSettings 存在
    if (!settings.compareSettings) {
        settings.compareSettings = {
            leftTypes: ['A'],
            rightTypes: ['A'],
            leftRanges: {
                a: { min: 0, max: 100 },
                b: { min: 1, max: 9 },
                c: { min: 1, max: 999 }
            },
            rightRanges: {
                a: { min: 0, max: 100 },
                b: { min: 1, max: 9 },
                c: { min: 1, max: 999 }
            },
            leftOperators: ['+', '-'],
            rightOperators: ['+', '-']
        };
    }

    // 随机选择左侧表达式类型
    const leftTypes = settings.compareSettings.leftTypes;
    if (!leftTypes || leftTypes.length === 0) {
        settings.compareSettings.leftTypes = ['A'];
    }
    const leftType = leftTypes[Math.floor(Math.random() * leftTypes.length)];

    // 随机选择右侧表达式类型
    const rightTypes = settings.compareSettings.rightTypes;
    if (!rightTypes || rightTypes.length === 0) {
        settings.compareSettings.rightTypes = ['A'];
    }
    const rightType = rightTypes[Math.floor(Math.random() * rightTypes.length)];

    // 生成左侧表达式
    const leftExpr = generateExpression(leftType, settings.compareSettings.leftRanges, settings.compareSettings.leftOperators);

    // 生成右侧表达式
    const rightExpr = generateExpression(rightType, settings.compareSettings.rightRanges, settings.compareSettings.rightOperators);

    // 计算结果并确定比较符号
    const leftValue = calculateExpression(leftExpr);
    const rightValue = calculateExpression(rightExpr);
    let compareSymbol;
    if (leftValue < rightValue) {
        compareSymbol = '<';
    } else if (leftValue > rightValue) {
        compareSymbol = '>';
    } else {
        compareSymbol = '=';
    }

    return {
        left: leftExpr,
        right: rightExpr,
        compareSymbol: compareSymbol,
        answer: compareSymbol
    };
}

function generateExpression(type, ranges, operators) {
    // 确保 ranges 存在
    ranges = ranges || {
        a: { min: 0, max: 100 },
        b: { min: 1, max: 9 },
        c: { min: 1, max: 999 }
    };

    // 确保 operators 存在
    operators = operators || ['+', '-'];

    if (type === 'A') {
        return {
            type: 'number',
            value: generateSingleNumber(ranges.a.min, ranges.a.max)
        };
    } else if (type === 'AB') {
        const a = generateSingleNumber(ranges.a.min, ranges.a.max);
        const b = generateSingleNumber(ranges.b.min, ranges.b.max);
        const op = operators[Math.floor(Math.random() * operators.length)];
        return {
            type: 'expression',
            a: a,
            b: b,
            operator: op
        };
    } else if (type === 'ABC') {
        const a = generateSingleNumber(ranges.a.min, ranges.a.max);
        const b = generateSingleNumber(ranges.b.min, ranges.b.max);
        const c = generateSingleNumber(ranges.c.min, ranges.c.max);
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        return {
            type: 'complexExpression',
            a: a,
            b: b,
            c: c,
            operator1: op1,
            operator2: op2
        };
    }
}

function generateSingleNumber(min, max) {
    // 确保 min 和 max 是有效的数字
    min = min || 0;
    max = max || 100;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 添加计算表达式的函数
function calculateExpression(expr) {
    if (expr.type === 'number') {
        return expr.value;
    } else if (expr.type === 'expression') {
        return calculate(expr.a, expr.b, expr.operator);
    } else if (expr.type === 'complexExpression') {
        const temp = calculate(expr.a, expr.b, expr.operator1);
        return calculate(temp, expr.c, expr.operator2);
    }
    return 0;
}

// 修改显示题目的函数
function displayQuestions(questions, col) {
    const column = document.querySelector(`#column${col}`);
    column.innerHTML = questions.map(q => {
        // 检查是否为大小比较题目
        if (typeof q === 'object' && q.left && q.right && q.compareSymbol) {
            // 格式化大小比较题目
            const leftText = formatExpression(q.left);
            const rightText = formatExpression(q.right);
            return `<div class="question">${leftText} <span class="compare-symbol"></span> ${rightText}</div>`;
        } else {
            // 普通题目直接显示
            return `<div class="question">${q}</div>`;
        }
    }).join('');
}

// 添加格式化表达式的函数
function formatExpression(expr) {
    if (expr.type === 'number') {
        return expr.value;
    } else if (expr.type === 'expression') {
        return `${expr.a}${expr.operator}${expr.b}`;
    } else if (expr.type === 'complexExpression') {
        return `${expr.a}${expr.operator1}${expr.b}${expr.operator2}${expr.c}`;
    }
    return '';
}