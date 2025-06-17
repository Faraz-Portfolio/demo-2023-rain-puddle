import { Decal, useTexture } from "@react-three/drei";
import { AdditiveBlending, MathUtils } from "three";

export function Trash() {
  const maps = useTexture({
    map: "/decals/trash/shmpulh_4K_Albedo.jpg",
    alphaMap: "/decals/trash/shmpulh_4K_Opacity.jpg",
    normalMap: "/decals/trash/shmpulh_4K_Normal.jpg",
    roughnessMap: "/decals/trash/shmpulh_4K_Roughness.jpg",
    aoMap: "/decals/trash/shmpulh_4K_AO.jpg",
  });

  return (
    <>
      <Decal
        renderOrder={1}
        scale={0.6}
        frustumCulled={false}
        rotation-z={MathUtils.degToRad(30)}
        position={[0, 0.1, 0.1]}
      >
        <meshStandardMaterial
          {...maps}
          polygonOffset
          polygonOffsetFactor={-2}
          depthWrite={false}
          transparent
          blending={AdditiveBlending}
        />
      </Decal>
      <Decal
        renderOrder={1}
        scale={0.5}
        frustumCulled={false}
        position={[0, -0.4, -0.2]}
      >
        <meshStandardMaterial
          {...maps}
          polygonOffset
          polygonOffsetFactor={-3}
          depthWrite={false}
          transparent
          blending={AdditiveBlending}
        />
      </Decal>
    </>
  );
}
