import { useFrame } from "@react-three/fiber";
import { Howl } from "howler";
import * as React from "react";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";

export function Thunder({ rainEnabled }: { rainEnabled: boolean }) {
  const lightformerRef = React.useRef<THREE.Mesh>(null!);

  const sprites = {
    thunder1: [2000, 16000],
    thunder2: [16000, 28000],
    // thunder3: [28000, 46000],
    // thunder4: [46000, 53000],
  };

  const thunderSounds = React.useMemo(
    () =>
      new Howl({
        src: "/demo-2023-rain-puddle/sounds/thunderstorm-14708.mp3",
        sprite: sprites as any,
      }),
    [sprites]
  );

  const noise = React.useMemo(() => createNoise2D(), []);

  const thunderingDuration = React.useRef(-1);

  React.useEffect(() => {
    if (!rainEnabled) return;

    const getRandInterval = () => THREE.MathUtils.randInt(5000, 20000);
    const getRandDuration = () => THREE.MathUtils.randInt(500, 1000);
    const getRandSprite = () =>
      Object.keys(sprites)[
        THREE.MathUtils.randInt(0, Object.keys(sprites).length - 1)
      ];

    setTimeout(() => {
      makeThunder();
    }, 5 * 1000);
    const makeThunder = () => {
      if (!rainEnabled) return;

      const sprite = getRandSprite();
      const duration = sprites[sprite][1] - sprites[sprite][0];
      thunderingDuration.current = duration / 20;
      thunderSounds.fade(0, 1, 0.5).play(sprite);
      setTimeout(() => {
        thunderSounds.stop();
        thunderingDuration.current = -1;
        setTimeout(() => {
          makeThunder();
        }, getRandInterval());
      }, duration);
    };
  }, [rainEnabled, thunderSounds, sprites]);

  useFrame(({ clock }, dt) => {
    if (thunderingDuration.current > 0) {
      const time = clock.elapsedTime;
      const n = THREE.MathUtils.mapLinear(noise(0, time * 5), -1, 1, 0, 1);

      const mat = lightformerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.smoothstep(n, 0.7, 0.95);

      thunderingDuration.current -= dt * 1000;
    } else {
      const mat = lightformerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0;
    }
  });

  return (
    <mesh
      ref={lightformerRef}
      position={[-2, 1, -1]}
      scale={[1, 2, 0.1]}
      material-transparent={true}
    >
      <boxGeometry />
      <meshBasicMaterial
        color={new THREE.Color("#8886f5").multiplyScalar(100)}
        transparent
      />
    </mesh>
  );
}
