/**
 * 口算题生成器 - 工具函数模块
 * 
 * 功能：
 * 1. 提供基础的数学运算函数
 * 2. 生成指定范围内的随机整数
 */

function calculate(a, b, operator) {
    switch(operator) {
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}