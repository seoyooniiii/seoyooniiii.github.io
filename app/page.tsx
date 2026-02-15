"use client";

import React, { useEffect, useRef, useState } from "react";

type AppKey = "paint" | "works" | "journal" | "about" | "modeling";

type Win = {
  key: AppKey;
  title: string;
  minimized: boolean;
  x: number;
  y: number;
  z: number;
  w?: number;
  h?: number;
  closing?: boolean; //

};

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [zTop, setZTop] = useState(10);

  const [wins, setWins] = useState<Record<AppKey, Win>>({
    paint: { key: "paint", title: "Paint", minimized: false, x: 210, y: 90, z: 10 },
    works: { key: "works", title: "Digital Museum", minimized: true, x: 24, y: 18, z: 2, w: 980, h: 650 },

    journal: { key: "journal", title: "Journal", minimized: true, x: 340, y: 170, z: 3 },
    about: { key: "about", title: "About", minimized: true, x: 410, y: 120, z: 4 },
    modeling: { key: "modeling", title: "3D Modeling", minimized: true, x: 480, y: 150, z: 5 },
  });

  // ✅ 데스크탑을 "뚫고" 올라오는 3D 오버레이 상태
  const [desktopModel, setDesktopModel] = useState<null | { src: string; name: string }>(null);
  const launchDesktopModel = (src: string, name: string) => setDesktopModel({ src, name });
  const closeDesktopModel = () => setDesktopModel(null);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ✅ model-viewer 스크립트 1회 로드 (GLB 회전/줌 뷰어)
  useEffect(() => {
    const id = "model-viewer-script";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }, []);

  // ✅ (선택) taskbar가 3D 오버레이에 덮이지 않도록 inline z-index 보강
  // CSS 파일을 건드리지 않고도 안전하게 유지하려고 여기서 style로 올려둠.
  const taskbarStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
};


  const focusWindow = (key: AppKey) => {
    setWins((prev) => {
      const nextZ = zTop + 1;
      setZTop(nextZ);
      return { ...prev, [key]: { ...prev[key], z: nextZ } };
    });
  };

  const openWindow = (key: AppKey) => {
    setWins((prev) => {
      const nextZ = zTop + 1;
      setZTop(nextZ);
      return { ...prev, [key]: { ...prev[key], minimized: false, z: nextZ } };
    });
  };

  const closeWindow = (key: AppKey) => {
  // 1) closing 상태로 애니메이션 시작
  setWins((prev) => ({ ...prev, [key]: { ...prev[key], closing: true } }));

  // 2) 애니메이션 끝나면 minimized 처리
  window.setTimeout(() => {
    setWins((prev) => ({
      ...prev,
      [key]: { ...prev[key], minimized: true, closing: false },
    }));
  }, 180);
};

  const moveWindow = (key: AppKey, x: number, y: number) => {
    setWins((prev) => ({ ...prev, [key]: { ...prev[key], x, y } }));
  };

  return (
    <>
      {/* Boot screen overlay (처음 3초) */}
      {booting && (
        <div className="boot">
          <div className="boot-window">
            <div className="boot-title">WINDOWS</div>
            <div className="boot-body">
              <div style={{ fontWeight: 700 }}>seoyooniiii</div>
              <div style={{ marginTop: 8 }}>Drawing · 3D · TouchDesigner</div>
              <div style={{ marginTop: 10, fontSize: 12 }}>Loading...</div>
              <div className="boot-progress">
                <div className="boot-bar" />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="desktop">
        {/* Desktop icons */}
        <div style={{ position: "absolute", top: 18, left: 18 }}>
          <DesktopIcon label="Paint" iconSrc="/icons/paint.png" onOpen={() => openWindow("paint")} />
          <DesktopIcon label="Works" iconSrc="/icons/works.png" onOpen={() => openWindow("works")} />
          <DesktopIcon
            label="Journal"
            iconSrc="/icons/journal.png"
            onOpen={() => openWindow("journal")}
          />
          <DesktopIcon label="About" iconSrc="/icons/about.png" onOpen={() => openWindow("about")} />

          {/* 3D Modeling 아이콘 */}
          <DesktopIcon
            label="3D Modeling"
            iconSrc={"/icons/3D modeling.png"}
            onOpen={() => openWindow("modeling")}
          />
        </div>

        {/* Windows */}
        {!wins.paint.minimized && (
          <WindowFrame
            win={wins.paint}
            onFocus={() => focusWindow("paint")}
            onClose={() => closeWindow("paint")}
            onMove={(x, y) => moveWindow("paint", x, y)}
          >
            <PaintApp />
          </WindowFrame>
        )}
        {!wins.works.minimized && (
          <WindowFrame
            win={wins.works}
           onFocus={() => focusWindow("works")}
            onClose={() => closeWindow("works")}
           onMove={(x, y) => moveWindow("works", x, y)}
          >
             <DigitalMuseum />
           </WindowFrame>
          )}

       

        {!wins.journal.minimized && (
          <WindowFrame
            win={wins.journal}
            onFocus={() => focusWindow("journal")}
            onClose={() => closeWindow("journal")}
            onMove={(x, y) => moveWindow("journal", x, y)}
          >
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <b>LOG</b>
              <div style={{ marginTop: 8 }}>- 2026-02-14: paint added</div>
            </div>
          </WindowFrame>
        )}

        {!wins.about.minimized && (
          <WindowFrame
            win={wins.about}
            onFocus={() => focusWindow("about")}
            onClose={() => closeWindow("about")}
            onMove={(x, y) => moveWindow("about", x, y)}
          >
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <b>ABOUT</b>
              <div style={{ marginTop: 8 }}>Tools: Blender / TouchDesigner / AE</div>
            </div>
          </WindowFrame>
        )}

        {/* 3D Modeling 창 */}
        {!wins.modeling.minimized && (
          <WindowFrame
            win={wins.modeling}
            onFocus={() => focusWindow("modeling")}
            onClose={() => closeWindow("modeling")}
            onMove={(x, y) => moveWindow("modeling", x, y)}
          >
            {/* ✅ 파일 더블클릭 → 데스크탑에 모델 소환 */}
            <ModelingApp onLaunch={launchDesktopModel} />
          </WindowFrame>
        )}

        {/* Taskbar: 부팅 끝난 뒤에만 */}
        {!booting && (
          <div className="taskbar" style={taskbarStyle}>
            <button className="startbtn">Start</button>

            {!wins.paint.minimized && (
              <button className="task" onClick={() => focusWindow("paint")}>
                Paint
              </button>
            )}
            {!wins.works.minimized && (
              <button className="task" onClick={() => focusWindow("works")}>
                Works
              </button>
            )}
            {!wins.journal.minimized && (
              <button className="task" onClick={() => focusWindow("journal")}>
                Journal
              </button>
            )}
            {!wins.about.minimized && (
              <button className="task" onClick={() => focusWindow("about")}>
                About
              </button>
            )}
            {!wins.modeling.minimized && (
              <button className="task" onClick={() => focusWindow("modeling")}>
                3D Modeling
              </button>
            )}
          </div>
        )}
      </main>

      {/* ✅ 데스크탑을 "뚫고" 올라오는 3D 오버레이 */}
      {desktopModel && <DesktopModelOverlay model={desktopModel} onClose={closeDesktopModel} />}
            <style jsx global>{`
        .window.closing {
          animation: winClose 180ms ease-out forwards;
          transform-origin: top left;
        }
        @keyframes winClose {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.96);
          }
        }
          /* ✅ WinClassic 느낌의 닫기 버튼 */
.winbtn {
  width: 18px !important;
  height: 18px !important;
  padding: 0;
  border: 1px solid #000;
  background: #c0c0c0;
  box-shadow:
    inset 1px 1px #ffffff,
    inset -1px -1px #808080;
  cursor: pointer;
  position: relative;
}

/* 두꺼운 X를 "파여있는" 느낌으로 */
.winbtn::before {
  content: "";
  position: absolute;
  inset: 3px;
  background:
    linear-gradient(45deg, transparent 42%, #111 42%, #111 58%, transparent 58%),
    linear-gradient(-45deg, transparent 42%, #111 42%, #111 58%, transparent 58%);
}

/* 눌렀을 때(Win95 버튼 눌림) */
.winbtn:active {
  box-shadow:
    inset 1px 1px #808080,
    inset -1px -1px #ffffff;
}

      `}</style>

    </>
  );
}

function DesktopIcon({
  label,
  iconSrc,
  onOpen,
}: {
  label: string;
  iconSrc: string;
  onOpen: () => void;
}) {
  return (
    <div className="icon" onDoubleClick={onOpen}>
      <img src={iconSrc} alt="" />
      <span>{label}</span>
    </div>
  );
}

function WindowFrame({
  win,
  onFocus,
  onClose,
  onMove,
  children,
}: {
  win: { title: string; x: number; y: number; z: number; w?: number; h?: number; closing?: boolean };
  onFocus: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}) {
  const drag = useRef({ dragging: false, ox: 0, oy: 0 });

  const onPointerDownTitle = (e: React.PointerEvent) => {
  // ✅ 버튼(닫기) 누른 경우엔 드래그 시작하지 않음
  if ((e.target as HTMLElement).closest("button")) return;

  onFocus();
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);

  drag.current.dragging = true;
  drag.current.ox = e.clientX - win.x;
  drag.current.oy = e.clientY - win.y;
};


  const onPointerMoveTitle = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    onMove(e.clientX - drag.current.ox, e.clientY - drag.current.oy);
  };

  const onPointerUpTitle = (e: React.PointerEvent) => {
    drag.current.dragging = false;
    try {
      const el = e.currentTarget as HTMLElement;
      el.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      className={`window ${win.closing ? "closing" : ""}`}
      style={{
        left: win.x,
        top: win.y,
        zIndex: win.z,
        width: win.w ? `${win.w}px` : undefined,
        height: win.h ? `${win.h}px` : undefined,
      }}
      onMouseDown={onFocus}
    >
      <div
  className="titlebar"
  style={{ position: "relative", zIndex: 2 }}   // ✅ 이 줄 추가
  onPointerDown={onPointerDownTitle}
  onPointerMove={onPointerMoveTitle}
  onPointerUp={onPointerUpTitle}
>

        <div>{win.title}</div>
        <div className="buttons">
          <button
  className="winbtn"
  onClick={(e) => {
    e.stopPropagation();
    onClose();
  }}
  style={{
    width: 20,
    height: 18,
    fontWeight: 700,
    cursor: "pointer",
    pointerEvents: "auto",
  }}
>
  ×
</button>

        </div>
      </div>

      <div
  className="window-body"
  style={{
    height: win.h ? `calc(${win.h}px - 28px)` : undefined,
    overflow: "hidden",
    position: "relative",
    zIndex: 0,
  }}
>

        {children}
      </div>
    </div>
  );
}


/**
 * ✅ 3D Modeling 창 내용:
 * - 여기의 "무언가" = 파일 아이콘 (evangelion.glb)
 * - 더블클릭하면 배경 위로 3D 오버레이가 뜸
 */
function ModelingApp({ onLaunch }: { onLaunch: (src: string, name: string) => void }) {
  // ✅ 네 실제 파일 경로/이름 반영
  const items = [{ name: "evangelion.glb", src: "/models/evangelion.glb" }];

  return (
    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
      <b>3D MODELS</b>

      <div
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {items.map((it) => (
          <div
            key={it.src}
            className="icon"
            style={{ width: 110 }}
            onDoubleClick={() => onLaunch(it.src, it.name)}
            title="Double click to spawn on desktop"
          >
            {/* 파일 아이콘: 임시로 3D Modeling 아이콘 재사용 */}
            <img src="/icons/3D modeling.png" alt="" />
            <span>{it.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
        Double-click the file to spawn it on the desktop.
      </div>
    </div>
  );
}

/**
 * ✅ 배경화면을 "뚫고" 등장하는 3D 오버레이
 * - 배경은 그대로 보이고, 모델만 중앙에 크게 뜸
 * - 모델 영역만 마우스 이벤트 받도록 pointerEvents 설정
 * - ESC 또는 X로 닫기
 */
function DesktopModelOverlay({
  model,
  onClose,
}: {
  model: { src: string; name: string };
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const TASKBAR_H = 48;

  return (
    <div
      onMouseDown={onClose} // ✅ 바깥 클릭하면 닫기
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999, // taskbar(10000)보다 낮음
        background: "transparent",
        cursor: "default",
      }}
      title="Click to close (Esc)"
    >
      {/* 닫기 버튼 (taskbar 안 가리게) */}
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 34,
          height: 28,
          border: "1px solid #000",
          background: "#c0c0c0",
          boxShadow: "inset -2px -2px #808080, inset 2px 2px #fff",
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 1,
        }}
        title="Close (Esc)"
      >
        X
      </button>

      {/* ✅ 이 영역 클릭은 닫히지 않게 막고, 여기서만 회전/줌 */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          inset: 0,
          padding: 10,
          paddingBottom: TASKBAR_H + 10,
        }}
      >
        {/* @ts-ignore */}
        <model-viewer
          src={model.src}
          camera-controls
          auto-rotate
          rotation-per-second="20deg"
          antialiasing="msaa"
          environment-image="neutral"
          tone-mapping="aces"
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "0",
          }}
          alt={model.name}
        />
      </div>
    </div>
  );
}


function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(4);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * c.width);
    const y = Math.floor(((e.clientY - r.top) / r.height) * c.height);
    return { x, y };
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const begin = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    drawingRef.current = true;
    lastRef.current = getPos(e);
    c.setPointerCapture(e.pointerId);
    drawLine(ctx, lastRef.current, lastRef.current);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const cur = getPos(e);
    const prev = lastRef.current;
    if (!prev) {
      lastRef.current = cur;
      return;
    }
    drawLine(ctx, prev, cur);
    lastRef.current = cur;
  };

  const end = (e: React.PointerEvent) => {
    drawingRef.current = false;
    lastRef.current = null;
    const c = canvasRef.current;
    if (!c) return;
    try {
      c.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const clearAll = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  };

  const savePng = () => {
    const c = canvasRef.current;
    if (!c) return;
    const url = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "seoyoon_paint.png";
    a.click();
  };

  const palette = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#808080",
    "#c0c0c0",
    "#8b4513",
    "#ffa500",
  ];

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
      <div style={{ width: 160 }}>
        <div style={{ fontSize: 12, marginBottom: 6, fontWeight: 700 }}>TOOLS</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button className="task" onClick={() => setTool("pen")} style={{ fontSize: 12 }}>
            Pen
          </button>
          <button className="task" onClick={() => setTool("eraser")} style={{ fontSize: 12 }}>
            Eraser
          </button>
        </div>

        <div style={{ fontSize: 12, marginBottom: 6, fontWeight: 700 }}>SIZE</div>
        <input
          type="range"
          min={1}
          max={24}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: 12, marginTop: 4, marginBottom: 12 }}>{size}px</div>

        <div style={{ fontSize: 12, marginBottom: 6, fontWeight: 700 }}>COLOR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {palette.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              title={c}
              style={{
                width: 18,
                height: 18,
                background: c,
                border: "1px solid #000",
                outline: c === color ? "2px solid #000080" : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
          <button className="task" onClick={clearAll} style={{ fontSize: 12 }}>
            Clear
          </button>
          <button className="task" onClick={savePng} style={{ fontSize: 12 }}>
            Save
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #000",
            boxShadow: "inset -2px -2px #c0c0c0, inset 2px 2px #808080",
            width: "100%",
          }}
        >
          <canvas
            ref={canvasRef}
            width={640}
            height={420}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              touchAction: "none",
              cursor: "crosshair",
            }}
            onPointerDown={begin}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            onPointerLeave={end}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: 12 }}>
          Mode: <b>{tool}</b> / Color: <b>{color}</b>
        </div>
      </div>
    </div>
  );
}


function DigitalMuseum() {
  const items = [
    { src: "/images/drawings/tunnel_01.jpg", title: "tunnel_01" },
    { src: "/images/drawings/tunnel_02.jpg", title: "tunnel_02" },
    { src: "/images/drawings/tunnel_03.jpg", title: "tunnel_03" },
    { src: "/images/drawings/tunnel_04.jpg", title: "tunnel_04" },
  ];

  return (
    <div
      style={{
        height: "100%", // ✅ 창 내부를 꽉 채움
        overflowY: "auto",
        padding: 14,
        background: "#fff",
        border: "1px solid #000",
        boxShadow: "inset -2px -2px #c0c0c0, inset 2px 2px #808080",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Digital Museum</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map((it) => (
          <figure key={it.src} style={{ margin: 0 }}>
            <img
              src={it.src}
              alt={it.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                border: "1px solid #000",
                boxShadow: "2px 2px 0 #808080",
                background: "#fff",
              }}
            />
            <figcaption style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
              {it.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
