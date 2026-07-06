import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";
import { Mountain, Waves, Car, Building2, TreePine, Footprints } from "lucide-react";
import { Background } from "./Background";
import { C } from "./theme";

const { fontFamily } = loadFont();
const SANS = '"Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          transform: `scale(${0.85 + s * 0.15})`,
        }}
      >
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 30,
            background: `linear-gradient(122deg, ${C.skyLight}, ${C.sky} 55%, ${C.skyDeep})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 24px 48px -18px rgba(31,127,196,0.6)",
          }}
        >
          <Mountain size={58} color="#fff" strokeWidth={2.2} />
        </div>
        <div style={{ fontFamily, fontSize: 76, color: C.ink, fontWeight: 600 }}>
          USA<span style={{ color: C.dim }}>/</span>Adventures
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 18], [30, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `translateY(${y}px)` }}>
        <div
          style={{
            fontFamily,
            fontSize: 108,
            lineHeight: 1.02,
            color: C.ink,
            fontWeight: 600,
          }}
        >
          Sechs Monate quer
          <br />
          durch die{" "}
          <span
            style={{
              background: `linear-gradient(120deg, #ff8a4c, ${C.terra} 48%, ${C.rose})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            USA
          </span>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            color: C.muted,
            marginTop: 26,
          }}
        >
          Karte · Trips · Pläne · Erinnerungen — komplett lokal
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PINS = [
  { x: 250, y: 250, Icon: Waves, color: C.teal },
  { x: 620, y: 640, Icon: Car, color: C.terra },
  { x: 1000, y: 320, Icon: TreePine, color: C.sage },
  { x: 1360, y: 620, Icon: Building2, color: C.indigo },
  { x: 1680, y: 300, Icon: Footprints, color: C.amber },
];

const Route: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [6, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 2600;
  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <path
          d="M 250 250 C 450 520, 520 640, 620 640 S 880 200, 1000 320 S 1240 720, 1360 620 S 1580 200, 1680 300"
          fill="none"
          stroke={C.sky}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          opacity={0.5}
        />
      </svg>
      {PINS.map((p, i) => {
        const start = 20 + i * 12;
        const s = spring({
          frame: f - start,
          fps,
          config: { damping: 14, stiffness: 140 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - 40,
              top: p.y - 76,
              transform: `scale(${s})`,
              opacity: s,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50% 50% 50% 6px",
                transform: "rotate(45deg)",
                background: p.color,
                border: "4px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 26px -8px rgba(30,70,130,0.5)",
              }}
            >
              <div style={{ transform: "rotate(-45deg)", display: "flex" }}>
                <p.Icon size={36} color="#fff" strokeWidth={2.4} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ to: number; label: string; color: string }> = ({
  to,
  label,
  color,
}) => {
  const f = useCurrentFrame();
  const v = Math.round(
    interpolate(f, [0, 40], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily, fontSize: 130, color, fontWeight: 600, lineHeight: 1 }}>
        {v}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 30,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: 3,
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Stats: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ display: "flex", gap: 150 }}>
      <Counter to={28} label="Spots" color={C.sky} />
      <Counter to={6} label="Trips" color={C.indigo} />
      <Counter to={77} label="Tage bis USA" color={C.terra} />
    </div>
  </AbsoluteFill>
);

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.9 + s * 0.1})` }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 34,
            color: C.muted,
            marginBottom: 18,
          }}
        >
          Jetzt reinschauen
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 82,
            color: C.ink,
            fontWeight: 600,
          }}
        >
          usa-adventures.vercel.app
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 30,
            color: C.sky,
            marginTop: 22,
          }}
        >
          github.com/noluyorAbi/usa-adventures
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg2 }}>
      <Background />
      <Sequence from={0} durationInFrames={72}>
        <Fade dur={72}>
          <Brand />
        </Fade>
      </Sequence>
      <Sequence from={64} durationInFrames={92}>
        <Fade dur={92}>
          <Headline />
        </Fade>
      </Sequence>
      <Sequence from={150} durationInFrames={92}>
        <Fade dur={92}>
          <Route />
        </Fade>
      </Sequence>
      <Sequence from={236} durationInFrames={70}>
        <Fade dur={70}>
          <Stats />
        </Fade>
      </Sequence>
      <Sequence from={300} durationInFrames={60}>
        <Fade dur={60}>
          <Cta />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
