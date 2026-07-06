import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";
import { Mountain, Waves, Car, Building2, TreePine, Footprints } from "lucide-react";
import { C } from "./theme";

const { fontFamily } = loadFont();
const SANS = '"Geist", system-ui, -apple-system, sans-serif';

const PINS = [
  { x: 40, y: 70, Icon: Waves, color: C.teal },
  { x: 250, y: 150, Icon: Car, color: C.terra },
  { x: 430, y: 60, Icon: TreePine, color: C.sage },
  { x: 300, y: 300, Icon: Building2, color: C.indigo },
  { x: 90, y: 320, Icon: Footprints, color: C.amber },
];

const Pin: React.FC<{ Icon: typeof Waves; color: string; big?: boolean }> = ({
  Icon,
  color,
  big,
}) => {
  const sz = big ? 76 : 60;
  return (
    <div
      style={{
        width: sz,
        height: sz,
        borderRadius: "50% 50% 50% 5px",
        transform: "rotate(45deg)",
        background: color,
        border: "3px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 22px -8px rgba(30,70,130,0.5)",
      }}
    >
      <div style={{ transform: "rotate(-45deg)", display: "flex" }}>
        <Icon size={big ? 34 : 28} color="#fff" strokeWidth={2.4} />
      </div>
    </div>
  );
};

export const OgImage: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, ${C.bg1} 0%, ${C.bg2} 55%, #f3f8fd 100%)`,
        padding: 72,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -180,
          left: -120,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background:
            "radial-gradient(closest-side, rgba(86,189,242,0.30), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -120,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background:
            "radial-gradient(closest-side, rgba(255,138,76,0.20), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Left: text */}
        <div style={{ flex: 1.15 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: `linear-gradient(122deg, ${C.skyLight}, ${C.sky} 55%, ${C.skyDeep})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mountain size={32} color="#fff" strokeWidth={2.2} />
            </div>
            <div style={{ fontFamily, fontSize: 34, color: C.ink, fontWeight: 600 }}>
              USA<span style={{ color: C.dim }}>/</span>Adventures
            </div>
          </div>

          <div
            style={{
              fontFamily,
              fontSize: 78,
              lineHeight: 1.02,
              color: C.ink,
              fontWeight: 600,
              marginTop: 34,
            }}
          >
            Sechs Monate quer durch die{" "}
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

          <div style={{ fontSize: 27, color: C.muted, marginTop: 22 }}>
            Interaktive Karte, Trips, Pläne &amp; Erinnerungen. Alperen &amp; Justus.
          </div>

          <div style={{ display: "flex", gap: 44, marginTop: 40 }}>
            {[
              { n: "28", l: "Spots", c: C.sky },
              { n: "6", l: "Trips", c: C.indigo },
              { n: "USA + HI", l: "Region", c: C.terra },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily, fontSize: 46, color: s.c, fontWeight: 600 }}>
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: C.dim,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: pin cluster */}
        <div style={{ flex: 1, position: "relative", height: 420 }}>
          <svg width="520" height="420" style={{ position: "absolute", inset: 0 }}>
            <path
              d="M 70 100 C 180 200, 240 120, 300 180 S 420 60, 470 90"
              fill="none"
              stroke={C.sky}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.4}
              strokeDasharray="2 14"
            />
          </svg>
          {PINS.map((p, i) => (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y }}>
              <Pin Icon={p.Icon} color={p.color} big={i === 1} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
