'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  type: 'number' | 'operator' | 'special' | 'equals' | 'clear';
  isWide?: boolean;
  isActiveOp?: boolean;
}

export default function Button({
  label,
  onClick,
  type,
  isWide = false,
  isActiveOp = false,
}: ButtonProps) {
  const classes = [
    'calc-button',
    type,
    isWide ? 'zero' : '',
    isActiveOp ? 'active-op' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick}>
      {label}
    </button>
  );
}
