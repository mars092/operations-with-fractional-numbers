# Operations with fractional numbers

Function `operationsWithFractionalNumbers` for JavaScript.

```
operator - '*' | '-' | '+';
exp - number, Exponent (decimal logarithm of the base of the adjustment);
type - 'round' | 'floor' | 'ceil';
...args - number[];
```

```js
operationsWithFractionalNumbers(operator, exp, type, ...args)
```

## Installation

    npm i operations-with-fractional-numbers

## Usage

```js
import operationsWithFractionalNumbers from 'operations-with-fractional-numbers';

console.log(operationsWithFractionalNumbers('-', -2, 'floor', 0.03, 0.01));
// 0.02

console.log(operationsWithFractionalNumbers('+', -2, 'floor', 0.09, 0.01));
// 0.1

console.log(operationsWithFractionalNumbers('*', -2, 'floor', 0.2, 3));
// 0.6
```
