'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type GuestbookEntry = {
  id: string;
  nickname: string;
  message: string;
  createdAt: string;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatTimestamp(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

const STORAGE_KEY = 'seoyoon_guestbook_v1';

export default function AboutSection({ onOk }: { onOk?: () => void }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as GuestbookEntry[];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const canSubmit = useMemo(() => nickname.trim() && message.trim(), [nickname, message]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nick = nickname.trim();
    const msg = message.trim();

    if (!nick || !msg) return setError('닉네임과 인삿말을 모두 입력해줘.');
    if (nick.length > 20) return setError('닉네임은 20자 이내로 해줘.');
    if (msg.length > 60) return setError('인삿말은 60자 이내로 해줘.');

    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      nickname: nick,
      message: msg,
      createdAt: formatTimestamp(new Date()),
    };

    setEntries((prev) => [entry, ...prev]);
    setMessage('');
  }

  function win95ButtonStyle(disabled?: boolean): React.CSSProperties {
    return {
      height: 26,
      padding: '0 18px',
      border: '1px solid #000',
      background: '#c0c0c0',
      boxShadow: 'inset 1px 1px #fff, inset -1px -1px #808080',
      fontSize: 12,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };
  }

  const panelOuter: React.CSSProperties = {
    height: '100%',
    background: '#c0c0c0',
    padding: 10,
    boxSizing: 'border-box',
  };

  const insetPanel: React.CSSProperties = {
    background: '#c0c0c0',
    border: '1px solid #000',
    boxShadow: 'inset -2px -2px #808080, inset 2px 2px #fff',
  };

  const whiteWell: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #000',
    boxShadow: 'inset -2px -2px #c0c0c0, inset 2px 2px #808080',
  };

  const groupBox: React.CSSProperties = {
    border: '1px solid #000',
    boxShadow: 'inset -1px -1px #808080, inset 1px 1px #fff',
    padding: '14px 10px 10px',
    position: 'relative',
    background: '#c0c0c0',
  };

  const legend: React.CSSProperties = {
    position: 'absolute',
    top: -9,
    left: 10,
    background: '#c0c0c0',
    padding: '0 6px',
    fontSize: 12,
    fontWeight: 700,
  };

  return (
    <div style={panelOuter}>
      {/* Win95 About-style layout */}
      <div style={{ ...insetPanel, padding: 10 }}>
        {/* Top image area (like the Discord example) */}
        <div style={{ ...whiteWell, padding: 10 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 86,
                height: 86,
                border: '1px solid #000',
                boxShadow: '2px 2px 0 #808080',
                background: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Image src="/profile.jpg" alt="profile" fill className="object-cover" />
            </div>

            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.5 }}>seoyooniiii</div>
              <div style={{ marginTop: 4, fontSize: 12 }}>Windows 95 style portfolio</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                Email:{' '}
                <a href="mailto:vegeta318@naver.com" style={{ textDecoration: 'underline', color: '#000080' }}>
                  vegeta318@naver.com
                </a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12 }}>
            Drawing · 3D · TouchDesigner
          </div>
        </div>

        {/* Info text (centered like classic About) */}
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, lineHeight: 1.35 }}>
          <div>Tools: Blender / TouchDesigner / After Effects</div>
          <div style={{ marginTop: 4 }}>© {new Date().getFullYear()} seoyooniiii</div>
        </div>

        {/* OK button row (classic) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <button type="button" style={win95ButtonStyle(false)} onClick={onOk}>
            OK
          </button>
                </div>

        {/* Guestbook group box */}
<div
  style={{
    marginTop: 12,
    ...groupBox,
    background: '#c0c0c0', // ✅ 내부도 회색
    border: '2px solid #000',
    boxShadow: 'inset -2px -2px #808080, inset 2px 2px #fff, 2px 2px 0 #808080',
  }}
>
  <div style={{ ...legend, fontSize: 13, letterSpacing: 0.6 }}>
    PRIVATE GUESTBOOK
  </div>

  {/* ✅ 내부 안내 패널: 회색 + "파인" 박스(버튼 아님) */}
  <div
    style={{
      border: '1px solid #000',
      background: '#c0c0c0',
      padding: 10,
      boxShadow: 'inset 2px 2px #808080, inset -2px -2px #fff', // ✅ inset(파인 느낌)
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}
  >
    {/* 아이콘 */}
    <div
      style={{
        width: 34,
        height: 34,
        border: '1px solid #000',
        boxShadow: 'inset 1px 1px #fff, inset -1px -1px #808080',
        background: '#c0c0c0',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 900,
        fontSize: 18,
        color: '#000080',
        userSelect: 'none',
      }}
      aria-hidden
    >
      i
    </div>

    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, lineHeight: 1.35 }}>
        Leave a private note.
        <br />
        Messages are not publicly visible.
      </div>

      {/* ✅ 버튼처럼 보이지 않는 "태그" 라벨 */}
      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            padding: '1px 6px',
            border: '1px solid #000',
            background: '#000080',
            color: '#fff',
            letterSpacing: 0.6,
            lineHeight: 1.4,
          }}
        >
          PRIVATE
        </span>
        <span style={{ fontSize: 11, opacity: 0.85 }}>Stored in Tally</span>
      </div>
    </div>
  </div>

  {/* 버튼 줄 */}
  <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
    <a
      href="https://tally.so/r/eq62AE"
      target="_blank"
      rel="noreferrer"
      style={{
        ...win95ButtonStyle(false),
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#000',
      }}
    >
      Open
    </a>
  </div>
</div>



      </div>     {/* ✅ insetPanel 닫힘 */}
    </div>       /* ✅ panelOuter 닫힘 */
  );
}
