export type OperatorType = '+' | '-' | '*' | '/' | '^';

export interface CalculatorState {
  display: string;
  expression: string;
  operator: OperatorType | null;
  firstOperand: number | null;
  waitingForSecond: boolean;
  hasResult: boolean;
}

export function createInitialState(): CalculatorState {
  return {
    display: '0',
    expression: '',
    operator: null,
    firstOperand: null,
    waitingForSecond: false,
    hasResult: false,
  };
}

export function calculate(
  first: number,
  operator: OperatorType,
  second: number
): { result: number; error?: string } {
  switch (operator) {
    case '+':
      return { result: first + second };
    case '-':
      return { result: first - second };
    case '*':
      return { result: first * second };
    case '/':
      if (second === 0) {
        return { result: 0, error: 'Division by zero' };
      }
      return { result: first / second };
    case '^':
      return { result: Math.pow(first, second) };
    default:
      return { result: first };
  }
}

export function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error';
  if (isNaN(value)) return 'Error';

  const str = value.toString();
  if (str.includes('e')) {
    return value.toExponential(6);
  }

  const parts = str.split('.');
  if (parts[1] && parts[1].length > 10) {
    return parseFloat(value.toFixed(10)).toString();
  }

  return str;
}

export function applyPercentage(value: number): number {
  return value / 100;
}

export function applySqrt(value: number): { result: number; error?: string } {
  if (value < 0) {
    return { result: 0, error: 'Invalid input for √' };
  }
  return { result: Math.sqrt(value) };
}
