import { useState } from "react";

export default function TechPulseBlueprint() {
  const [active, setActive] = useState(concepts[0]);

  const conceptMap = Object.fromEntries(concepts.map((c) => [c.id, c]));

  return (
    <div
      style={{
        fontFamily: "'Fira Code', monospace",
        background: "#0d1117",
        minHeight: "100vh",
        color: "#e6edf3",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)",
          borderBottom: "1px solid #21262d",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>
          <span style={{ color: "#58a6ff" }}>Tech</span>
          <span style={{ color: "#f78166" }}>Pulse</span>
        </div>
        <div
          style={{
            background: "#21262d",
            borderRadius: 6,
            padding: "4px 12px",
            fontSize: 12,
            color: "#8b949e",
          }}
        >
          Next.js 14 · App Router · Full-Stack Project
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>
        {/* File Tree */}
        <div
          style={{
            width: 240,
            background: "#161b22",
            borderRight: "1px solid #21262d",
            padding: "16px 0",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "0 16px 8px",
              fontSize: 11,
              color: "#8b949e",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Explorer
          </div>
          {fileTree.map((f, i) => {
            const c = f.concept ? conceptMap[f.concept] : null;
            const isActive = c?.id === active.id;
            return (
              <div
                key={i}
                onClick={() => c && setActive(c)}
                style={{
                  padding: "3px 16px",
                  paddingLeft: 16 + f.depth * 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: c ? "pointer" : "default",
                  background: isActive ? "#1f2937" : "transparent",
                  borderLeft: isActive
                    ? `2px solid ${c?.color}`
                    : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 12 }}>
                  {f.type === "folder" ? "📁" : f.concept ? "📄" : "·"}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: c
                      ? c.color
                      : f.type === "folder"
                        ? "#8b949e"
                        : "#6e7681",
                  }}
                >
                  {f.name}
                </span>
                {c && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: c.color,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Concept tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              background: "#161b22",
              borderBottom: "1px solid #21262d",
              overflowX: "auto",
            }}
          >
            {concepts.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                style={{
                  padding: "10px 16px",
                  fontSize: 12,
                  border: "none",
                  borderBottom:
                    active.id === c.id
                      ? `2px solid ${c.color}`
                      : "2px solid transparent",
                  background: active.id === c.id ? "#0d1117" : "transparent",
                  color: active.id === c.id ? c.color : "#8b949e",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Code panel */}
            <div style={{ flex: 1, overflow: "auto", padding: 0 }}>
              <div
                style={{
                  background: "#161b22",
                  padding: "8px 16px",
                  borderBottom: "1px solid #21262d",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: active.color,
                  }}
                />
                <span style={{ fontSize: 13, color: "#8b949e" }}>
                  {active.file}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    background: active.color + "22",
                    color: active.color,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {active.label}
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "20px 24px",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#e6edf3",
                  background: "#0d1117",
                  overflow: "auto",
                  minHeight: "100%",
                }}
              >
                <code>{active.code}</code>
              </pre>
            </div>

            {/* Concept info panel */}
            <div
              style={{
                width: 280,
                background: "#161b22",
                borderLeft: "1px solid #21262d",
                padding: 24,
                overflowY: "auto",
                flexShrink: 0,
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8b949e",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  Concept
                </div>
                <div
                  style={{ fontSize: 20, fontWeight: 700, color: active.color }}
                >
                  {active.label}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#8b949e",
                  marginBottom: 24,
                }}
              >
                {active.desc}
              </div>

              <div style={{ borderTop: "1px solid #21262d", paddingTop: 20 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8b949e",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 12,
                  }}
                >
                  All Concepts
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {concepts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setActive(c)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        background:
                          active.id === c.id ? c.color + "18" : "transparent",
                        border: `1px solid ${active.id === c.id ? c.color + "44" : "transparent"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: active.id === c.id ? c.color : "#8b949e",
                        }}
                      >
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
