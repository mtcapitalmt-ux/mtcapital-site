import { describe, it, expect, beforeEach, vi } from 'vitest'
import { permitir } from '@/lib/rate-limit'

describe('permitir', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-07-29T13:00:00Z')) })

  it('libera os primeiros envios e barra o excedente', () => {
    const ip = '203.0.113.10'
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(false)
  })

  it('libera de novo depois que a janela passa', () => {
    const ip = '203.0.113.11'
    expect(permitir(ip, 1, 60_000)).toBe(true)
    expect(permitir(ip, 1, 60_000)).toBe(false)
    vi.advanceTimersByTime(61_000)
    expect(permitir(ip, 1, 60_000)).toBe(true)
  })

  it('conta cada IP separadamente', () => {
    expect(permitir('203.0.113.20', 1, 60_000)).toBe(true)
    expect(permitir('203.0.113.21', 1, 60_000)).toBe(true)
  })
})
