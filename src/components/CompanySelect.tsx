import { useState, useRef, useEffect, useMemo } from 'react';
import type { KeyboardEvent, FocusEvent, ChangeEvent } from 'react';
import type { Company } from '../types/company.ts';
import styles from './CompanySelect.module.css';

interface CompanySelectProps {
  companies: Company[];
  isLoading: boolean;
  value: number | null;
  onChange: (id: number) => void;
  onRequestCreate: (typedName: string) => void;
}

export function CompanySelect({
  companies,
  isLoading,
  value,
  onChange,
  onRequestCreate,
}: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = companies.find((c) => c.id === value);
  const trimmed = search.trim();

  const filtered = useMemo(() => {
    const q = trimmed.toLowerCase();
    if (!q) return companies;
    const prefix: Company[] = [];
    const other: Company[] = [];
    for (const c of companies) {
      const name = c.name.toLowerCase();
      if (name.startsWith(q)) prefix.push(c);
      else if (name.includes(q)) other.push(c);
    }
    return [...prefix, ...other];
  }, [companies, trimmed]);

  const exactMatch = trimmed
    ? companies.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    : false;
  // Always show "+ Create" unless the typed text exactly matches an existing company.
  const showCreate = !exactMatch;
  const createIndex = showCreate ? filtered.length : -1;
  const lastIndex = showCreate ? filtered.length : filtered.length - 1;

  // When the only actionable item is "+ Create", auto-highlight it
  const effectiveHighlight =
    filtered.length === 0 && showCreate ? createIndex : highlightedIndex;

  function open() {
    setIsOpen(true);
    setSearch('');
    setHighlightedIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function close(opts: { returnFocus?: boolean } = {}) {
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
    if (opts.returnFocus) buttonRef.current?.focus();
  }

  function handleSelect(company: Company) {
    onChange(company.id);
    close();
  }

  function handleCreate() {
    onRequestCreate(trimmed);
    close();
  }

  function handleButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      open();
    }
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i < 0 ? 0 : i + 1, lastIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = effectiveHighlight;
      if (idx < 0) return;
      if (idx === createIndex) handleCreate();
      else if (filtered[idx]) handleSelect(filtered[idx]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close({ returnFocus: true });
    }
  }

  function handlePopoverBlur(e: FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget as Node | null;
    if (next && popoverRef.current?.contains(next)) return;
    close();
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setSearch(next);
    setHighlightedIndex(next.trim().length > 0 ? 0 : -1);
  }

  // Close when clicking outside the popover and the trigger button
  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  // Scroll the highlighted company row into view on keyboard navigation
  useEffect(() => {
    if (effectiveHighlight < 0 || effectiveHighlight >= filtered.length) return;
    const row = listRef.current?.children[effectiveHighlight] as HTMLElement | undefined;
    row?.scrollIntoView({ block: 'nearest' });
  }, [effectiveHighlight, filtered.length]);

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={`form-input ${styles.trigger}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
        aria-label="Select company"
      >
        <span className={selected ? '' : styles.placeholder}>
          {selected ? selected.name : 'Select a company'}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div ref={popoverRef} className={styles.popover} onBlur={handlePopoverBlur}>
          <div className={styles.searchWrapper}>
            <input
              ref={inputRef}
              type="text"
              className={`form-input ${styles.search}`}
              placeholder="Search companies…"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleInputKeyDown}
              aria-label="Search companies"
            />
          </div>

          <div className={styles.listArea}>
            {isLoading && <div className={styles.hint}>Loading…</div>}
            {!isLoading && companies.length === 0 && (
              <div className={styles.hint}>No companies yet</div>
            )}
            {!isLoading && companies.length > 0 && filtered.length === 0 && (
              <div className={styles.hint}>No matches</div>
            )}
            {filtered.length > 0 && (
              <ul ref={listRef} className={styles.list}>
                {filtered.map((company, idx) => (
                  <li
                    key={company.id}
                    className={`${styles.row} ${idx === effectiveHighlight ? styles.rowHighlighted : ''}`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(company);
                    }}
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showCreate && (
            <button
              type="button"
              tabIndex={-1}
              className={`${styles.createRow} ${effectiveHighlight === createIndex ? styles.createRowHighlighted : ''}`}
              onMouseEnter={() => setHighlightedIndex(createIndex)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              {trimmed ? <>+ Create &ldquo;{trimmed}&rdquo;</> : '+ Create new company'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
