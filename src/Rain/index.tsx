import { useFrame } from "@react-three/fiber";
import { Howl } from "howler";
import * as React from "react";
import { Drops } from "./Drops";
import { Splashes } from "./Splashes";

export function Rain({
  children,
  rainProgressRef,
}: React.PropsWithChildren<{
  rainProgressRef: React.MutableRefObject<number>;
}>) {
  const rainSound = React.useMemo(
    () =>
      new Howl({
        src: "/sounds/light-rain-109591.mp3",
        loop: true,
        volume: 0.5,
      }),
    []
  );

  const nightSound = React.useMemo(
    () =>
      new Howl({
        src: "/sounds/night-ambience-17064.mp3",
        loop: true,
        volume: 0.5,
      }),
    []
  );

  const playingSound = React.useRef(false);
  useFrame(() => {
    if (rainProgressRef.current > 0 && !playingSound.current) {
      rainSound.volume(0);
      nightSound.volume(0);

      rainSound.play();
      nightSound.play();
      playingSound.current = true;
    }

    if (rainSound.playing()) {
      rainSound.volume(Math.min(rainProgressRef.current, 0.5));
    }

    if (nightSound.playing()) {
      nightSound.volume(Math.min(rainProgressRef.current ** 0.5, 1));
    }
  });

  return (
    <>
      <Drops rainProgressRef={rainProgressRef} />
      <Splashes rainProgressRef={rainProgressRef}>{children}</Splashes>
    </>
  );
}
