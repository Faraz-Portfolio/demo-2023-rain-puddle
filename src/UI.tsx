import {
  FaArtstation,
  FaCode,
  FaLinkedin,
  FaSquareGithub,
  FaSquareInstagram,
  FaSquareTwitter,
  FaSquareXTwitter,
} from "react-icons/fa6";

export function UI() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          zIndex: 1000,
          padding: "1rem 2rem",
          boxSizing: "border-box",
          maxWidth: "700px",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <h1
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "sans-serif",
            color: "#fff",
            margin: 0,
            fontWeight: "800",
          }}
        >
          PUDDLE IN RAIN
        </h1>
        <p
          style={{
            width: "100%",
            textAlign: "center",
            fontFamily: "sans-serif",
            color: "#fff",
            margin: 0,
            fontWeight: "200",
          }}
        >
          A demo of rain puddle simulation using Three.js and React Three Fiber.
          Uses my{" "}
          <a
            href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial"
            target="_blank"
            style={{
              color: "#3bb7ff",
              textDecoration: "underline",
              pointerEvents: "all",
            }}
          >
            Three-Custom-Shader-Material
          </a>{" "}
          library to add the puddle shader to the road material.
        </p>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "1rem 1rem",
          boxSizing: "border-box",
          color: "#fff",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <a
            href="https://github.com/FarazzShaikh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareGithub size="1.5rem" />
          </a>
          <a
            href="https://x.com/cantBeFaraz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareTwitter size="1.5rem" />
          </a>
          <a
            href="https://x.com/cantBeFaraz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareXTwitter size="1.5rem" />
          </a>
          <a
            href="https://www.linkedin.com/in/faraz-shaikh-811655166/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaLinkedin size="1.5rem" />
          </a>
          <a
            href="https://www.instagram.com/cantBeFaraz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaSquareInstagram size="1.5rem" />
          </a>
          <a
            href="https://www.artstation.com/farazshaikh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              pointerEvents: "all",
            }}
          >
            <FaArtstation size="1.5rem" />
          </a>
        </div>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "0.9rem",
            margin: 0,
            textAlign: "right",
          }}
        >
          Design and code by Faraz
          <br />
          <a
            href="mailto:farazzshaikh@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "underline",
              pointerEvents: "all",
            }}
          >
            farazzshaikh@gmail.com
          </a>
        </p>
        <p
          style={{
            textAlign: "right",
            fontFamily: "sans-serif",
            color: "#fff",
            margin: 0,
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          Updated: June 2025
        </p>
      </footer>

      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <a
          href="https://github.com/Faraz-Portfolio/demo-2025-car-paint"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "3rem",
            height: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            pointerEvents: "all",
            fontFamily: "sans-serif",
            textDecoration: "none",
            fontSize: "0.8rem",
          }}
        >
          <FaCode size="1.5rem" />
          Code
        </a>
      </div>
    </>
  );
}
