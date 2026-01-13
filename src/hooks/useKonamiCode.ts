import { useState, useEffect, useCallback } from 'react';

// The secret sequence: up up down down left right left right Enter Space
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
  ' ', // Space
];

export const useKonamiCode = (onActivate?: () => void) => {
  const [isActivated, setIsActivated] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const resetSequence = useCallback(() => {
    setSequence([]);
  }, []);

  const deactivate = useCallback(() => {
    setIsActivated(false);
    resetSequence();
  }, [resetSequence]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;
      const newSequence = [...sequence, key].slice(-KONAMI_CODE.length);
      setSequence(newSequence);

      // Check if the sequence matches
      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every(
          (k, i) => k === KONAMI_CODE[i]
        );

        if (isMatch && !isActivated) {
          setIsActivated(true);
          onActivate?.();
          // Play a subtle sound or haptic feedback could go here
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, isActivated, onActivate]);

  // Reset sequence after 3 seconds of inactivity
  useEffect(() => {
    if (sequence.length === 0) return;

    const timeout = setTimeout(() => {
      resetSequence();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [sequence, resetSequence]);

  return { isActivated, deactivate, sequence };
};

export default useKonamiCode;
