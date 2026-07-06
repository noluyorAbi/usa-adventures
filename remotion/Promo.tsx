import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";
import {
  Mountain,
  Waves,
  Car,
  Building2,
  TreePine,
  Footprints,
  Map as MapIcon,
  ListChecks,
  Clock,
} from "lucide-react";
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

const sunText = {
  background: `linear-gradient(120deg, #ff8a4c, ${C.terra} 48%, ${C.rose})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

// Scene 1: who we are
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.9 + s * 0.1})` }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 26px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(28,55,90,0.1)",
            fontFamily: SANS,
            fontSize: 30,
            color: C.muted,
          }}
        >
          <MapIcon size={26} color={C.sky} strokeWidth={2.2} />
          BMW Praktikum · Oxnard, Kalifornien
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 128,
            color: C.ink,
            fontWeight: 600,
            marginTop: 30,
          }}
        >
          Alperen &amp; Justus
        </div>
        <div style={{ fontFamily: SANS, fontSize: 34, color: C.muted, marginTop: 14 }}>
          21. Sept 2026 &ndash; 19. März 2027
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: the mission / why
const Mission: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 20], [30, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `translateY(${y}px)` }}>
        <div
          style={{ fontFamily: SANS, fontSize: 36, color: C.muted, marginBottom: 20 }}
        >
          Ein halbes Jahr Zeit. Ein Kontinent.
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 118,
            lineHeight: 1.02,
            color: C.ink,
            fontWeight: 600,
          }}
        >
          Unsere Bucket-List
          <br />
          für die <span style={sunText}>USA</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: what the app is for (the goal)
const PURPOSE = [
  { Icon: MapIcon, t: "Planen", s: "Karte & Trips" },
  { Icon: ListChecks, t: "Abhaken", s: "Plan-Board" },
  { Icon: Clock, t: "Erinnern", s: "Timeline" },
];

const Purpose: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily,
            fontSize: 64,
            color: C.ink,
            fontWeight: 600,
            marginBottom: 56,
          }}
        >
          Ein Ort für <span style={sunText}>alles</span>
        </div>
        <div style={{ display: "flex", gap: 48, justifyContent: "center" }}>
          {PURPOSE.map((p, i) => {
            const s = spring({
              frame: f - 8 - i * 10,
              fps,
              config: { damping: 15, stiffness: 130 },
            });
            return (
              <div
                key={p.t}
                style={{
                  width: 360,
                  padding: 40,
                  borderRadius: 32,
                  background: "#fff",
                  border: "1px solid rgba(28,55,90,0.1)",
                  boxShadow: "0 24px 50px -26px rgba(30,70,130,0.4)",
                  transform: `translateY(${(1 - s) * 30}px)`,
                  opacity: s,
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 24,
                    background: `linear-gradient(122deg, ${C.skyLight}, ${C.sky} 55%, ${C.skyDeep})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 26px",
                  }}
                >
                  <p.Icon size={42} color="#fff" strokeWidth={2.2} />
                </div>
                <div
                  style={{ fontFamily, fontSize: 44, color: C.ink, fontWeight: 600 }}
                >
                  {p.t}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 28,
                    color: C.muted,
                    marginTop: 6,
                  }}
                >
                  {p.s}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: scope — route across the country + Hawaii
const PINS = [
  { x: 250, y: 300, Icon: Waves, color: C.teal },
  { x: 600, y: 640, Icon: Car, color: C.terra },
  { x: 980, y: 360, Icon: TreePine, color: C.sage },
  { x: 1360, y: 600, Icon: Building2, color: C.indigo },
  { x: 1680, y: 320, Icon: Footprints, color: C.amber },
];

const Scope: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [8, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 2600;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 90,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontSize: 66,
          color: C.ink,
          fontWeight: 600,
        }}
      >
        Von Oxnard bis <span style={sunText}>Hawaii</span>
      </div>
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        <path
          d="M 250 300 C 450 560, 500 640, 600 640 S 860 240, 980 360 S 1240 700, 1360 600 S 1580 220, 1680 320"
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
        const s = spring({
          frame: f - (24 + i * 12),
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
      <div style={{ fontFamily, fontSize: 140, color, fontWeight: 600, lineHeight: 1 }}>
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
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", gap: 150, justifyContent: "center" }}>
        <Counter to={77} label="Tage bis Abflug" color={C.terra} />
        <Counter to={28} label="Spots" color={C.sky} />
        <Counter to={6} label="Trips" color={C.indigo} />
      </div>
    </div>
  </AbsoluteFill>
);

// Scene 6: CTA
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.92 + s * 0.08})` }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: `linear-gradient(122deg, ${C.skyLight}, ${C.sky} 55%, ${C.skyDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mountain size={46} color="#fff" strokeWidth={2.2} />
          </div>
          <div style={{ fontFamily, fontSize: 58, color: C.ink, fontWeight: 600 }}>
            USA<span style={{ color: C.dim }}>/</span>Adventures
          </div>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 76,
            color: C.ink,
            fontWeight: 600,
            marginTop: 34,
          }}
        >
          usa-adventures.vercel.app
        </div>
        <div style={{ fontFamily: SANS, fontSize: 30, color: C.muted, marginTop: 22 }}>
          Gemeinsam geplant · komplett lokal · open source
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg2 }}>
      <Background />
      <Sequence from={0} durationInFrames={78}>
        <Fade dur={78}>
          <Intro />
        </Fade>
      </Sequence>
      <Sequence from={70} durationInFrames={90}>
        <Fade dur={90}>
          <Mission />
        </Fade>
      </Sequence>
      <Sequence from={152} durationInFrames={104}>
        <Fade dur={104}>
          <Purpose />
        </Fade>
      </Sequence>
      <Sequence from={248} durationInFrames={98}>
        <Fade dur={98}>
          <Scope />
        </Fade>
      </Sequence>
      <Sequence from={338} durationInFrames={78}>
        <Fade dur={78}>
          <Stats />
        </Fade>
      </Sequence>
      <Sequence from={408} durationInFrames={72}>
        <Fade dur={72}>
          <Cta />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
