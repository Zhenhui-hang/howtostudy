/**
 * 口算题生成器 - 设置管理模块
 */

function saveSettings() {
    // 保存全局设置
    const globalSettings = {
        questionCount: parseInt(document.getElementById('globalQuestionCount').value) || 25,
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
        const panel = document.querySelector(`#settings${col}`);
        if (!panel) continue;

        const settings = {
            questionCount: parseInt(panel.querySelector('.question-count').value) || 25,
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
                .map(cb => cb.value),
            // 添加大小比较相关设置
            compareSettings: {
                leftTypes: Array.from(document.querySelectorAll(`#settings${col} .left-type:checked`))
                    .map(cb => cb.value),
                rightTypes: Array.from(document.querySelectorAll(`#settings${col} .right-type:checked`))
                    .map(cb => cb.value),
                leftRanges: {
                    a: {
                        min: parseInt(document.querySelector(`#settings${col} .left-min-a`)?.value || 0),
                        max: parseInt(document.querySelector(`#settings${col} .left-max-a`)?.value || 100)
                    },
                    b: {
                        min: parseInt(document.querySelector(`#settings${col} .left-min-b`)?.value || 1),
                        max: parseInt(document.querySelector(`#settings${col} .left-max-b`)?.value || 9)
                    },
                    c: {
                        min: parseInt(document.querySelector(`#settings${col} .left-min-c`)?.value || 1),
                        max: parseInt(document.querySelector(`#settings${col} .left-max-c`)?.value || 999)
                    }
                },
                rightRanges: {
                    a: {
                        min: parseInt(document.querySelector(`#settings${col} .right-min-a`)?.value || 0),
                        max: parseInt(document.querySelector(`#settings${col} .right-max-a`)?.value || 100)
                    },
                    b: {
                        min: parseInt(document.querySelector(`#settings${col} .right-min-b`)?.value || 1),
                        max: parseInt(document.querySelector(`#settings${col} .right-max-b`)?.value || 9)
                    },
                    c: {
                        min: parseInt(document.querySelector(`#settings${col} .right-min-c`)?.value || 1),
                        max: parseInt(document.querySelector(`#settings${col} .right-max-c`)?.value || 999)
                    }
                },
                leftOperators: Array.from(document.querySelectorAll(`#settings${col} .left-operator:checked`))
                    .map(cb => cb.value),
                rightOperators: Array.from(document.querySelectorAll(`#settings${col} .right-operator:checked`))
                    .map(cb => cb.value)
            }
        };
        localStorage.setItem(`column${col}Settings`, JSON.stringify(settings));
    }
}

function loadSettings() {
    try {
        // 加载全局设置
        const globalSettings = localStorage.getItem('globalSettings');
        if (globalSettings) {
            const settings = JSON.parse(globalSettings);
            // 设置全局题目数量
            if (settings.questionCount) {
                document.getElementById('globalQuestionCount').value = settings.questionCount;
            }
            applyGlobalSettingsToPanel(globalSettings);
        }

        // 加载每列设置
        for (let col = 1; col <= 4; col++) {
            try {
                const storedSettings = localStorage.getItem(`column${col}Settings`);
                if (storedSettings) {
                    const settings = JSON.parse(storedSettings);
                    const panel = document.querySelector(`#settings${col}`);
                    if (!panel) continue;

                    // 设置题目数量
                    if (settings.questionCount) {
                        const countInput = panel.querySelector('.question-count');
                        if (countInput) {
                            countInput.value = settings.questionCount;
                        }
                    }
                    applyColumnSettings(col, settings);
                    
                    // 如果是大小比较类型，触发类型变更事件以更新UI
                    if (settings.operationType === 'compare') {
                        const panel = document.querySelector(`#settings${col}`);
                        handleOperationTypeChange(panel, 'compare');
                    }
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

function getColumnSettings(col) {
    const panel = document.querySelector(`#settings${col}`);
    if (!panel) return null;

    const settings = {
        operationType: panel.querySelector('.operation-type').value,
        integersOnly: panel.querySelector('.integers-only').checked,
        aRange: {
            min: parseInt(panel.querySelector('.min-a').value),
            max: parseInt(panel.querySelector('.max-a').value)
        },
        bRange: {
            min: parseInt(panel.querySelector('.min-b').value),
            max: parseInt(panel.querySelector('.max-b').value)
        },
        cRange: {
            min: parseInt(panel.querySelector('.min-c').value),
            max: parseInt(panel.querySelector('.max-c').value)
        },
        dRange: {
            min: parseInt(panel.querySelector('.min-d').value),
            max: parseInt(panel.querySelector('.max-d').value)
        },
        reversePercent: parseInt(panel.querySelector('.reverse-percent').value),
        operators: Array.from(panel.querySelectorAll('.operator:checked')).map(cb => cb.value),
        operators2: Array.from(panel.querySelectorAll('.operator2:checked')).map(cb => cb.value),

        // 添加大小比较相关设置
        compareSettings: {
            leftTypes: Array.from(panel.querySelectorAll('.left-type:checked')).map(cb => cb.value),
            rightTypes: Array.from(panel.querySelectorAll('.right-type:checked')).map(cb => cb.value),
            leftRanges: {
                a: {
                    min: parseInt(panel.querySelector('.left-min-a')?.value || 0),
                    max: parseInt(panel.querySelector('.left-max-a')?.value || 100)
                },
                b: {
                    min: parseInt(panel.querySelector('.left-min-b')?.value || 1),
                    max: parseInt(panel.querySelector('.left-max-b')?.value || 9)
                },
                c: {
                    min: parseInt(panel.querySelector('.left-min-c')?.value || 1),
                    max: parseInt(panel.querySelector('.left-max-c')?.value || 999)
                }
            },
            rightRanges: {
                a: {
                    min: parseInt(panel.querySelector('.right-min-a')?.value || 0),
                    max: parseInt(panel.querySelector('.right-max-a')?.value || 100)
                },
                b: {
                    min: parseInt(panel.querySelector('.right-min-b')?.value || 1),
                    max: parseInt(panel.querySelector('.right-max-b')?.value || 9)
                },
                c: {
                    min: parseInt(panel.querySelector('.right-min-c')?.value || 1),
                    max: parseInt(panel.querySelector('.right-max-c')?.value || 999)
                }
            },
            leftOperators: Array.from(panel.querySelectorAll('.left-operator:checked')).map(cb => cb.value),
            rightOperators: Array.from(panel.querySelectorAll('.right-operator:checked')).map(cb => cb.value)
        }
    };

    return settings;
}

function applyGlobalSettings() {
    // 获取全局设置面板
    const globalPanel = document.getElementById('settingsGlobal');
    
    // 应用题目数量
    const globalCount = globalPanel.querySelector('#globalQuestionCount').value;
    const countInputs = document.querySelectorAll('.question-count');
    countInputs.forEach(input => {
        input.value = globalCount;
    });

    // 保存设置
    saveSettings();
}

// 将函数挂载到全局
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;