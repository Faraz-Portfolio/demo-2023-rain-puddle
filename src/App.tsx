import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { Floor } from "./Floor";
import { Lights } from "./Lights";
import { Rain } from "./Rain";
import { useMakeRain } from "./useMakeRain";

export default function App() {
  const [rainProgressRef, onRainStart, rainStarted] = useMakeRain();

  return (
    <>
      <Canvas
        shadows={false}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
        }}
        style={{
          filter: "contrast(1.2) saturate(1.1) brightness(1.1)",
        }}
      >
        <OrbitControls
          makeDefault
          autoRotate={rainStarted}
          autoRotateSpeed={-0.25}
        />
        <PerspectiveCamera
          position={[
            0.713725247365501, 0.3394033648663526, 0.32126638003592926,
          ]}
          makeDefault
        />

        <Lights rainEnabled={rainStarted} />
        <Rain rainProgressRef={rainProgressRef}>
          <Floor rainProgressRef={rainProgressRef} />
        </Rain>

        {/* <Perf /> */}

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            luminanceSmoothing={0.0}
            intensity={0.05}
          />
          <ToneMapping />
        </EffectComposer>
      </Canvas>

      {/* Grading */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, rgba(0, 0, 0, 0) 50%,  rgba(0, 0, 0, 1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 255, 0.2) 100%)",
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0) 40%, rgba(255, 222, 165, 0.2) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "7rem",
          right: "1rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        {!rainStarted && (
          <button
            style={{
              padding: "8px 16px",
              fontSize: "16px",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              margin: 0,
              width: "12rem",
            }}
            onClick={onRainStart}
          >
            Start
          </button>
        )}
        <p
          style={{
            color: "#ffffff",
            fontSize: "16px",
            margin: 0,
            fontFamily: "sans-serif",
            textAlign: "right",
          }}
        >
          Best with sound
        </p>
      </div>
    </>
  );
}
