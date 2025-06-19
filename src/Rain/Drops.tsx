import { useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

interface DropsProps {
  count?: number;
  rainProgressRef: React.MutableRefObject<number>;
}

export const Drops = React.forwardRef<THREE.InstancedMesh, DropsProps>(
  ({ count = 1000, rainProgressRef }, ref) => {
    const dropsRef = React.useRef<THREE.InstancedMesh>(null!);
    const _dummy = React.useMemo(() => new THREE.Object3D(), []);
    const initialY = React.useMemo(() => new Float32Array(count).fill(0), []);

    React.useEffect(() => {
      const dropsMesh = dropsRef.current;
      for (let i = 0; i < count; i++) {
        _dummy.position.set(
          THREE.MathUtils.randFloatSpread(5),
          THREE.MathUtils.randFloat(-0.1, 5),
          THREE.MathUtils.randFloatSpread(5)
        );

        _dummy.updateMatrix();
        dropsMesh.setMatrixAt(i, _dummy.matrix);
      }
      dropsMesh.instanceMatrix.needsUpdate = true;
    }, []);

    useFrame(({ camera }, dt) => {
      const dropsMesh = dropsRef.current;

      for (let i = 0; i < count; i++) {
        dropsMesh.getMatrixAt(i, _dummy.matrix);
        _dummy.matrix.decompose(
          _dummy.position,
          _dummy.quaternion,
          _dummy.scale
        );

        _dummy.position.y -= dt * 2.5;
        if (_dummy.position.y <= 0) {
          // _dummy.position.copy(camera.position);
          // _dummy.position.x += THREE.MathUtils.randFloatSpread(5);
          // _dummy.position.y += THREE.MathUtils.randFloat(-0.1, 5);
          // _dummy.position.z += THREE.MathUtils.randFloatSpread(5);
          _dummy.position.set(
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloat(-0.1, 2),
            THREE.MathUtils.randFloatSpread(1)
          );
          initialY[i] = _dummy.position.y;
          _dummy.scale.setScalar(THREE.MathUtils.randFloat(0.1, 0.5));
        }

        _dummy.rotation.y = Math.atan2(
          camera.position.x - _dummy.position.x,
          camera.position.z - _dummy.position.z
        );

        _dummy.updateMatrix();
        dropsMesh.setMatrixAt(i, _dummy.matrix);
      }
      dropsMesh.instanceMatrix.needsUpdate = true;
    });

    const vertexShader = React.useMemo(
      () => /* glsl */ `
        uniform float uTime;
  
        varying vec3 vPosition;
        varying vec2 vUv;
  
        void main() {
          vPosition = position;
          vUv = uv;
        }
      `,
      []
    );

    const fragmentShader = React.useMemo(
      () => /* glsl */ `
        uniform float uRainProgress;
  
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
          float dropletDistance = blur(5.0);
          float rainProgress = smoothstep(0.0, 0.5, uRainProgress);
          rainProgress = clamp(rainProgress, 0.0, 1.0);
          csm_DiffuseColor.a = dropletDistance * 0.1 * rainProgress;
        }
      `,
      []
    );

    const uniforms = React.useMemo(
      () => ({
        uRainProgress: { value: 0 },
      }),
      []
    );

    useFrame(({ gl }) => {
      gl.setRenderTarget;
      uniforms.uRainProgress.value = rainProgressRef.current;
    });

    return (
      <instancedMesh
        ref={dropsRef}
        args={[null!, null!, count]}
        renderOrder={2}
      >
        <planeGeometry args={[0.2, 0.3]} />
        <CSM
          key={vertexShader + fragmentShader}
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </instancedMesh>
    );
  }
);
