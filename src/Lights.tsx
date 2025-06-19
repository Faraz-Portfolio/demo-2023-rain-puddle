import { Environment } from "@react-three/drei";
import { Thunder } from "./Rain/Thunder";

export function Lights({ rainEnabled }: { rainEnabled: boolean }) {
  return (
    <>
      <Environment frames={Infinity} resolution={128}>
        <Thunder rainEnabled={rainEnabled} />
        <Environment
          files={"/demo-2023-rain-puddle/shanghai_bund_2k.hdr"}
          background
        />
      </Environment>
    </>
  );
}
