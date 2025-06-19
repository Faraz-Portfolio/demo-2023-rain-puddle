import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
// @ts-ignore
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

export function PuddleMaterial({
  rainProgressRef,
}: {
  rainProgressRef: React.MutableRefObject<number>;
}) {
  const maps = useTexture({
    map: "/demo-2023-rain-puddle/road/aerial_asphalt_01_diff_2k.jpg",
    normalMap: "/demo-2023-rain-puddle/road/aerial_asphalt_01_nor_gl_2k.jpg",
    roughnessMap: "/demo-2023-rain-puddle/road/aerial_asphalt_01_rough_2k.jpg",
    aoMap: "/demo-2023-rain-puddle/road/aerial_asphalt_01_ao_2k.jpg",
  });

  useLayoutEffect(() => {
    for (const key in maps) {
      // @ts-ignore
      maps[key].wrapS = maps[key].wrapT = THREE.RepeatWrapping;
      // @ts-ignore

      maps[key].repeat.set(1, 1);
    }
  }, [maps]);

  const vertexShader = useMemo(
    () => /* glsl */ `
			varying vec3 vPosition;
			varying vec2 vUv;
      varying vec3 vWorldPosition;

			void main() {
				vPosition = position;
				vUv = uv;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
			}
		`,
    []
  );

  const fragmentShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
			uniform float uTime;
      uniform float uRainFactor;

			varying vec3 vPosition;
			varying vec2 vUv;
      varying vec3 vWorldPosition;

			vec3 csm_PuddleNormal;
			float csm_PuddleNormalMask;

      #define MAX_RADIUS 2
      #define DOUBLE_HASH 0
      #define HASHSCALE1 .1031
      #define HASHSCALE3 vec3(.1031, .1030, .0973)

      float mapLinear(float x, float a1, float a2, float b1, float b2) {
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
      }

      float hash12(vec2 p) {
        vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);
      }

      vec2 hash22(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
        p3 += dot(p3, p3.yzx+19.19);
        return fract((p3.xx+p3.yz)*p3.zy);
      }

      vec3 getRipples(vec2 uv) {
        vec2 p0 = floor(uv);

        float time = uTime * 3.0;

        vec2 circles = vec2(0.);
        for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j) {
            for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i) {
              vec2 pi = p0 + vec2(i, j);
              #if DOUBLE_HASH
              vec2 hsh = hash22(pi);
              #else
              vec2 hsh = pi;
              #endif
              vec2 p = pi + hash22(hsh);

              float t = fract(0.3*time + hash12(hsh));
              vec2 v = p - uv;
              float d = length(v) - (float(MAX_RADIUS) + 1.)*t;

              float h = 1e-3;
              float d1 = d - h;
              float d2 = d + h;
              float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
              float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
              circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
            }
        }
        circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));
        float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*time + 0.5)*2.-1.)));
        vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
        return n;
      }

      float getPuddle(vec2 uv) {
        gln_tFBMOpts puddleNoiseOpts = gln_tFBMOpts(1.0, 0.5, 2.0, 0.5, 1.0, 3, false, false);
        float puddleNoise = gln_sfbm((uv + vec2(3.0, 0.0)) * 0.2, puddleNoiseOpts);
        puddleNoise = gln_normalize(puddleNoise);
        puddleNoise = smoothstep(0.0, 0.7, puddleNoise);
        return puddleNoise;
      }

      float sdCircle(vec2 p, float radius) {
        return length(p) - radius;
      }


			vec3 perturbNormal(vec3 inputNormal, vec3 noiseNormal, float strength) {
				vec3 noiseNormalOrthogonal = noiseNormal - (dot(noiseNormal, inputNormal) * inputNormal);
				vec3 noiseNormalProjectedBump = mat3(csm_internal_vModelViewMatrix) * noiseNormalOrthogonal;
				return normalize(inputNormal - (noiseNormalProjectedBump * strength));
			}

			void main() {
        float roughnessProgress = smoothstep(0.0, 0.75, uRainFactor);
        roughnessProgress = clamp(roughnessProgress, 0.0, 1.0);

        float normalProgress = smoothstep(0.75, 1.0, uRainFactor);
        normalProgress = clamp(normalProgress, 0.0, 1.0);

				// vec4 puddleTexColor = texture2D(uRippleTexture, vUv);
				float puddleNoise = getPuddle(vPosition.xy * 15.0);

				// // Normals
				csm_PuddleNormal = vNormal;
				csm_PuddleNormalMask = smoothstep(0.2, 1.0, puddleNoise) * normalProgress;
				// csm_PuddleNormalMask = smoothstep(0.0, 1.0, puddleNoise);

				// Generate noisy normals
				gln_tFBMOpts noiseNormalNoiseOpts = gln_tFBMOpts(1.0, 0.5, 2.0, 0.5, 1.0, 4, false, false);
				vec3 noiseNormalPosition = vPosition * 10.0;
				noiseNormalPosition.y += uTime * 1.0;
				float noiseX = gln_sfbm(noiseNormalPosition, noiseNormalNoiseOpts);
				float noiseY = gln_sfbm(noiseNormalPosition + 0.5, noiseNormalNoiseOpts);
				float noiseZ = gln_sfbm(noiseNormalPosition + 1.0, noiseNormalNoiseOpts);
				vec3 normalNoise = vec3(noiseX, noiseY, noiseZ);
				normalNoise = normalize(normalNoise);

				// // Peturb puddle normals
				csm_PuddleNormal = perturbNormal(csm_PuddleNormal, normalNoise, 0.02);

				// // Roughness
        float prevRoughness = csm_Roughness;
				csm_Roughness = 1.0 - csm_PuddleNormalMask;
				csm_Roughness = clamp(csm_Roughness, 0.0, 0.1);
        csm_Roughness = mix(prevRoughness, csm_Roughness, roughnessProgress);
				// csm_FragColor = vec4(vec3(csm_Roughness), 1.0);

				// // Ripples
				vec3 rippleNormals = getRipples(vPosition.xy * 40.0);
				csm_PuddleNormal = perturbNormal(csm_PuddleNormal, rippleNormals, 0.25 * uRainFactor);
      
        float bumpMask = clamp(csm_Roughness, 0.0, 1.0);
        csm_Bump = rippleNormals * bumpMask * normalProgress;

        float circle = 1. - sdCircle(vWorldPosition.xz, 0.2);
        circle = smoothstep(0.7, 0.85, circle); 

        csm_DiffuseColor.a = circle;
			}
		`),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRainFactor: { value: 0 },
    }),
    []
  );

  const patchMap = useMemo(
    () => ({
      "*": {
        "#include <normal_fragment_maps>": `
				#include <normal_fragment_maps>
				normal = mix(normal, csm_PuddleNormal, csm_PuddleNormalMask);
			`,
      },
    }),
    []
  );

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uRainFactor.value = rainProgressRef.current;
  });

  return (
    <CSM
      key={vertexShader + fragmentShader}
      baseMaterial={THREE.MeshPhysicalMaterial}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      patchMap={patchMap}
      transparent
      {...maps}
    />
  );
}
