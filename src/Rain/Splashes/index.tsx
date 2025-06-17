import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import CSM from "../../CSM";
import { useSplashPositions } from "./useSplashPositions";

interface SplashesProps {
  count?: number;
  rainProgressRef: React.MutableRefObject<number>;
}

export const Splashes = React.forwardRef<
  THREE.InstancedMesh,
  React.PropsWithChildren<SplashesProps>
>(({ count = 2000, children, rainProgressRef }, ref) => {
  const splashFlipBook = useTexture("/Splash.png");

  const childrenGroupRef = React.useRef<THREE.Group>(null!);
  const splashRef = React.useRef<THREE.InstancedMesh>(null!);

  useSplashPositions(childrenGroupRef, splashRef);

  const vertexShader = React.useMemo(
    () => /* glsl */ `
        attribute float aSplashProgress;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vSplashProgress;
      
        void main() {
          vPosition = position;
          vUv = uv;
          vSplashProgress = aSplashProgress;

					csm_Position.y += 0.05;
        }
      `,
    []
  );

  const fragmentShader = React.useMemo(
    () => /* glsl */ `
        uniform sampler2D uFlipBook;
        uniform float uRainProgress;
  
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vSplashProgress;

        float mapLinear(float value, float inMin, float inMax, float outMin, float outMax) {
          return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
        }

        float fmod(float x, float y) {
          return x - y * trunc(x / y);
        }

        /**
          Port unity function - Unity_Flipbook_float
         */
        vec2 getFlipbookUv(
          vec2 uv,
          float width,
          float height,
          float tile,
          vec2 invert
        ) {
          tile = fmod(tile, width * height);
          vec2 tileCount = vec2(1.0) / vec2(width, height);
          float tileY = abs(invert.y * height - (floor(tile * tileCount.x) + invert.y * 1.0));
          float tileX = abs(invert.x * width - ((tile - width * floor(tile * tileCount.x)) + invert.x * 1.0));
          return (uv + vec2(tileX, tileY)) * tileCount;
        }
  
        void main() {
        //   float progress = 0.5;
          float progress = mapLinear(vSplashProgress, 0.0, 0.3, 0.0, 1.0);
          progress = 1.0 - clamp(progress, 0.0, 1.0);

          float width = 4.0;
          float height = 5.0;
          float tiling = floor(progress * width * height);
          vec2 uv = getFlipbookUv(vUv, width, height, tiling, vec2(0.0, 1.0));
          vec4 texel = texture2D(uFlipBook, uv);

          float rainProgress = smoothstep(0.0, 0.5, uRainProgress);
          rainProgress = clamp(rainProgress, 0.0, 1.0);
          csm_DiffuseColor.a = texel.a * 0.1 * rainProgress;
        }
      `,
    []
  );

  const uniforms = React.useMemo(
    () => ({
      uFlipBook: { value: splashFlipBook },
      uRainProgress: { value: 0 },
    }),
    []
  );

  useFrame(() => {
    uniforms.uRainProgress.value = rainProgressRef.current;
  });

  return (
    <>
      <instancedMesh
        ref={splashRef}
        args={[null, null, count]}
        frustumCulled={false}
        renderOrder={2}
      >
        <planeGeometry args={[0.2 * 0.2, 0.1 * 0.2]}>
          <instancedBufferAttribute
            attach={"attributes-aSplashProgress"}
            args={[new Float32Array(count), 1]}
            itemSize={1}
            count={count}
          />
        </planeGeometry>
        <CSM
          key={vertexShader + fragmentShader}
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </instancedMesh>
      <group ref={childrenGroupRef}>{children}</group>
    </>
  );
});
