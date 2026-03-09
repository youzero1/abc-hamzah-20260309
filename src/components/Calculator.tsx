'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import ButtonGrid from './ButtonGrid';
import History from './History';
import {
  CalculatorState,
  OperatorType,
  createInitialState,
  calculate,
  formatResult,
  applyPercentage,
  applySqrt,
} from '@/lib/calculator';
import { CalculationRecord } from '@/types';

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(createInitialState());
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch('/api/history');
      const json = await res.json();
      if (json.data) {
        setHistory(
          json.data.map((r: CalculationRecord & { createdAt: string | Date }) => ({
            ...r,
            createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(r.createdAt).toISOString(),
          }))
        );
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Save to history
  const saveHistory = useCallback(async (expression: string, result: string) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      fetchHistory();
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [fetchHistory]);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 2000);
  };

  const handleNumber = useCallback((digit: string) => {
    setErrorMsg('');
    setState((prev) => {
      if (prev.waitingForSecond) {
        return {
          ...prev,
          display: digit,
          waitingForSecond: false,
          hasResult: false,
        };
      }
      if (prev.hasResult) {
        return {
          ...createInitialState(),
          display: digit,
        };
      }
      const newDisplay =
        prev.display === '0' ? digit : prev.display + digit;
      return { ...prev, display: newDisplay, hasResult: false };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setErrorMsg('');
    setState((prev) => {
      if (prev.waitingForSecond) {
        return {
          ...prev,
          display: '0.',
          waitingForSecond: false,
        };
      }
      if (prev.display.includes('.')) return prev;
      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const handleOperator = useCallback((op: OperatorType) => {
    setErrorMsg('');
    setState((prev) => {
      const current = parseFloat(prev.display);

      // If there's already an operator and we're not waiting, chain calculate
      if (prev.operator && !prev.waitingForSecond && prev.firstOperand !== null) {
        const { result, error } = calculate(prev.firstOperand, prev.operator, current);
        if (error) {
          showError(error);
          return { ...createInitialState(), display: 'Error' };
        }
        const formatted = formatResult(result);
        return {
          ...prev,
          display: formatted,
          firstOperand: result,
          operator: op,
          waitingForSecond: true,
          expression: `${formatted} ${op}`,
          hasResult: false,
        };
      }

      return {
        ...prev,
        firstOperand: current,
        operator: op,
        waitingForSecond: true,
        expression: `${prev.display} ${op}`,
        hasResult: false,
      };
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState((prev) => {
      if (prev.operator === null || prev.firstOperand === null) return prev;

      const second = parseFloat(prev.display);
      const expression = `${prev.firstOperand} ${prev.operator} ${prev.display}`;
      const { result, error } = calculate(prev.firstOperand, prev.operator, second);

      if (error) {
        showError(error);
        saveHistory(expression, 'Error: ' + error);
        return {
          ...createInitialState(),
          display: 'Error',
          expression: expression,
        };
      }

      const formatted = formatResult(result);
      saveHistory(expression, formatted);

      return {
        display: formatted,
        expression: `${expression} =`,
        operator: null,
        firstOperand: null,
        waitingForSecond: false,
        hasResult: true,
      };
    });
  }, [saveHistory]);

  const handleClear = useCallback(() => {
    setErrorMsg('');
    setState(createInitialState());
  }, []);

  const handleBackspace = useCallback(() => {
    setErrorMsg('');
    setState((prev) => {
      if (prev.hasResult || prev.display === '0') return prev;
      const newDisplay =
        prev.display.length > 1 ? prev.display.slice(0, -1) : '0';
      return { ...prev, display: newDisplay };
    });
  }, []);

  const handlePercent = useCallback(() => {
    setErrorMsg('');
    setState((prev) => {
      const value = parseFloat(prev.display);
      const result = applyPercentage(value);
      const formatted = formatResult(result);
      const expression = `${prev.display}%`;
      saveHistory(expression, formatted);
      return {
        ...prev,
        display: formatted,
        expression: `${expression} =`,
        hasResult: true,
      };
    });
  }, [saveHistory]);

  const handleSqrt = useCallback(() => {
    setErrorMsg('');
    setState((prev) => {
      const value = parseFloat(prev.display);
      const { result, error } = applySqrt(value);
      const expression = `√(${prev.display})`;
      if (error) {
        showError(error);
        saveHistory(expression, 'Error');
        return { ...createInitialState(), display: 'Error' };
      }
      const formatted = formatResult(result);
      saveHistory(expression, formatted);
      return {
        ...prev,
        display: formatted,
        expression: `${expression} =`,
        hasResult: true,
      };
    });
  }, [saveHistory]);

  const handleHistorySelect = useCallback((result: string) => {
    if (result === 'Error' || result.startsWith('Error')) return;
    setState((prev) => ({
      ...prev,
      display: result,
      hasResult: true,
      waitingForSecond: false,
    }));
  }, []);

  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      else if (e.key === '.') handleDecimal();
      else if (e.key === '+') handleOperator('+');
      else if (e.key === '-') handleOperator('-');
      else if (e.key === '*') handleOperator('*');
      else if (e.key === '/') { e.preventDefault(); handleOperator('/'); }
      else if (e.key === '^') handleOperator('^');
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
      else if (e.key === '%') handlePercent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClear, handlePercent]);

  const displayValue = errorMsg || state.display;
  const isError = !!errorMsg || state.display === 'Error';

  return (
    <div className="main-layout">
      <div className="calculator">
        <Display
          value={displayValue}
          expression={state.expression}
          isError={isError}
        />
        <ButtonGrid
          onNumber={handleNumber}
          onOperator={handleOperator}
          onEquals={handleEquals}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onDecimal={handleDecimal}
          onPercent={handlePercent}
          onSqrt={handleSqrt}
          activeOperator={state.operator}
        />
        <div className="keyboard-hint">⌨ Keyboard supported</div>
      </div>
      <History
        records={history}
        loading={historyLoading}
        onSelect={handleHistorySelect}
        onClear={handleHistoryClear}
      />
    </div>
  );
}
