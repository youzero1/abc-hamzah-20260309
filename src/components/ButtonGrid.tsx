'use client';

import Button from './Button';
import { OperatorType } from '@/lib/calculator';

interface ButtonGridProps {
  onNumber: (n: string) => void;
  onOperator: (op: OperatorType) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onDecimal: () => void;
  onPercent: () => void;
  onSqrt: () => void;
  activeOperator: OperatorType | null;
}

export default function ButtonGrid({
  onNumber,
  onOperator,
  onEquals,
  onClear,
  onBackspace,
  onDecimal,
  onPercent,
  onSqrt,
  activeOperator,
}: ButtonGridProps) {
  return (
    <div className="button-grid">
      {/* Row 1: special ops */}
      <Button label="C" type="clear" onClick={onClear} />
      <Button label="⌫" type="special" onClick={onBackspace} />
      <Button label="%" type="special" onClick={onPercent} />
      <Button label="÷" type="operator" onClick={() => onOperator('/')} isActiveOp={activeOperator === '/'} />

      {/* Row 2 */}
      <Button label="√" type="special" onClick={onSqrt} />
      <Button label="7" type="number" onClick={() => onNumber('7')} />
      <Button label="8" type="number" onClick={() => onNumber('8')} />
      <Button label="9" type="number" onClick={() => onNumber('9')} />

      {/* Row 3 */}
      <Button label="×" type="operator" onClick={() => onOperator('*')} isActiveOp={activeOperator === '*'} />
      <Button label="4" type="number" onClick={() => onNumber('4')} />
      <Button label="5" type="number" onClick={() => onNumber('5')} />
      <Button label="6" type="number" onClick={() => onNumber('6')} />

      {/* Row 4 */}
      <Button label="−" type="operator" onClick={() => onOperator('-')} isActiveOp={activeOperator === '-'} />
      <Button label="1" type="number" onClick={() => onNumber('1')} />
      <Button label="2" type="number" onClick={() => onNumber('2')} />
      <Button label="3" type="number" onClick={() => onNumber('3')} />

      {/* Row 5 */}
      <Button label="+" type="operator" onClick={() => onOperator('+')} isActiveOp={activeOperator === '+'} />
      <Button label="0" type="number" onClick={() => onNumber('0')} isWide />
      <Button label="." type="number" onClick={onDecimal} />

      {/* Row 6 */}
      <Button label="^" type="special" onClick={() => onOperator('^')} isActiveOp={activeOperator === '^'} />
      <Button label="=" type="equals" onClick={onEquals} isWide />
    </div>
  );
}
