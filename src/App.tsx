import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { Floor } from "./Floor";
import { Lights } from "./Lights";
import { Rain } from "./Rain";
import "./styles.css";
import { useMakeRain } from "./useMakeRain";

export default function App() {
  const [rainProgressRef, onRainStart, rainStarted] = useMakeRain();

  return (
    <>
      <Canvas shadows>
        <OrbitControls
          makeDefault
          // autoRotate
          // autoRotateSpeed={0.25}
          // onChange={(e) => {
          //   console.log(
          //     e.target.object.position.toArray(),
          //     // @ts-ignore
          //     e.target.target.toArray()
          //   );
          // }}
        />
        <PerspectiveCamera
          position={[
            0.613725247365501, 0.3394033648663526, 0.42126638003592926,
          ]}
          makeDefault
        />

        <Lights rainEnabled={rainStarted} />
        <Rain rainProgressRef={rainProgressRef}>
          <Floor rainProgressRef={rainProgressRef} />
        </Rain>

        {/* <Perf /> */}

        <EffectComposer>
          <Vignette offset={0.4} darkness={0.75} />
          <BrightnessContrast brightness={-0.05} contrast={0.05} />
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            luminanceSmoothing={0.0}
            intensity={0.1}
          />
        </EffectComposer>
      </Canvas>
      {!rainStarted && <button onClick={onRainStart}>Start</button>}
    </>
  );
}
