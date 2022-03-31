type TypeMath = 'round' | 'floor' | 'ceil';

// Округление к ближайшему
// decimalAdjust('round', 55.55, -1);   // 55.6
// decimalAdjust('round', 55.549, -1);  // 55.5
// decimalAdjust('round', 55, 1);       // 60
// decimalAdjust('round', 54.9, 1);     // 50
// decimalAdjust('round', -55.55, -1);  // -55.5
// decimalAdjust('round', -55.551, -1); // -55.6
// decimalAdjust('round', -55, 1);      // -50
// decimalAdjust('round', -55.1, 1);    // -60
// decimalAdjust('round', 1.005, -2);   // 1.01 -- сравните этот результат с результатом Math.round(1.005*100)/100
// Округление вниз
// decimalAdjust('floor', 55.59, -1);   // 55.5
// decimalAdjust('floor', 59, 1);       // 50
// decimalAdjust('floor', -55.51, -1);  // -55.6
// decimalAdjust('floor', -51, 1);      // -60
// Округление вверх
// decimalAdjust('ceil', 55.51, -1);    // 55.6
// decimalAdjust('ceil', 51, 1);        // 60
// decimalAdjust('ceil', -55.59, -1);   // -55.5
// decimalAdjust('ceil', -59, 1);       // -50

/**
 * Корректировка округления десятичных дробей.
 *
 * @param {String}  type  Тип корректировки.
 * @param {Number}  value Число.
 * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
 * @returns {Number} Скорректированное значение.
 */
function decimalAdjust(type: TypeMath, value: number, exp?: number): number {
  // Если степень не определена, либо равна нулю...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  // Если значение не является числом, либо степень не является целым числом...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Сдвиг разрядов
  const shift = value.toString().split('e');
  value = Math[type](+(shift[0] + 'e' + (shift[1] ? (+shift[1] - exp) : -exp)));
  // Обратный сдвиг
  const reverseShift = value.toString().split('e');
  return +(reverseShift[0] + 'e' + (reverseShift[1] ? (+reverseShift[1] + exp) : exp));
}

function numberSimbolsAfterComma(numb: number): number {
  return numb.toString().includes('.') ? numb.toString().split('.').pop()!.length : 0;
}

function calcResult(sum1: number, sum2: number): number {
  if (sum2 === 0) {
    return 0;
  }
  const numberBeforeDecimalPoint = sum2.toString().split('.')[0];
  if (numberBeforeDecimalPoint === '0' || numberBeforeDecimalPoint === '-0') {
    let nuls = '';
    for (let i = 0; i < sum2.toString().split('.')[1].length; i++) {
      const char = sum2.toString().split('.')[1][i];
      if (+char !== 0) break;
      nuls = `${nuls}0`;
    }
    return +`${sum2.toString().split('.')[0]}.${nuls}${Math.abs(sum1)}`;
  } else {
    return +`${sum2.toString().split('.')[0]}.${sum1.toString().slice(sum2.toString().split('.')[0].length)}`
  }
}

function subtractionFractionsWithRounding(factor: number, exp: number, type: TypeMath, ...args: number[]): number {
  let sum1 = decimalAdjust('round', args[0] * factor);
  let sum2 = args[0];
  args.slice(1).forEach(numb => {
    sum1 -= decimalAdjust('round', numb * factor);
    sum2 -= numb;
  });
  return decimalAdjust(type, calcResult(sum1, sum2), exp);
}

function multiplicationFractionsWithRounding(factor: number, exp: number, type: TypeMath, ...args: number[]): number {
  let sum1 = decimalAdjust('round', args[0] * factor);
  let sum2 = args[0];
  args.slice(1).forEach(numb => {
    sum1 *= decimalAdjust('round', numb * factor);
    sum2 *= numb;
  });
  return decimalAdjust(type, calcResult(sum1, sum2), exp);
}

function summationFractionsWithRounding(factor: number, exp: number, type: TypeMath, ...args: number[]): number {
  let sum1 = decimalAdjust('round', args[0] * factor);
  let sum2 = args[0];
  args.slice(1).forEach(numb => {
    sum1 += decimalAdjust('round', numb * factor);
    sum2 += numb;
  });
  return decimalAdjust(type, calcResult(sum1, sum2), exp);
}

export function operationsWithFractionalNumbers(operator: '*' | '-' | '+', exp: number, type: TypeMath, ...args: number[]): number {
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
  const factor = Math.pow(
    10,
    maxNumberSimbolsAfterComma
  );
  switch (operator) {
    case '*':
      return multiplicationFractionsWithRounding(factor, exp, type, ...args);
    case '-':
      return subtractionFractionsWithRounding(factor, exp, type, ...args);
    case '+':
      return summationFractionsWithRounding(factor, exp, type, ...args);
  }
}
