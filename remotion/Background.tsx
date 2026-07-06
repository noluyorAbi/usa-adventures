import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";

// Airy sky gradient with a few slowly drifting clouds.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg2} 55%, #f3f8fd 100%)`,
      }}
    >
      {/* warm + cool glows */}
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -160,
          width: 900,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(closest-side, rgba(86,189,242,0.35), transparent)",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -160,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(closest-side, rgba(255,138,76,0.22), transparent)",
          filter: "blur(20px)",
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const x = interpolate((frame + i * 90) % 900, [0, 900], [-360, 2200]);
        const y = 120 + i * 190;
        const s = 0.7 + (i % 2) * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 360 * s,
              height: 120 * s,
              borderRadius: 9999,
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
              filter: "blur(8px)",
              opacity: 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
