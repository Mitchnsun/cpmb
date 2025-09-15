// Tests for Footer component
// Framework: React Testing Library with Jest/Vitest (matchers from @testing-library/jest-dom).
// If using Vitest, ensure your setup imports: import '@testing-library/jest-dom/vitest'
// If using Jest, ensure your setup imports: import '@testing-library/jest-dom'

import React from 'react'
import { render, screen, within } from '@testing-library/react'

// Prefer built-in framework timers; adapt to jest or vitest dynamically
// We detect global 'vi' for Vitest; otherwise assume Jest types.
const isVitest = typeof (globalThis as any).vi !== 'undefined'

// Mock next/image to render a plain img for predictable DOM
// Avoid double-mocking if a global mock exists; this local mock is safe in both Jest and Vitest.
if ('jest' in globalThis && typeof (globalThis as any).jest?.mock === 'function') {
  ;(globalThis as any).jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return React.createElement('img', { ...props })
    },
  }))

  ;(globalThis as any).jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ href, children, ...rest }: any) =>
      React.createElement('a', { href, ...rest }, children),
  }))
}

// For Vitest, provide equivalent manual mocks if jest.mock is unavailable
if (isVitest && !('jest' in globalThis)) {
  // @ts-ignore
  ;(globalThis as any).vi.mock('next/image', () => ({
    default: (props: any) => React.createElement('img', { ...props }),
  }))
  // @ts-ignore
  ;(globalThis as any).vi.mock('next/link', () => ({
    default: ({ href, children, ...rest }: any) =>
      React.createElement('a', { href, ...rest }, children),
  }))
}

// Import after mocks so Next modules are mocked
// Import path determined by repository scan; fallback handled above.
import Footer from './Footer'

describe('Footer', () => {
  beforeAll(() => {
    // Use fake timers to control Date.getFullYear() deterministically
    if (isVitest) {
      // @ts-ignore
      ;(global as any).vi['useFakeTimers']()
      // 2027-04-05 arbitrary stable date
      // @ts-ignore
      ;(global as any).vi['setSystemTime'](new Date('2027-04-05T12:00:00Z'))
    } else if ('jest' in globalThis) {
      // @ts-ignore
      ;(global as any).jest['useFakeTimers']()
      // @ts-ignore
      ;(global as any).jest['setSystemTime'](new Date('2027-04-05T12:00:00Z'))
    }
  })

  afterAll(() => {
    if (isVitest) {
      // @ts-ignore
      ;(global as any).vi['useRealTimers']()
    } else if ('jest' in globalThis) {
      // @ts-ignore
      ;(global as any).jest['useRealTimers']()
    }
  })

  it('renders a landmark footer element', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('displays three sponsor logos linking externally with proper security attributes', () => {
    render(<Footer />)

    const veran = screen.getByRole('link', { name: /Logo Veran Piano/i })
    expect(veran).toHaveAttribute('href', 'https://www.veran-piano.com/')
    expect(veran).toHaveAttribute('target', '_blank')
    expect(veran).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(veran).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    const veranImg = within(veran).getByRole('img', { name: /Logo Veran Piano/i })
    expect(veranImg).toBeInTheDocument()

    const gaillard = screen.getByRole('link', { name: /Logo Ville de Gaillard/i })
    expect(gaillard).toHaveAttribute('href', 'https://www.gaillard.fr/')
    expect(gaillard).toHaveAttribute('target', '_blank')
    expect(gaillard).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(gaillard).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    const gaillardImg = within(gaillard).getByRole('img', { name: /Logo Ville de Gaillard/i })
    expect(gaillardImg).toBeInTheDocument()

    const hauteSavoie = screen.getByRole('link', { name: /Logo Haute-?Savoie/i })
    expect(hauteSavoie).toHaveAttribute('href', 'https://www.hautesavoie.fr/')
    expect(hauteSavoie).toHaveAttribute('target', '_blank')
    expect(hauteSavoie).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(hauteSavoie).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    const hsImg = within(hauteSavoie).getByRole('img', { name: /Logo Haute-?Savoie/i })
    expect(hsImg).toBeInTheDocument()
  })

  it('renders the partners section with correct links and labels', () => {
    render(<Footer />)

    const partnersHeading = screen.getByRole('heading', { level: 4, name: /Nos Partenaires/i })
    expect(partnersHeading).toBeInTheDocument()

    // Scope queries to the partners section container
    const partnersSection = partnersHeading.closest('div') as HTMLElement
    expect(partnersSection).toBeTruthy()

    const partners = within(partnersSection).getAllByRole('link')
    // Expect exactly 3 partner links
    expect(partners).toHaveLength(3)

    const byName = (name: RegExp) =>
      partners.find((a) => a.textContent && name.test(a.textContent)) as HTMLElement

    const veran = byName(/Veran Piano/i)
    expect(veran).toHaveAttribute('href', 'https://www.veran-piano.com/')
    expect(veran).toHaveAttribute('target', '_blank')
    expect(veran).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(veran).toHaveAttribute('rel', expect.stringContaining('noreferrer'))

    const gaillard = byName(/Ville de Gaillard/i)
    expect(gaillard).toHaveAttribute('href', 'https://www.gaillard.fr/')
    expect(gaillard).toHaveAttribute('target', '_blank')
    expect(gaillard).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(gaillard).toHaveAttribute('rel', expect.stringContaining('noreferrer'))

    const deptHS = byName(/Haute-?Savoie/i)
    expect(deptHS).toHaveAttribute('href', 'https://www.hautesavoie.fr/')
    expect(deptHS).toHaveAttribute('target', '_blank')
    expect(deptHS).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(deptHS).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('renders the site map with internal navigation links', () => {
    render(<Footer />)

    const heading = screen.getByRole('heading', { level: 4, name: /Plan du site/i })
    expect(heading).toBeInTheDocument()

    const section = heading.closest('div') as HTMLElement
    const home = within(section).getByRole('link', { name: /Page d'accueil/i })
    expect(home).toHaveAttribute('href', '/')

    const legal = within(section).getByRole('link', { name: /Mentions légales/i })
    expect(legal).toHaveAttribute('href', '/mentions-legales')
  })

  it('shows the choir tagline', () => {
    render(<Footer />)
    expect(
      screen.getByText((content) =>
        typeof content === 'string' &&
        content.toLowerCase().includes("partager la passion de la musique chorale au cœur des alpes.")
      )
    ).toBeInTheDocument()
  })

  it('renders the current year and copyright notice (based on mocked date)', () => {
    render(<Footer />)
    // Expect © 2027 ... per mocked system time in beforeAll()
    expect(
      screen.getByText((content) =>
        typeof content === 'string' &&
        content.includes('©') &&
        content.includes('2027') &&
        content.toLowerCase().includes('chœur des pays du mont-blanc. tous droits réservés.')
      )
    ).toBeInTheDocument()
  })
})