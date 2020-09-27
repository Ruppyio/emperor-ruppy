/* eslint-disable import/prefer-default-export */
/**
 * Capitalizes the first letter of a string
 * @param text Text to capitalize
 */
export function capitalizeFirstCharacter(text: string): string {
  return text.replace(new RegExp(`^${text[0]}`), (firstCharacter) =>
    firstCharacter.toUpperCase()
  );
}

/**
 * Helper to record the amount of time elapsed between two points during execution.
 *
 * @returns A function that returns the difference in milliseconds
 *
 * @example
 * const endTimer = startTimer();
 *
 * for (let count = 0; count < 1_000_000; count++) {
 * 	count % 10;
 * }
 *
 * const elapsed = endTimer();
 */
export function startTimer(): () => number {
  const NS_TO_MS = 1000000;
  const start = process.hrtime.bigint();

  /**
   * End the timer and return the duration elapsed.
   * @returns The amount of time elapsed in milliseconds.
   */
  return () => {
    const diff = process.hrtime.bigint() - start;

    if (diff < Number.MAX_SAFE_INTEGER) {
      return Number(diff) / NS_TO_MS;
    }

    throw new TypeError('Diff was larger than `Number.MAX_SAFE_INTEGER`');
  };
}
