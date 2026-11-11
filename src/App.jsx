import { useEffect, useState } from 'react'
import LedBoard from './themes/LedBoard.jsx'
import Fireworks from './themes/Fireworks.jsx'

const THEMES = {
  led: { label: 'LED Board', Component: LedBoard },
  fireworks: { label: 'Fireworks', Component: Fireworks },
}
const DEFAULTS = { text: 'AI-ASSISTED\nCONTAINER\nINSPECTION', theme: 'led', size: 100 }
const KEY = 'led-sign-settings'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { ...DEFAULTS, ...saved, theme: THEMES[saved.theme] ? saved.theme : DEFAULTS.theme }
  } catch {
    return DEFAULTS
  }
}

export default function App() {
  const [s, setS] = useState(load)
  const [panel, setPanel] = useState(true)
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
  }, [s])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.key === 'h' || e.key === 'H') setPanel((p) => !p)
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const scale = Math.min(vp.w / 1920, vp.h / 1080)
  const lines = s.text.split('\n').map((l) => l.trim()).filter(Boolean)
  const { Component } = THEMES[s.theme]
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }))

  return (
    <>
      <div className="viewport" data-theme={s.theme}>
        <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Component lines={lines.length ? lines : ['']} size={s.size} />
        </div>
      </div>

      {panel ? (
        <aside className="panel">
          <div className="panel-head">
            <strong>ตั้งค่าป้าย</strong>
            <button onClick={() => setPanel(false)} title="ซ่อน (กด H)">ซ่อน</button>
          </div>

          <label>ข้อความ (1 บรรทัด = 1 แถว)</label>
          <textarea rows={4} value={s.text} onChange={(e) => set({ text: e.target.value })} spellCheck={false} />

          <label>ธีม</label>
          <div className="seg">
            {Object.entries(THEMES).map(([id, t]) => (
              <button key={id} className={s.theme === id ? 'on' : ''} onClick={() => set({ theme: id })}>
                {t.label}
              </button>
            ))}
          </div>

          <label>ขนาดตัวอักษร: {s.size}%</label>
          <input type="range" min="40" max="130" step="1" value={s.size} onChange={(e) => set({ size: +e.target.value })} />

          <div className="row">
            <button onClick={toggleFullscreen}>เต็มจอ (F)</button>
            <button onClick={() => setS(DEFAULTS)}>รีเซ็ต</button>
          </div>
          <small>กด H เพื่อซ่อน/แสดงแผงนี้</small>
        </aside>
      ) : (
        <button className="panel-open" onClick={() => setPanel(true)} title="แสดงแผงตั้งค่า (กด H)">⚙</button>
      )}
    </>
  )
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.()
}
