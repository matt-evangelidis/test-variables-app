const calculateExponentialWaitTimeMs = (baseWaitMs: number, tries: number) => {
  if (tries <= 0 || baseWaitMs < 0) {
    throw new Error("Invalid arguments");
  }

  if (tries === 1) {
    return baseWaitMs;
  }

  const multiplier = 2 ** tries;

  return baseWaitMs * multiplier;
};

const promiseWait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type RetryUntilOptions = {
  baseWaitMs: number;
  maxWaitMs: number;
  maxTries: number;
};

const DEFAULT_OPTIONS: RetryUntilOptions = {
  baseWaitMs: 100,
  maxWaitMs: 2500,
  maxTries: 5,
};

const _retryUntil = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: RetryUntilOptions,
  attemptNumber: number,
): Promise<T> => {
  if (attemptNumber <= 0) {
    throw new Error("Invalid arguments");
  }

  const { baseWaitMs, maxTries, maxWaitMs } = options;

  if (attemptNumber === maxTries) {
    throw new Error("Max tries exceeded");
  }

  const data = await fn();

  if (condition(data)) {
    return data;
  }

  const timeToWaitMs = Math.min(
    calculateExponentialWaitTimeMs(baseWaitMs, attemptNumber),
    maxWaitMs,
  );

  await promiseWait(timeToWaitMs);

  return _retryUntil(fn, condition, options, attemptNumber + 1);
};

export const retryUntil = <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  optionOverrides: Partial<RetryUntilOptions> = {},
): Promise<T> => {
  const options: RetryUntilOptions = {
    ...DEFAULT_OPTIONS,
    ...optionOverrides,
  };

  return _retryUntil(fn, condition, options, 1);
};
