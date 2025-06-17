import { Plane } from "@react-three/drei";
import { PuddleMaterial } from "./PuddleMaterial";
import { Roadline } from "./Roadline";
import { Trash } from "./Trash";

export function Floor({
  rainProgressRef,
}: {
  rainProgressRef: React.MutableRefObject<number>;
}) {
  return (
    <Plane args={[1, 1]} rotation-x={-Math.PI / 2}>
      <PuddleMaterial rainProgressRef={rainProgressRef} />

      <Roadline />
      <Trash />
    </Plane>
  );
}
