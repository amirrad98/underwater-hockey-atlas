import { useId, useState } from "react";
export function Board({ compact = false }: { compact?: boolean }) {
  const gridId = useId();
  const arrowId = useId();
  const [formation, setFormation] = useState("3–3");
  const pts =
    formation === "3–3"
      ? [
          [25, 34],
          [50, 34],
          [75, 34],
          [25, 69],
          [50, 69],
          [75, 69],
        ]
      : [
          [30, 29],
          [70, 29],
          [30, 53],
          [70, 53],
          [30, 77],
          [70, 77],
        ];
  return (
    <div className={`board-wrap ${compact ? "compact" : ""}`}>
      <div className="board-top">
        <span>TACTICAL FIELD NOTES</span>
        <span>01 / TEAM SHAPE</span>
      </div>
      <svg
        className="board"
        viewBox="0 0 600 370"
        role="img"
        aria-label={`Conceptual ${formation} six-player formation, not to scale`}
      >
        <defs>
          <pattern
            id={gridId}
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
            />
          </pattern>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10" fill="#8ee1d0" />
          </marker>
        </defs>
        <rect
          x="30"
          y="15"
          width="540"
          height="330"
          rx="5"
          fill={`url(#${gridId})`}
        />
        <rect
          x="80"
          y="30"
          width="440"
          height="310"
          rx="3"
          fill="none"
          stroke="#81c5be"
          strokeWidth="1.5"
        />
        <path
          d="M80 185H520"
          stroke="#81c5be"
          strokeDasharray="5 7"
          opacity=".4"
        />
        <path d="M240 32H360M240 338H360" stroke="#dfc785" strokeWidth="7" />
        <circle
          cx="300"
          cy="185"
          r="44"
          fill="none"
          stroke="#81c5be"
          opacity=".4"
        />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M${80 + x * 4.4} ${30 + y * 3.1 - 22}v-26`}
              stroke="#8ee1d0"
              strokeWidth="2"
              markerEnd={`url(#${arrowId})`}
              opacity=".7"
            />
            <circle
              cx={80 + x * 4.4}
              cy={30 + y * 3.1}
              r="17"
              fill={i < 3 ? "#91e0cf" : "#174952"}
              stroke="#91e0cf"
            />
            <text
              x={80 + x * 4.4}
              y={35 + y * 3.1}
              textAnchor="middle"
              fill={i < 3 ? "#092f38" : "#c5f6e9"}
              fontSize="13"
            >
              {i + 1}
            </text>
          </g>
        ))}
        <circle cx="322" cy="103" r="6" fill="#e1c17b" />
        <text
          x="45"
          y="195"
          transform="rotate(-90 45 195)"
          fill="#85b0b1"
          fontSize="10"
          letterSpacing="3"
        >
          DIRECTION OF PLAY
        </text>
      </svg>
      <div className="board-bottom">
        <div className="segmented">
          {["3–3", "2–2–2"].map((f) => (
            <button
              key={f}
              aria-pressed={formation === f}
              onClick={() => setFormation(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span>Conceptual · not to scale</span>
      </div>
    </div>
  );
}
export function Equipment() {
  return (
    <svg viewBox="0 0 140 75" role="img" aria-label="Conceptual mask diagram">
      <path
        d="M15 20Q70 1 125 20L118 52Q100 69 82 49L70 33L58 49Q40 69 22 52Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M29 25L55 21L54 42Q40 59 29 43ZM85 21L111 25V43Q100 59 86 42Z"
        fill="currentColor"
        opacity=".16"
      />
    </svg>
  );
}
