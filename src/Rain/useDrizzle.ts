import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { createNoise2D } from "simplex-noise";
import * as THREE from "three";

function getNoise(
  noiseFunc: ReturnType<typeof createNoise2D>,
  min: number,
  max: number
) {
  return (x: number, y: number) => {
    return THREE.MathUtils.mapLinear(noiseFunc(x, y), -1, 1, min, max);
  };
}

export function useDrizzle(
  instancedMeshRef: React.MutableRefObject<THREE.InstancedMesh>
) {
  const count = 5000;
  const seed = 1;

  const noise = useMemo(() => createNoise2D(() => seed), [seed]);

  const _dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ camera }, dt) => {
    const instancedMesh = instancedMeshRef.current;
    for (let i = 0; i < count; i++) {
      instancedMesh.getMatrixAt(i, _dummy.matrix);
      _dummy.matrix.decompose(_dummy.position, _dummy.quaternion, _dummy.scale);

      _dummy.position.y -= dt * 5;
      if (_dummy.position.y < -0.2) {
        _dummy.position.copy(camera.position);
        _dummy.position.x += getNoise(noise, -5, 5)(0, i);
        _dummy.position.y += getNoise(noise, -0.2, 5)(0, i + 10);
        _dummy.position.z += getNoise(noise, -5, 5)(0, i + 20);

        _dummy.scale.setScalar(getNoise(noise, 0.4, 0.6)(0, i + 30));
      }

      _dummy.lookAt(camera.position);
      _dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, _dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
  });
}
