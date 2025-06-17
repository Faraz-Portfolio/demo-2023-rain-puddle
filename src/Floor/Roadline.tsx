import { Decal, DecalProps, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Roadline(props: DecalProps) {
  const maps = useTexture({
    map: "/decals/roadLine/sfinp0d_2K_Albedo.jpg",
    alphaMap: "/decals/roadLine/sfinp0d_2K_Opacity.jpg",
    normalMap: "/decals/roadLine/sfinp0d_2K_Normal.jpg",
    roughnessMap: "/decals/roadLine/sfinp0d_2K_Roughness.jpg",
    aoMap: "/decals/roadLine/sfinp0d_2K_AO.jpg",
  });

  return (
    <>
      <Decal
        renderOrder={1}
        scale={[0.5 * 1.8, 0.05 * 1.8, 0.5]}
        rotation-z={-Math.PI / 2}
        frustumCulled={false}
        position-y={-0.025}
      >
        <meshStandardMaterial
          {...maps}
          polygonOffset
          polygonOffsetFactor={-1} // The material should take precedence over the original
          depthWrite={false}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Decal>
    </>
  );
}
