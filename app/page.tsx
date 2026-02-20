"use client";

import React, { useEffect, useRef, useState } from "react";
import AboutSection from './components/AboutSection';


type AppKey = "paint" | "museum" | "journal" | "about" | "modeling" | "video";

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
  const [adOpen, setAdOpen] = useState(true);
  // ✅ museum 입장 확인 모달
const [museumConfirmOpen, setMuseumConfirmOpen] = useState(false);

// ✅ museum 내부 "파일 탐색기"에서 현재 선택된 화면
const [museumView, setMuseumView] = useState<"files" | "tunnel">("files");
const [clock, setClock] = useState("");
// ✅ 아이콘 클릭 시: 더블클릭 안내 토스트(1초 후 자동 종료)
const [dblClickHintOpen, setDblClickHintOpen] = useState(false);
const dblHintTimerRef = useRef<number | null>(null);

const handleFirstIconClickHint = () => {
  setDblClickHintOpen(true);

  if (dblHintTimerRef.current) window.clearTimeout(dblHintTimerRef.current);
  dblHintTimerRef.current = window.setTimeout(() => {
    setDblClickHintOpen(false);
  }, 1000);
};


useEffect(() => {
  return () => {
    if (dblHintTimerRef.current) window.clearTimeout(dblHintTimerRef.current);
  };
}, []);


// ✅ 가짜 악성코드 경고 모달
const [malwareAlertOpen, setMalwareAlertOpen] = useState(false);


  const [wins, setWins] = useState<Record<AppKey, Win>>({
    paint: { key: "paint", title: "Paint", minimized: false, x: 210, y: 90, z: 10 },
    museum: { key: "museum", title: "Digital Museum", minimized: true, x: 200, y: 75, z: 2, w: 1200, h: 820 },

    journal: { key: "journal", title: "Journal", minimized: false, x: 340, y: 170, z: 11 },
    about: { key: "about", title: "About", minimized: true, x: 410, y: 120, z: 4 },
    modeling: { key: "modeling", title: "3D Modeling", minimized: true, x: 480, y: 150, z: 5 },
    video: {
  key: "video",
  title: "Visual Video",
  minimized: true,
  x: 520,
  y: 150,
  z: 6,
},

  });
    



  // ✅ 데스크탑을 "뚫고" 올라오는 3D 오버레이 상태
  const [desktopModel, setDesktopModel] = useState<null | { src: string; name: string }>(null);
  const launchDesktopModel = (src: string, name: string) => setDesktopModel({ src, name });
  const closeDesktopModel = () => setDesktopModel(null);
  const [desktopVideo, setDesktopVideo] =
  useState<null | { src: string; name: string }>(null);

const launchDesktopVideo = (src: string, name: string) =>
  setDesktopVideo({ src, name });

const closeDesktopVideo = () => setDesktopVideo(null);


  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 3000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
  const update = () => {
    const now = new Date();
    const t = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setClock(t);
  };

  update(); // 처음 1번 바로 표시
  const id = window.setInterval(update, 1000);
  return () => window.clearInterval(id);
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

  
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const mql = window.matchMedia("(max-width: 768px)");
  const apply = () => setIsMobile(mql.matches);
  apply();
  mql.addEventListener("change", apply);
  return () => mql.removeEventListener("change", apply);
}, []);

const [scale, setScale] = useState(1);

useEffect(() => {
  if (!isMobile) {
    setScale(1);
    return;
  }
  const update = () => {
    const s = Math.min(1, window.innerWidth / 1280);
    setScale(s);
  };
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, [isMobile]);

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
    if (key === "video") closeDesktopVideo();

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

<div className="viewport95">
  <div className="crt95">
     <div
      className="desktopStage"
      style={{
        transform: isMobile ? `scale(${scale})` : "none",
        transformOrigin: "top left",
      }}
    >
      <main className="desktop desktop95" style={{ position: "relative", isolation: "isolate"}}>



        {/* Desktop video background */}
{desktopVideo && (
  <video
    src={desktopVideo.src}
    autoPlay
    loop
    muted
    playsInline
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,   // ⭐ 핵심: 음수로 내려야 함
      pointerEvents: "none",
    }}
  />
)}

        
        {/* Desktop icons */}
        <div style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>

          <DesktopIcon label="Paint" iconSrc="/icons/paint.png" isMobile={isMobile} onOpen={() => openWindow("paint")} onHint={handleFirstIconClickHint}/>
          <DesktopIcon
  label="Digital Museum"
  iconSrc="/icons/museum.png"
  isMobile={isMobile}
  onOpen={() => {
    setMuseumConfirmOpen(true); 
  }} onHint={handleFirstIconClickHint}
/>

          <DesktopIcon
            label="Journal"
            iconSrc="/icons/journal.png"
            isMobile={isMobile}
            onOpen={() => openWindow("journal")} onHint={handleFirstIconClickHint}
          />
          <DesktopIcon label="About" iconSrc="/icons/about.png" isMobile={isMobile} onOpen={() => openWindow("about")} onHint={handleFirstIconClickHint}/>

          {/* 3D Modeling 아이콘 */}
          <DesktopIcon
            label="3D Modeling"
            iconSrc={"/icons/3D modeling.png"}
            isMobile={isMobile}
            onOpen={() => openWindow("modeling")} onHint={handleFirstIconClickHint}
          />
          <DesktopIcon
  label="Visual"
  iconSrc="/icons/video.png"
  isMobile={isMobile}
  onOpen={() => openWindow("video")} onHint={handleFirstIconClickHint}
/>

        </div>
        {adOpen && <RightAdPanel onClose={() => setAdOpen(false)} />}



        {/* Windows */}
        {!wins.paint.minimized && (
          <WindowFrame
            win={wins.paint}
            isMobile={isMobile}
            onFocus={() => focusWindow("paint")}
            onClose={() => closeWindow("paint")}
            onMove={(x, y) => moveWindow("paint", x, y)}
          >
            <PaintApp />
          </WindowFrame>
        )}
        {!wins.museum.minimized && (
          <WindowFrame
            win={wins.museum}
            isMobile={isMobile}
           onFocus={() => focusWindow("museum")}
            onClose={() => closeWindow("museum")}
           onMove={(x, y) => moveWindow("museum", x, y)}
          >
             <MuseumShell
  view={museumView}
  onOpenTunnel={() => setMuseumView("tunnel")}
  onBackToFiles={() => setMuseumView("files")}
  onTriggerMalware={() => setMalwareAlertOpen(true)}
  onHint={handleFirstIconClickHint}
  isMobile={isMobile}
/>

           </WindowFrame>
          )}

       

        {!wins.journal.minimized && (
          <WindowFrame
            win={wins.journal}
            isMobile={isMobile}
            onFocus={() => focusWindow("journal")}
            onClose={() => closeWindow("journal")}
            onMove={(x, y) => moveWindow("journal", x, y)}
          >
           <div style={{ fontSize: 13, lineHeight: 1.5 }}>
  <b>LOG</b>

  <div style={{ marginTop: 8 }}>
    - 2026-02-14: paint added
  </div>

  <div style={{ marginTop: 8 }}>
    - 2026-02-18: A site no one seems to visit… is anyone actually reading this?
  </div>
</div>

          </WindowFrame>
        )}

        {!wins.about.minimized && (
  <WindowFrame
    win={wins.about}
    isMobile={isMobile}
    onFocus={() => focusWindow("about")}
    onClose={() => closeWindow("about")}
    onMove={(x, y) => moveWindow("about", x, y)}
  >
    <div style={{ height: "100%", overflow: "auto" }}>
      <AboutSection onOk={() => closeWindow("about")} />
    </div>
  </WindowFrame>
)}


        {/* 3D Modeling 창 */}
        {!wins.modeling.minimized && (
          <WindowFrame
            win={wins.modeling}
            isMobile={isMobile}
            onFocus={() => focusWindow("modeling")}
            onClose={() => closeWindow("modeling")}
            onMove={(x, y) => moveWindow("modeling", x, y)}
          >
            {/* ✅ 파일 더블클릭 → 데스크탑에 모델 소환 */}
            <ModelingApp onLaunch={launchDesktopModel} />
          </WindowFrame>
        )}

        {!wins.video.minimized && (
  <WindowFrame
    win={wins.video}
    isMobile={isMobile}
    onFocus={() => focusWindow("video")}
    onClose={() => closeWindow("video")}
    onMove={(x, y) => moveWindow("video", x, y)}
  >
    <VisualVideoApp
  onLaunch={launchDesktopVideo}
  onStop={closeDesktopVideo}
/>

  </WindowFrame>
)}
  
{museumConfirmOpen && (
  <ConfirmModal
    title="Digital Museum"
    message="Enter Digital Museum?"
    yesLabel="Yes"
    noLabel="No"
    onYes={() => {
      setMuseumConfirmOpen(false);
      setMuseumView("files");     // 입장하면 파일목록부터
      openWindow("museum");       // museum 창 열기
    }}
    onNo={() => setMuseumConfirmOpen(false)}
  />
)}

        {/* Taskbar: 부팅 끝난 뒤에만 */}
        
      </main>
    </div>

    {!booting && (
          <div className="taskbar taskbarFixed">
            <button className="startbtn">Start</button>
            

            {!wins.paint.minimized && (
              <button className="task" onClick={() => focusWindow("paint")}>
                Paint
              </button>
            )}
            {!wins.museum.minimized && (
              <button className="task" onClick={() => focusWindow("museum")}>
                Digital Museum
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
            {!wins.video.minimized && (
  <button className="task" onClick={() => focusWindow("video")}>
    Visual
  </button>
)}
<div
  style={{
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 6,              // ⭐ 아이콘 간격
    height: 22,
    padding: "0 10px",
    border: "1px solid #000",
    background: "#c0c0c0",
    boxShadow: "inset -1px -1px #808080, inset 1px 1px #fff",
    fontSize: 12,
  }}
>
  

  {clock}
</div>


            
          </div>
          
        )}
  </div>
</div>

      {/* ✅ 데스크탑을 "뚫고" 올라오는 3D 오버레이 */}
      {desktopModel && <DesktopModelOverlay model={desktopModel} onClose={closeDesktopModel} />}
      {malwareAlertOpen && (
  <AlertModal
    title="Warning"
    message={"This file is suspected malware.\nExecution has been blocked."}
    okLabel="OK"
    onOk={() => setMalwareAlertOpen(false)}
  />
)}
{dblClickHintOpen && (
  <Win95Toast
    title="System Warning"
    message="Double-click the icon to open."
  />
)}

     

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
}/* ===== Win95: 4:3 fixed desktop scaler ===== *//* ===== Fullscreen + Win95 vibe (NO scaling) ===== */

/* CRT scanline 효과 */
.crt95 {
  position: relative;
}




/* CRT scanline */
.viewport95::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000; /* 창(z 10~)보다 위, taskbar(10000)보단 아래로 두고 싶으면 9999 아래 */
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,0.03) 0px,
    rgba(0,0,0,0.03) 1px,
    transparent 2px,
    transparent 4px
  );
}

/* vignette / bloom */
.viewport95::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 8999;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.25);
}

.viewport95{
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.crt95{
  position: relative;
  width: 100%;
  height: 100%;
}

/* ✅ 내용 캔버스 */
.desktopStage{
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: top left;
}

.desktop95{
  width: 100%;
  height: 100%;
  min-height: 100dvh;
}

/* ✅ taskbar는 진짜 화면 바닥 */
.taskbarFixed{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  padding-bottom: env(safe-area-inset-bottom);
}



  

  /* ✅ 모바일에서 더블탭 확대(zoom) 줄이기 */
.desktop95, .icon, button {
  touch-action: manipulation;
}
  /* ✅ 모바일에서 아이콘 터치 영역 확대 */
@media (max-width: 768px) {
  .icon {
    padding: 6px;
  }

  .icon img {
    width: 42px;   /* (선택) 아이콘 크기 조금 키우기 */
    height: 42px;  /* (선택) 아이콘 크기 조금 키우기 */
  }

  .icon span {
    font-size: 12px;
    line-height: 1.1;
  }
}




      `}</style>

    </>
  );
}

function DesktopIcon({
  label,
  iconSrc,
  onOpen,
  onHint,
  isMobile,
}: {
  label: string;
  iconSrc: string;
  onOpen: () => void;
  onHint?: () => void;
  isMobile: boolean;
}) {
  const onSingle = () => {
    if (isMobile) {
      onOpen();        // ✅ 모바일: 한 번 탭 = 열기
    } else {
      onHint?.();      // ✅ PC: 한 번 클릭 = 안내 토스트
    }
  };

  return (
    <div
      className="icon"
      onPointerUp={(e) => {
        // 왼쪽 클릭/탭만
        if (e.button === 0) onSingle();
      }}
      onDoubleClick={() => {
        if (!isMobile) onOpen();  // ✅ PC: 더블클릭 = 열기
      }}
    >
      <img
        src={iconSrc}
        alt=""
        draggable={false}
        style={{ pointerEvents: "none" }}
      />
      <span style={{ pointerEvents: "none" }}>{label}</span>
    </div>
  );
}


function WindowFrame({
  win,
  onFocus,
  onClose,
  onMove,
  children,
  isMobile = false, 
}: {
  win: { title: string; x: number; y: number; z: number; w?: number; h?: number; closing?: boolean };
  onFocus: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}) {
  const drag = useRef({ dragging: false, ox: 0, oy: 0 });

  const onPointerDownTitle = (e: React.PointerEvent) => {
  if (isMobile) return; // ✅ 버튼(닫기) 누른 경우엔 드래그 시작하지 않음
  if ((e.target as HTMLElement).closest("button")) return;

  onFocus();
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);

  drag.current.dragging = true;
  drag.current.ox = e.clientX - win.x;
  drag.current.oy = e.clientY - win.y;
};


  const onPointerMoveTitle = (e: React.PointerEvent) => {
    if (isMobile) return;
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
        left: isMobile ? 0 : win.x,
        top: isMobile ? 0 : win.y,
        zIndex: win.z,
        width: isMobile ? "100vw" : (win.w ? `${win.w}px` : undefined),
        height: isMobile ? "calc(100dvh - 48px)" : (win.h ? `${win.h}px` : undefined), // taskbar 고려
      }}
      onMouseDown={onFocus}
    ><div
  className="titlebar"
  style={{
    position: "relative",
    zIndex: 2,
    background: "linear-gradient(to right, #000080, #1084d0)",
    color: "#fff",
  }}
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
    overflow: "auto",                 // ✅ hidden → auto
    WebkitOverflowScrolling: "touch", // ✅ iOS 부드러운 스크롤
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

function VisualVideoApp({
  onLaunch,
  onStop,
}: {
  onLaunch: (src: string, name: string) => void;
  onStop: () => void;
}) {


  const items = [{ name: "visual.mp4", src: "/video/visual.mp4" }];

  return (
  <div style={{ fontSize: 13 }}>
    <b>VISUAL VIDEO</b>

    <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
      <button
        className="task"
        onClick={() => onLaunch(items[0].src, items[0].name)}
      >
        Set Background
      </button>

      <button
        className="task"
        onClick={onStop}
      >
        Stop Background
      </button>
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
      <div
  style={{
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 16,
    letterSpacing: 0.2,
  }}
>
  A tunnel that takes you somewhere nice
</div>


      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {items.map((it) => (
          <figure key={it.src} style={{ margin: 0 }}>
            <img
              src={it.src}
              alt={it.title}
              loading="lazy"
              style={{
                width: "70%",
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

function RightAdPanel({ onClose }: { onClose: () => void }) {
  const TASKBAR_H = 48; // (지금은 안 쓰지만 기존 유지)

  // ✅ 광고 이미지 1장만
  const items = [{ icon: "/ad/guide.png" }];

  return (
    <div
      style={{
        position: "absolute",
        top: 350,
        right: 10,
        width: 170,
        height: 420,
        zIndex: 3, // ✅ 창(z 10+)보다 낮게: 창이 가릴 수 있음
        pointerEvents: "auto",
      }}
    >
      {/* Win95 창처럼 보이는 테두리 */}
      <div
        style={{
          height: "100%",
          background: "#c0c0c0",
          border: "1px solid #000",
          boxShadow: "inset -2px -2px #808080, inset 2px 2px #fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 상단바 */}
        <div
          style={{
            height: 22,
            padding: "2px 4px",
            background: "#000080",
            color: "#fff",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            userSelect: "none",
          }}
        >
          <span>Ads</span>
          <button className="winbtn" onClick={onClose} />
        </div>

        {/* ✅ 내용: 광고 이미지가 칸에 딱 맞게 1장만 */}
        <div
          style={{
            flex: 1,
            background: "#000",
            overflow: "hidden", // ✅ 스크롤 없애기
            padding: 0, // ✅ 여백 없애기
          }}
        >
          {items.map((it) => (
            <img
              key={it.icon}
              src={it.icon}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // ✅ 꽉 차게 (잘리기 싫으면 contain)
                display: "block",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


function ConfirmModal({
  title,
  message,
  yesLabel,
  noLabel,
  onYes,
  onNo,
}: {
  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
  onNo: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onNo();
      if (e.key === "Enter") onYes();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onNo, onYes]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000, // taskbar(10000)보다 위
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.15)",
      }}
      onMouseDown={onNo}
    >
      <div
        className="window"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 360,
          height: 160,
          position: "relative",
          left: 0,
          top: 0,
        }}
      >
        <div
  className="titlebar"
  style={{
    position: "relative",
    zIndex: 2,
    background: "linear-gradient(to right, #000080, #1084d0)",
    color: "#fff",
  }}
>

          <div>{title}</div>
          <div className="buttons">
            <button className="winbtn" onClick={onNo} />
          </div>
        </div>

        <div
          className="window-body"
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, lineHeight: 1.3 }}>{message}</div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="task" onClick={onYes}>
              {yesLabel}
            </button>
            <button className="task" onClick={onNo}>
              {noLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertModal({
  title,
  message,
  okLabel,
  onOk,
}: {
  title: string;
  message: string;
  okLabel: string;
  onOk: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") onOk();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onOk]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000,
        display: "grid",
        placeItems: "center",
        background: "rgba(0,0,0,0.15)",
      }}
      onMouseDown={onOk}
    >
      <div
        className="window"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ width: 420, height: 170, position: "relative", left: 0, top: 0 }}
      >
        <div
          className="titlebar"
          style={{
            position: "relative",
            zIndex: 2,
            background: "linear-gradient(to right, #000080, #1084d0)",
            color: "#fff",
          }}
        >
          <div>{title}</div>
          <div className="buttons">
            <button className="winbtn" onClick={onOk} />
          </div>
        </div>

        <div className="window-body" style={{ padding: 14 }}>
          <div style={{ whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.35 }}>
            {message}
          </div>

          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
            <button className="task" onClick={onOk}>
              {okLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Win95Toast({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div
      style={{
       position: "fixed",
left: 18,
top: 18,
bottom: undefined,
// taskbar 위로 살짝 띄움
        zIndex: 12000,
        pointerEvents: "none", // 클릭 방해 안 함
      }}
    >
      <div
        className="window"
        style={{
          width: 280,
          border: "1px solid #000",
          background: "#c0c0c0",
          boxShadow: "inset -2px -2px #808080, inset 2px 2px #fff",
        }}
      >
        {/* Win95 titlebar */}
        <div
          className="titlebar"
          style={{
            height: 22,
            padding: "2px 6px",
            background: "linear-gradient(to right, #000080, #1084d0)",
            color: "#fff",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          {title}
        </div>

        {/* body */}
        <div
          style={{
            padding: 10,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            fontSize: 12,
            lineHeight: 1.3,
          }}
        >
          {/* 느낌용 아이콘(노란 느낌의 경고) */}
          <div
            style={{
              width: 18,
              height: 18,
              border: "1px solid #000",
              background: "#ffff00",
              boxShadow: "inset -1px -1px #c0c0c0, inset 1px 1px #808080",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              color: "#000",
              flex: "0 0 auto",
            }}
          >
            !
          </div>

          <div style={{ flex: 1 }}>{message}</div>
        </div>
      </div>
    </div>
  );
}


function MuseumShell({
  view,
  onOpenTunnel,
  onBackToFiles,
  onTriggerMalware,
  onHint,
  isMobile,
}: {
  view: "files" | "tunnel";
  onOpenTunnel: () => void;
  onBackToFiles: () => void;
  onTriggerMalware: () => void;
  onHint: () => void;
  isMobile: boolean;
}) {
  if (view === "tunnel") {
    return (
      <div style={{ height: "100%" }}>
        {/* 상단 작은 네비 */}
        <div style={{ padding: 8, display: "flex", gap: 8 }}>
          <button className="task" onClick={onBackToFiles}>
            ← Back
          </button>
        </div>

        <div style={{ height: "calc(100% - 44px)" }}>
          <DigitalMuseum />
        </div>
      </div>
    );
  }

  // ✅ 파일 목록 화면
  return (
    <div style={{ padding: 12, fontSize: 13 }}>
      <div
        style={{
          fontWeight: 900,
          marginBottom: 12,
          fontSize: 26,
          letterSpacing: 0.5,
        }}
      >
        Digital Museum
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {/* 가짜 악성코드 */}
        <div
          className="icon"
          style={{ width: 120 }}
          onPointerUp={(e) => {
            if (e.button !== 0) return;
            if (isMobile) onTriggerMalware(); // ✅ 모바일: 한 번 탭 = 열기(경고)
            else onHint();                    // ✅ PC: 한 번 클릭 = 힌트
          }}
          onDoubleClick={() => {
            if (!isMobile) onTriggerMalware(); // ✅ PC: 더블클릭 = 열기(경고)
          }}
        >
          <img src="/icons/Files.png" alt="" draggable={false} style={{ pointerEvents: "none" }} />
          <span style={{ pointerEvents: "none" }}>MALWARE.exe</span>
        </div>
        {/* tunnel 드로잉 */}
        <div
          className="icon"
          style={{ width: 120 }}
           onPointerUp={(e) => {
            if (e.button !== 0) return;
            if (isMobile) onOpenTunnel(); // ✅ 모바일: 한 번 탭 = 열기
            else onHint();                // ✅ PC: 한 번 클릭 = 힌트
          }}
          onDoubleClick={() => {
            if (!isMobile) onOpenTunnel(); // ✅ PC: 더블클릭 = 열기
          }}
        >
          <img src="/icons/Files.png" alt="" draggable={false} style={{ pointerEvents: "none" }} />
          <span style={{ pointerEvents: "none" }}>tunnel_drawings</span>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        Double-click to open
      </div>
    </div>
  );
}

