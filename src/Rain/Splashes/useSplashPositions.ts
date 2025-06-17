import { useFrame } from "@react-three/fiber";
import * as React from "react";

import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";

const isMesh = (obj: THREE.Object3D): obj is THREE.Mesh =>
  (obj as THREE.Mesh).isMesh;

export function useSplashPositions(
  groupRef: React.MutableRefObject<THREE.Group>,
  instancedMeshRef: React.MutableRefObject<THREE.InstancedMesh>
) {
  const worldSkyDirection = React.useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const samplersRef = React.useRef<
    {
      sampler: MeshSurfaceSampler;
      mesh: THREE.Mesh;
    }[]
  >([]);

  React.useEffect(() => {
    samplersRef.current = [];
    groupRef.current.traverse((obj) => {
      if (isMesh(obj)) {
        const mesh = obj;
        const positionAttr = mesh.geometry.getAttribute("position");
        const normalAttr = mesh.geometry.getAttribute("normal");
        const count = positionAttr.count;

        const skyWeightAttrArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const position = new THREE.Vector3();
          const normal = new THREE.Vector3();
          position.fromBufferAttribute(positionAttr, i);
          normal.fromBufferAttribute(normalAttr, i);

          let skyWeight = normal.dot(worldSkyDirection);
          skyWeight = skyWeight >= 0 ? 1 : 0;
          skyWeightAttrArray[i] = skyWeight;
        }

        const skyWeightAttr = new THREE.InstancedBufferAttribute(
          skyWeightAttrArray,
          1
        );
        mesh.geometry.setAttribute("skyWeight", skyWeightAttr);

        const sampler = new MeshSurfaceSampler(obj);
        sampler.setWeightAttribute("skyWeight");
        sampler.build();
        samplersRef.current.push({
          sampler,
          mesh: obj,
        });
      }
    });
  }, []);

  const _dummy = React.useMemo(() => new THREE.Object3D(), []);
  const _dummyY = React.useMemo(() => [], []);
  const _InitialY = React.useMemo(() => [], []);
  useFrame(({ camera }, dt) => {
    if (samplersRef.current.length === 0) return;

    const instancedMesh = instancedMeshRef.current;
    const samplers = samplersRef.current;

    const count = instancedMesh.count;
    const countPerMesh = Math.ceil(count / samplers.length);

    const progressAttr = instancedMesh.geometry.getAttribute("aSplashProgress");

    let j = 0;

    for (const { sampler, mesh } of samplers) {
      for (let i = 0; i < countPerMesh; i++) {
        instancedMesh.getMatrixAt(j, _dummy.matrix);
        _dummy.matrix.decompose(
          _dummy.position,
          _dummy.quaternion,
          _dummy.scale
        );

        if (_dummyY[j] === undefined) {
          _dummyY[j] = 0;
          _InitialY[j] = 0;
        }

        _dummyY[j] -= dt * 2.5;

        if (_dummyY[j] < -0.2) {
          sampler.sample(_dummy.position);
          _dummy.position.applyMatrix4(mesh.matrixWorld);
          _dummy.position.y -= 0.04;
          _dummyY[j] = THREE.MathUtils.randFloat(-0.1, 2);
          _InitialY[j] = _dummyY[j];
          _dummy.scale.x = THREE.MathUtils.randFloat(0.5, 1);
        }

        const progress = THREE.MathUtils.mapLinear(
          _dummyY[j],
          _InitialY[j],
          -0.2,
          1,
          0
        );

        progressAttr.setX(j, progress);

        _dummy.rotation.y = Math.atan2(
          camera.position.x - _dummy.position.x,
          camera.position.z - _dummy.position.z
        );

        _dummy.updateMatrix();
        instancedMesh.setMatrixAt(j, _dummy.matrix);
        j++;
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    progressAttr.needsUpdate = true;
  });
}
