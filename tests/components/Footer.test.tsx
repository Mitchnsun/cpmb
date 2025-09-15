/**
 * Tests for components/Footer.tsx
 *
 * Testing library and framework:
 * - Vitest (test runner, mocking)
 * - React Testing Library + jest-dom matchers (via @testing-library/jest-dom/vitest)
 *
 * Note: This repository currently has no explicit test dependencies/scripts.
 * To run these tests, install (dev) at minimum:
 *   - vitest
 *   - jsdom
 *   - @testing-library/react
 *   - @testing-library/jest-dom
 * And configure Vitest to use the jsdom environment.
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Footer from '../../components/Footer';

// Mock Next.js components

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    // emulate an <img> so RTL can query roles/attributes
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-testid={`image-${alt}`}
    />
  ),
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className }: any) => (
    <a href={href} className={className} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the footer element with base class', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('font-noto');
    });

    it('renders all partner logos with correct attributes', () => {
      render(<Footer />);

      const veranLogo = screen.getByAltText('Logo Veran Piano');
      expect(veranLogo).toHaveAttribute('src', '/logo-veran-pianos.png');
      expect(veranLogo).toHaveAttribute('width', '200');
      expect(veranLogo).toHaveAttribute('height', '120');

      const gaillardLogo = screen.getByAltText('Logo Ville de Gaillard');
      expect(gaillardLogo).toHaveAttribute('src', '/logo-gaillard.png');
      expect(gaillardLogo).toHaveAttribute('width', '200');
      expect(gaillardLogo).toHaveAttribute('height', '120');

      const hauteSavoieLogo = screen.getByAltText('Logo Haute-Savoie');
      expect(hauteSavoieLogo).toHaveAttribute('src', '/haute-savoie.svg');
      expect(hauteSavoieLogo).toHaveAttribute('width', '90');
      expect(hauteSavoieLogo).toHaveAttribute('height', '55');
    });

    it('renders the CPMB logo with correct attributes', () => {
      render(<Footer />);
      const cpmbLogo = screen.getByAltText('Logo Choeur des Pays du Mont-Blanc');
      expect(cpmbLogo).toHaveAttribute('src', '/CPMB-logo-blanc.png');
      expect(cpmbLogo).toHaveAttribute('width', '160');
      expect(cpmbLogo).toHaveAttribute('height', '55');
    });

    it('renders the tagline text', () => {
      render(<Footer />);
      expect(
        screen.getByText('Partager la passion de la musique chorale au cœur des Alpes.')
      ).toBeInTheDocument();
    });

    it('renders section headers', () => {
      render(<Footer />);
      expect(screen.getByText('Nos Partenaires')).toBeInTheDocument();
      expect(screen.getByText('Plan du site')).toBeInTheDocument();
    });
  });

  describe('Partner Links', () => {
    it('renders partner logo links with target and rel attributes', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link').filter(a => a.getAttribute('target') === '_blank');

      const veranLogoLink = links.find(l => l.getAttribute('href') === 'https://www.veran-piano.com/');
      expect(veranLogoLink).toBeInTheDocument();
      expect(veranLogoLink).toHaveAttribute('rel', 'noopener noreferrer');

      const gaillardLogoLink = links.find(l => l.getAttribute('href') === 'https://www.gaillard.fr/');
      expect(gaillardLogoLink).toBeInTheDocument();
      expect(gaillardLogoLink).toHaveAttribute('rel', 'noopener noreferrer');

      const hauteSavoieLogoLink = links.find(l => l.getAttribute('href') === 'https://www.hautesavoie.fr/');
      expect(hauteSavoieLogoLink).toBeInTheDocument();
      expect(hauteSavoieLogoLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders partner text links with correct href and classes', () => {
      render(<Footer />);

      const veranText = screen.getByRole('link', { name: 'Veran Piano' });
      expect(veranText).toHaveAttribute('href', 'https://www.veran-piano.com/');
      expect(veranText).toHaveClass('text-gray-400', 'hover:text-white');

      const gaillardText = screen.getByRole('link', { name: 'Ville de Gaillard' });
      expect(gaillardText).toHaveAttribute('href', 'https://www.gaillard.fr/');
      expect(gaillardText).toHaveClass('text-gray-400', 'hover:text-white');

      const hsText = screen.getByRole('link', { name: 'Département de la Haute-Savoie' });
      expect(hsText).toHaveAttribute('href', 'https://www.hautesavoie.fr/');
      expect(hsText).toHaveClass('text-gray-400', 'hover:text-white');
    });

    it('opens external links in a new tab with security attributes (3 logos + 3 text = 6)', () => {
      render(<Footer />);
      const external = screen.getAllByRole('link').filter(a => a.getAttribute('target') === '_blank');
      expect(external).toHaveLength(6);
      external.forEach(a => expect(a).toHaveAttribute('rel', 'noopener noreferrer'));
    });
  });

  describe('Site Navigation Links', () => {
    it('renders internal navigation links with correct text and classes', () => {
      render(<Footer />);
      const homeLink = screen.getByTestId('link-/');
      expect(homeLink).toHaveTextContent("Page d'accueil");
      expect(homeLink).toHaveClass('text-gray-400', 'hover:text-white');

      const legalLink = screen.getByTestId('link-/mentions-legales');
      expect(legalLink).toHaveTextContent('Mentions légales');
      expect(legalLink).toHaveClass('text-gray-400', 'hover:text-white');
    });

    it('does not set target on internal links', () => {
      render(<Footer />);
      expect(screen.getByTestId('link-/')).not.toHaveAttribute('target');
      expect(screen.getByTestId('link-/mentions-legales')).not.toHaveAttribute('target');
    });
  });

  describe('Copyright Notice', () => {
    it('displays the current year', () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);
      expect(
        screen.getByText(`© ${currentYear} Chœur des Pays du Mont-Blanc. Tous droits réservés.`)
      ).toBeInTheDocument();
    });

    it('updates year dynamically based on system time', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
      render(<Footer />);
      expect(screen.getByText(/© 2025/)).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('handles year transition (2024 -> 2025)', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-12-31T23:59:59Z'));
      const { rerender } = render(<Footer />);
      expect(screen.getByText(/© 2024/)).toBeInTheDocument();

      vi.setSystemTime(new Date('2025-01-01T00:00:01Z'));
      rerender(<Footer />);
      expect(screen.getByText(/© 2025/)).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('applies correct classes to the top container', () => {
      render(<Footer />);
      const top = screen.getByRole('contentinfo').querySelector('.container');
      expect(top).toHaveClass('mx-auto', 'flex', 'items-center', 'justify-around', 'gap-6', 'py-4', 'text-center');
    });

    it('applies correct classes to the dark section', () => {
      render(<Footer />);
      const dark = screen.getByRole('contentinfo').querySelector('.bg-gray-800');
      expect(dark).toBeInTheDocument();
      expect(dark).toHaveClass('bg-gray-800', 'px-4');
    });

    it('applies responsive flex and gap classes', () => {
      render(<Footer />);
      const flexContainer = screen.getByRole('contentinfo').querySelector('[class*="lg:flex-row"]');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('flex', 'flex-col', 'items-start', 'gap-4', 'py-4', 'lg:flex-row', 'lg:gap-24');
    });

    it('applies spacing classes to lists', () => {
      render(<Footer />);
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
      lists.forEach(list => expect(list).toHaveClass('space-y-1', 'text-sm'));
    });
  });

  describe('Accessibility and Structure', () => {
    it('uses semantic elements and headings', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');

      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s).toHaveLength(2);
    });

    it('ensures all links have accessible names', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).not.toHaveTextContent('');
      });
    });

    it('ensures all images have alt text', () => {
      render(<Footer />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('uses proper list structure for navigation', () => {
      render(<Footer />);
      const lists = screen.getAllByRole('list');
      lists.forEach(list => {
        const items = list.querySelectorAll('li');
        expect(items.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Component Structure Consistency', () => {
    it('has correct nesting of partner links', () => {
      render(<Footer />);
      const partnerSection = screen.getByText('Nos Partenaires').parentElement!;
      const partnerLinks = partnerSection.querySelectorAll('a');
      expect(partnerLinks).toHaveLength(3);
      expect(partnerLinks[0]).toHaveTextContent('Veran Piano');
      expect(partnerLinks[1]).toHaveTextContent('Ville de Gaillard');
      expect(partnerLinks[2]).toHaveTextContent('Département de la Haute-Savoie');
    });

    it('has correct nesting of site navigation links', () => {
      render(<Footer />);
      const siteMap = screen.getByText('Plan du site').parentElement!;
      const navLinks = siteMap.querySelectorAll('a');
      expect(navLinks).toHaveLength(2);
      expect(navLinks[0]).toHaveTextContent("Page d'accueil");
      expect(navLinks[1]).toHaveTextContent('Mentions légales');
    });

    it('maintains consistent structure across renders (ignoring dynamic year)', () => {
      const { container: first } = render(<Footer />);
      const { container: second } = render(<Footer />);
      const norm = (html: string) => html.replace(/© ?[0-9]{4}/g, '© YEAR');
      expect(norm(first.innerHTML)).toEqual(norm(second.innerHTML));
    });
  });

  describe('Responsive Layout', () => {
    it('uses basis classes for the three top partner logo anchors', () => {
      render(<Footer />);
      const basisEls = screen.getByRole('contentinfo').querySelectorAll('[class*="basis-1/3"]');
      expect(basisEls).toHaveLength(3);
    });
  });
});