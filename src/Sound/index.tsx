import { Howl } from "howler";
import { useMemo } from "react";

export function useSound() {
  const rainLoopSound = useMemo(
    () =>
      new Howl({
        src: "/sounds/light-rain-109591.mp3",
      }),
    []
  );

  return () => {
    rainLoopSound.volume(0.5);
    rainLoopSound.loop();
    rainLoopSound.fade(0, 0.5, 1000).play();
  };
}
