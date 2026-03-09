'use client';

import { CalculationRecord } from '@/types';

interface HistoryProps {
  records: CalculationRecord[];
  loading: boolean;
  onSelect: (result: string) => void;
  onClear: () => void;
}

function formatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function History({ records, loading, onSelect, onClear }: HistoryProps) {
  return (
    <div className="history-panel">
      <div className="history-header">
        <span className="history-title">History</span>
        {records.length > 0 && (
          <button className="history-clear-btn" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <div className="history-list">
        {loading ? (
          <div className="history-loading">Loading…</div>
        ) : records.length === 0 ? (
          <div className="history-empty">No calculations yet.</div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="history-item"
              onClick={() => onSelect(rec.result)}
              title="Click to use this result"
            >
              <div className="history-expr">{rec.expression}</div>
              <div className="history-result">= {rec.result}</div>
              <div className="history-time">{formatTime(rec.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
