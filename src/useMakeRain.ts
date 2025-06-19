import { animate } from "motion";
import * as React from "react";

export function useMakeRain() {
  const rainProgressRef = React.useRef(0);
  const [rainStarted, setRainStarted] = React.useState(false);

  return [
    rainProgressRef,
    React.useCallback(() => {
      setRainStarted(true);
      animate(
        (t) => {
          rainProgressRef.current = t;
        },
        {
          easing: "linear",
          duration: 5,
        }
      );
    }, []),
    rainStarted,
  ] as [React.MutableRefObject<number>, () => void, boolean];
}
