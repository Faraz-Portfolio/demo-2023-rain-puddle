import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";
import CSM from "../CSM";

function getNoise(
  noiseFunc: ReturnType<typeof createNoise2D>,
  min: number,
  max: number
) {
  return (x: number, y: number) => {
    return THREE.MathUtils.mapLinear(noiseFunc(x, y), -1, 1, min, max);
  };
}

export function Drops({ randPositions }: { randPositions: Float32Array }) {
  const vertexShader = useMemo(
    () => /* glsl */ `
			uniform float uTime;

			varying vec3 vPosition;
			varying vec2 vUv;

			void main() {
				vPosition = position;
				vUv = uv;
        

				vec3 pos = position;
				// vec3 finalPos = pos + vec3(0.0, -0.5, 0.0);

				// vec3 lerpedPos = mix(pos, finalPos, mod(uTime * 10.0, aLifetime));

				// csm_Position = lerpedPos;
				// csm_PositionRaw = projectionMatrix * instanceMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(pos, 0.0));
			}
		`,
    []
  );

  const fragmentShader = useMemo(
    () => /* glsl */ `
			uniform float uTime;

			varying vec3 vPosition;
			varying vec2 vUv;

			float sdUnevenCapsule( vec2 p, float r1, float r2, float h ) {
				p.x = abs(p.x);
				float b = (r1-r2)/h;
				float a = sqrt(1.0-b*b);
				float k = dot(p,vec2(-b,a));
				if( k < 0.0 ) return length(p) - r1;
				if( k > a*h ) return length(p-vec2(0.0,h)) - r2;
				return dot(p, vec2(a,b) ) - r1;
			}

      float blur(float steps) {
        vec2 coord = vUv - 0.5;
        coord *= 10.0;

        // Get n droplets around this one and average their distance
        float total = 0.0;
        for (float i = 0.0; i < steps; i++) {
          float dropletDistance = sdUnevenCapsule(coord, 0.05, 0.0, 2.0);
          dropletDistance = 1.0 - smoothstep(0.0, 0.05, dropletDistance);
          total += dropletDistance;
          coord += vec2(0.0, 0.2);
        }
        return total / steps;
      }


			void main() {
				vec2 uv = vUv;
				uv.x -= 0.5;
				uv.y -= 0.25;
				uv *= 10.0;

				float dropletDistance = blur(5.0);
				// dropletDistance = 1.0 - smoothstep(0.0, 0.1, dropletDistance);

        csm_DiffuseColor.a = dropletDistance * 0.5;
        // csm_DiffuseColor.rgb = vec3(dropletDistance);
			}
		`,
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const instanceMeshRef = useRef<THREE.InstancedMesh>(null!);
  const _dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ camera }) => {
    for (let i = 0; i < randPositions.length; i += 4) {
      const x = randPositions[i];
      const y = randPositions[i + 1];
      const z = randPositions[i + 2];
      const scale = randPositions[i + 3];

      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(scale);
      _dummy.rotation.set(0, 0, 0);
      _dummy.rotation.y = Math.atan2(
        camera.position.x - _dummy.position.x,
        camera.position.z - _dummy.position.z
      );

      _dummy.updateMatrix();
      instanceMeshRef.current.setMatrixAt(i / 3, _dummy.matrix);
    }
    instanceMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instanceMeshRef}
      args={[null!, null!, randPositions.length / 4]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <CSM
        key={vertexShader + fragmentShader}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        transmission={1}
        roughness={0.4}
        thickness={1}
      />
    </instancedMesh>
  );
}
