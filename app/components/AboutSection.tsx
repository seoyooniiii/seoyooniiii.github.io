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
        <div style={{ marginTop: 12, ...groupBox }}>
          <div style={legend}>GUESTBOOK</div>

          <div style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.3 }}>
            닉네임 + 짧은 인삿말을 남겨줘. 저장 시각(년-월-일 시:분:초)이 기록돼.
            <br />
            ※ 정적 사이트라 브라우저(localStorage)에만 저장돼.
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 (1~20자)"
                maxLength={20}
                style={{
                  flex: 1,
                  height: 24,
                  padding: '0 8px',
                  fontSize: 12,
                  border: '1px solid #000',
                  boxShadow: 'inset -1px -1px #fff, inset 1px 1px #808080',
                }}
              />
              <button type="submit" disabled={!canSubmit} style={win95ButtonStyle(!canSubmit)}>
                Add
              </button>
            </div>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="짧은 인삿말 (1~60자)"
              maxLength={60}
              style={{
                height: 24,
                padding: '0 8px',
                fontSize: 12,
                border: '1px solid #000',
                boxShadow: 'inset -1px -1px #fff, inset 1px 1px #808080',
              }}
            />

            {error && <div style={{ fontSize: 11, color: '#800000' }}>{error}</div>}
          </form>

          <div style={{ marginTop: 10, ...whiteWell, padding: 8, maxHeight: 170, overflowY: 'auto' }}>
            {entries.length === 0 ? (
              <div style={{ fontSize: 12, opacity: 0.75 }}>No entries yet.</div>
            ) : (
              entries.map((e) => (
                <div key={e.id} style={{ padding: '6px 4px', borderBottom: '1px dotted #808080' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{e.nickname}</div>
                    <div style={{ fontSize: 11, opacity: 0.75 }}>{e.createdAt}</div>
                  </div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>{e.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
