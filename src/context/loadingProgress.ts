/**
 * Bootstrap loading percentage (0–~91) until the 3D asset calls finishTo100().
 * Also used as a failsafe if the asset never signals ready.
 */
export type LoadingProgressApi = {
  start: () => void;
  dispose: () => void;
  finishTo100: () => Promise<number>;
};

export function createLoadingProgress(
  setLoading: (value: number) => void
): LoadingProgressApi {
  let percent = 0;
  let interval: ReturnType<typeof setInterval> | null = null;
  let finished = false;

  const clear = () => {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  };

  return {
    start() {
      clear();
      finished = false;
      percent = 0;
      interval = window.setInterval(() => {
        if (finished) return;
        if (percent <= 50) {
          percent += Math.round(Math.random() * 5);
          setLoading(percent);
        } else {
          clear();
          interval = window.setInterval(() => {
            if (finished) return;
            percent += Math.round(Math.random());
            setLoading(percent);
            if (percent > 91) {
              clear();
            }
          }, 2000);
        }
      }, 100);
    },

    dispose() {
      finished = true;
      clear();
    },

    finishTo100() {
      if (finished) {
        return Promise.resolve(100);
      }
      finished = true;
      clear();
      return new Promise<number>((resolve) => {
        interval = window.setInterval(() => {
          if (percent < 100) {
            percent++;
            setLoading(percent);
          } else {
            clear();
            resolve(100);
          }
        }, 4);
      });
    },
  };
}
