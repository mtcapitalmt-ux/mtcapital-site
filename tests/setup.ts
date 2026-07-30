// Polyfills mínimos de jsdom para permitir testes de renderização de
// componentes que usam Reveal (components/ui/Reveal.tsx): o ambiente jsdom
// do Vitest não implementa `matchMedia` nem `IntersectionObserver`, e sem
// eles o efeito de Reveal lança exceção assim que o componente monta. Isso é
// infraestrutura de teste genérica (não específica de nenhuma seção) — o
// primeiro teste a renderizar um componente de verdade (tests/casos-render.test.tsx,
// Task 17) precisou disso; qualquer teste futuro que renderize algo com
// Reveal se beneficia do mesmo stub.

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as typeof window.matchMedia
}

if (typeof window !== 'undefined' && typeof window.IntersectionObserver !== 'function') {
  class StubIntersectionObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] { return [] }
  }
  const stub = StubIntersectionObserver as unknown as typeof IntersectionObserver
  window.IntersectionObserver = stub
  globalThis.IntersectionObserver = stub
}
