"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Rounding to nearest
// decimalAdjust('round', 55.55, -1);   // 55.6
// decimalAdjust('round', 55.549, -1);  // 55.5
// decimalAdjust('round', 55, 1);       // 60
// decimalAdjust('round', 54.9, 1);     // 50
// decimalAdjust('round', -55.55, -1);  // -55.5
// decimalAdjust('round', -55.551, -1); // -55.6
// decimalAdjust('round', -55, 1);      // -50
// decimalAdjust('round', -55.1, 1);    // -60
// decimalAdjust('round', 1.005, -2);   // 1.01 -- compare this result with the result Math.round(1.005*100)/100
// Round down
// decimalAdjust('floor', 55.59, -1);   // 55.5
// decimalAdjust('floor', 59, 1);       // 50
// decimalAdjust('floor', -55.51, -1);  // -55.6
// decimalAdjust('floor', -51, 1);      // -60
// Round up
// decimalAdjust('ceil', 55.51, -1);    // 55.6
// decimalAdjust('ceil', 51, 1);        // 60
// decimalAdjust('ceil', -55.59, -1);   // -55.5
// decimalAdjust('ceil', -59, 1);       // -50
/**
 * Decimal rounding correction.
 *
 * @param {String} type Correction type.
 * @param {Number} value Number.
 * @param {Integer} exp Exponent (decimal logarithm of the base of the adjustment).
 * @returns {Number} Adjusted value.
 */
function decimalAdjust(type, value, exp) {
    // If the degree is not defined, or is equal to zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    // If the value is not a number, or the degree is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Bit shift
    const shift = value.toString().split('e');
    value = Math[type](+(shift[0] + 'e' + (shift[1] ? (+shift[1] - exp) : -exp)));
    // Reverse shift
    const reverseShift = value.toString().split('e');
    return +(reverseShift[0] + 'e' + (reverseShift[1] ? (+reverseShift[1] + exp) : exp));
}
function numberSimbolsAfterComma(numb) {
    return numb.toString().includes('.') ? numb.toString().split('.').pop().length : 0;
}
function calcResult(sum1, sum2) {
    if (sum2 === 0) {
        return 0;
    }
    const numberBeforeDecimalPoint = sum2.toString().split('.')[0];
    if (numberBeforeDecimalPoint === '0' || numberBeforeDecimalPoint === '-0') {
        let nuls = '';
        for (let i = 0; i < sum2.toString().split('.')[1].length; i++) {
            if (sum2.toString().split('.')[1][i] !== '0') {
                if (nuls.length && sum2.toString().split('.')[1][i] === '9' && sum2.toString().split('.')[1][i - 1] === '0') {
                    nuls = nuls.slice(1);
                }
                break;
            }
            nuls = `${nuls}0`;
        }
        return +`${sum2.toString().split('.')[0]}.${nuls}${Math.abs(sum1)}`;
    }
    else {
        return +`${sum2.toString().split('.')[0]}.${sum1.toString().slice(sum2.toString().split('.')[0].length)}`;
    }
}
function subtractionFractionsWithRounding(factor, exp, type, ...args) {
    let sum1 = decimalAdjust('round', args[0] * factor);
    let sum2 = args[0];
    args.slice(1).forEach(numb => {
        sum1 -= decimalAdjust('round', numb * factor);
        sum2 -= numb;
    });
    return decimalAdjust(type, calcResult(sum1, sum2), exp);
}
function multiplicationFractionsWithRounding(factor, exp, type, ...args) {
    let sum1 = decimalAdjust('round', args[0] * factor);
    let sum2 = args[0];
    args.slice(1).forEach(numb => {
        sum1 *= decimalAdjust('round', numb * factor);
        sum2 *= numb;
    });
    return decimalAdjust(type, calcResult(sum1, sum2), exp);
}
function summationFractionsWithRounding(factor, exp, type, ...args) {
    let sum1 = decimalAdjust('round', args[0] * factor);
    let sum2 = args[0];
    args.slice(1).forEach(numb => {
        sum1 += decimalAdjust('round', numb * factor);
        sum2 += numb;
    });
    return decimalAdjust(type, calcResult(sum1, sum2), exp);
}
function divisionOfFractionsWithRounding(factor, exp, type, ...args) {
    let sum1 = decimalAdjust('round', args[0] * factor);
    let sum2 = args[0];
    args.slice(1).forEach(numb => {
        sum1 /= decimalAdjust('round', numb * factor);
        sum2 /= numb;
    });
    const valueSimbolsAfterComma = numberSimbolsAfterComma(sum1);
    if (valueSimbolsAfterComma) {
        sum1 = sum1 * Math.pow(10, valueSimbolsAfterComma);
    }
    if (sum1 === Infinity && sum2 === Infinity)
        return Infinity;
    return decimalAdjust(type, calcResult(sum1, sum2), exp);
}
/**
 * Operations with fractional numbers.
 *
 * @param {String} operator '*' | '-' | '+'.
 * @param {Integer} exp Exponent (decimal logarithm of the base of the adjustment).
 * @param {String} type 'round' | 'floor' | 'ceil'.
 * @param {Number[]} args Array of numbers.
 * @returns {Number} Array of numbers.
 */
function operationsWithFractionalNumbers(operator, exp, type, ...args) {
    if (!args.length) {
        return NaN;
    }
    if (args.length === 1) {
        return decimalAdjust(type, args[0], exp);
    }
    let maxNumberSimbolsAfterComma = numberSimbolsAfterComma(args[args.length - 1]);
    args.forEach(numb => {
        const thisNumberSimbolsAfterComma = numberSimbolsAfterComma(numb);
        if (thisNumberSimbolsAfterComma > maxNumberSimbolsAfterComma) {
            maxNumberSimbolsAfterComma = thisNumberSimbolsAfterComma;
        }
    });
    const factor = Math.pow(10, maxNumberSimbolsAfterComma);
    switch (operator) {
        case '*':
            return multiplicationFractionsWithRounding(factor, exp, type, ...args);
        case '-':
            return subtractionFractionsWithRounding(factor, exp, type, ...args);
        case '+':
            return summationFractionsWithRounding(factor, exp, type, ...args);
        case '/':
            return divisionOfFractionsWithRounding(factor, exp, type, ...args);
    }
}
exports.default = operationsWithFractionalNumbers;
