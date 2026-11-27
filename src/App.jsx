import { useEffect, useState } from 'react'
import { Lock, Maximize, RotateCcw, Settings2, X } from 'lucide-react'
import LedBoard from './themes/LedBoard.jsx'
import Fireworks from './themes/Fireworks.jsx'
import { PALETTES } from './palettes.js'
import Scene from './themes/Scene.jsx'
import LockOverlay from './components/LockOverlay.jsx'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const THEMES = {
  led: { label: 'LED Board', Component: LedBoard },
  fireworks: { label: 'Fireworks', Component: Fireworks },
  neon: { label: 'Neon Diner' },
  casino: { label: 'Casino' },
  billboard: { label: 'Billboard' },
  matrix: { label: 'Matrix' },
  aurora: { label: 'Aurora' },
  synthwave: { label: 'Synthwave' },
  starfield: { label: 'Warp Stars' },
  bubbles: { label: 'Underwater' },
  snow: { label: 'Snowfall' },
  amber: { label: 'Amber' },
}
const DEFAULTS = { text: 'AI-ASSISTED\nCONTAINER\nINSPECTION', theme: 'led', palette: 'rainbow', size: 100 }
const KEY = 'led-sign-settings'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { ...DEFAULTS, ...saved, theme: THEMES[saved.theme] ? saved.theme : DEFAULTS.theme, palette: PALETTES[saved.palette] ? saved.palette : DEFAULTS.palette }
  } catch {
    return DEFAULTS
  }
}

export default function App() {
  const [s, setS] = useState(load)
  const [panel, setPanel] = useState(true)
  const [locked, setLocked] = useState(false)
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
  }, [s])

  // Keep the tablet awake while the sign is showing.
  useEffect(() => {
    let lock
    const acquire = () => navigator.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {})
    const onVisible = () => document.visibilityState === 'visible' && acquire()
    acquire()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (locked || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.key === 'h' || e.key === 'H') setPanel((p) => !p)
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked])

  const scale = Math.min(vp.w / 1920, vp.h / 1080)
  const lines = s.text.split('\n').map((l) => l.trim()).filter(Boolean)
  const { Component } = THEMES[s.theme]
  const shown = lines.length ? lines : ['']
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }))

  const lockScreen = () => {
    setPanel(false)
    setLocked(true)
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
  }

  return (
    <>
      <div className="viewport" data-theme={s.theme} style={paletteVars(s.palette)}>
        <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {Component ? <Component lines={shown} size={s.size} /> : <Scene id={s.theme} lines={shown} size={s.size} />}
        </div>
      </div>

      {locked && <LockOverlay onUnlock={() => setLocked(false)} />}

      {!locked && (panel ? (
        <aside className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-3xl p-3">
          <div className="space-y-5 rounded-xl border bg-card/95 p-5 text-card-foreground shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">ตั้งค่าป้าย</h2>
              <Button variant="ghost" size="icon" onClick={() => setPanel(false)} aria-label="ซ่อนแผงตั้งค่า">
                <X />
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">ข้อความ (1 บรรทัด = 1 แถว)</p>
                <Textarea rows={4} value={s.text} onChange={(e) => set({ text: e.target.value })} spellCheck={false} />
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">ธีม</p>
                  <ToggleGroup type="single" className="flex-wrap" value={s.theme} onValueChange={(v) => v && set({ theme: v })}>
                    {Object.entries(THEMES).map(([id, t]) => (
                      <ToggleGroupItem key={id} value={id} className="h-10 flex-none px-3">{t.label}</ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ขนาดตัวอักษร: {s.size}%</p>
                  <Slider min={40} max={130} step={1} value={[s.size]} onValueChange={([v]) => set({ size: v })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="secondary" onClick={toggleFullscreen}><Maximize />เต็มจอ</Button>
              <Button variant="outline" onClick={() => setS(DEFAULTS)}><RotateCcw />รีเซ็ต</Button>
              <Button onClick={lockScreen}><Lock />ล็อกจอ</Button>
            </div>
          </div>
        </aside>
      ) : (
        <div className="fixed bottom-4 left-4 z-10 flex gap-3">
          <Button size="icon" variant="secondary" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setPanel(true)} aria-label="แสดงแผงตั้งค่า">
            <Settings2 />
          </Button>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={lockScreen} aria-label="ล็อกจอ">
            <Lock />
          </Button>
        </div>
      ))}
    </>
  )
}

function paletteVars(id) {
  const c = PALETTES[id].colors
  return { '--c1': c[0], '--c2': c[1], '--c3': c[2], '--c4': c[3] }
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.()
}
