'use client';

interface DisplayProps {
  value: string;
  expression: string;
  isError: boolean;
}

export default function Display({ value, expression, isError }: DisplayProps) {
  const getValueClass = () => {
    const len = value.length;
    if (isError) return 'display-value error';
    if (len > 14) return 'display-value small';
    if (len > 9) return 'display-value medium';
    return 'display-value large';
  };

  return (
    <div className="display">
      <div className="display-expression">{expression || '\u00A0'}</div>
      <div className={getValueClass()}>{value}</div>
    </div>
  );
}
