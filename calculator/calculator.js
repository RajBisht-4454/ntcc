// Calculator functionality
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let firstOperand = '';
let shouldResetDisplay = false;

// Initialize display
display.value = '0';

// Append numbers and operators to display
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    
    // Limit display length to prevent overflow
    if (display.value.length > 15) {
        display.value = display.value.substring(0, 15);
    }
}

// Clear entire display
function clearDisplay() {
    display.value = '0';
    currentInput = '';
    operator = '';
    firstOperand = '';
    shouldResetDisplay = false;
}

// Clear current entry
function clearEntry() {
    display.value = '0';
}

// Delete last character
function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

// Perform calculation
function calculate() {
    try {
        let expression = display.value;
        
        // Replace display symbols with JavaScript operators
        expression = expression.replace(/×/g, '*');
        expression = expression.replace(/−/g, '-');
        
        // Validate expression to prevent malicious code execution
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle division by zero and other edge cases
        if (!isFinite(result)) {
            throw new Error('Cannot divide by zero');
        }
        
        // Round result to prevent floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        // Format result for display
        if (result.toString().length > 15) {
            // Use scientific notation for very large numbers
            result = result.toExponential(8);
        }
        
        display.value = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (/[0-9.]/.test(key)) {
        appendToDisplay(key);
    }
    
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*') {
        appendToDisplay('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    }
    
    // Calculate
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
    
    // Delete/Backspace
    else if (key === 'Backspace' || key === 'Delete') {
        deleteLast();
    }
});

// Add visual feedback for button presses
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 100);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});

// Prevent right-click context menu on calculator
document.querySelector('.calculator').addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Additional utility functions
function formatNumber(num) {
    // Format large numbers with commas
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function isOperator(char) {
    return ['+', '-', '*', '/', '×', '−'].includes(char);
}

// Memory functions (bonus feature)
let memory = 0;

function memoryStore() {
    memory = parseFloat(display.value) || 0;
    showMemoryIndicator();
}

function memoryRecall() {
    display.value = memory.toString();
}

function memoryClear() {
    memory = 0;
    hideMemoryIndicator();
}

function memoryAdd() {
    memory += parseFloat(display.value) || 0;
    showMemoryIndicator();
}

function memorySubtract() {
    memory -= parseFloat(display.value) || 0;
    showMemoryIndicator();
}

function showMemoryIndicator() {
    // Visual indicator that memory has a value
    let indicator = document.querySelector('.memory-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'memory-indicator';
        indicator.textContent = 'M';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: #ff6b6b;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        `;
        document.querySelector('.calculator').style.position = 'relative';
        document.querySelector('.calculator').appendChild(indicator);
    }
}

function hideMemoryIndicator() {
    const indicator = document.querySelector('.memory-indicator');
    if (indicator) {
        indicator.remove();
    }
}
