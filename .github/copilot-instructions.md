# Copilot Instructions for Chœur des Pays du Mont-Blanc (CPMB)

## 🎯 Project Overview

This is the official website for **Chœur des Pays du Mont-Blanc**, a choir based in the Mont-Blanc region. The site showcases the choir's activities, concerts, and provides information to visitors about this vocal ensemble.

**Live Site**: https://choeurdespaysdumontblanc.fr/

## 🏗️ Architecture & Technology Stack

### Core Technologies

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS 4.1.13
- **UI Components**: shadcn/ui with Radix UI primitives
- **Runtime**: React 19.1.1
- **Package Manager**: Yarn 4.9.4

### Development Tools

- **Linting**: ESLint with comprehensive plugins for code quality, security, and accessibility
- **Formatting**: Prettier with TailwindCSS class sorting
- **Type Checking**: TypeScript compiler with strict mode
- **Testing**: Vitest 3.2.4 with React Testing Library and jest-dom
- **Test Environment**: jsdom with V8 coverage provider

## 📁 Project Structure

```
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage component
│   └── globals.css        # Global styles and Tailwind CSS imports
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components (drawer, button, etc.)
├── assets/               # Asset files (icons, content data)
├── scripts/              # Utility scripts
│   └── validate-concerts.js # Data validation script
├── docs/                 # Project documentation
│   └── VALIDATION.md     # Validation system documentation
├── public/               # Static assets (images, icons, etc.)
├── __tests__/            # Unit tests directory
│   ├── setup.ts          # Test setup configuration
│   └── *.test.tsx        # Component test files
├── .github/              # GitHub configurations and workflows
├── .vscode/              # VS Code settings
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration with advanced plugins
├── vitest.config.ts      # Vitest testing configuration
├── .prettierrc           # Prettier configuration with TailwindCSS plugin
├── .prettierignore       # Files to exclude from Prettier
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.test.json    # TypeScript configuration for tests
└── next.config.ts        # Next.js configuration
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

- Use Tailwind utility classes for all styling
- Classes are automatically sorted by Prettier in logical order: layout → spacing → styling
- Prefer Tailwind utilities over custom CSS when possible
- Use responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) for responsive design
- Utilize dark mode variants (`dark:`) when applicable

### Component Structure

- Components should be functional components with TypeScript
- Use proper TypeScript interfaces for props
- Follow React 19 best practices
- Implement proper accessibility with semantic HTML and ARIA attributes

## 🎨 shadcn/ui Component System

The project uses **shadcn/ui**, a modern component system built on **Radix UI** primitives and **Tailwind CSS**.

### Configuration

shadcn/ui is configured in `components.json`:

```json
{
  "style": "new-york", // Modern and elegant design style
  "baseColor": "slate", // Slate color palette for consistency
  "cssVariables": true, // CSS variables for theming
  "iconLibrary": "lucide", // Lucide React icons
  "rsc": true, // React Server Components support
  "tsx": true // TypeScript support
}
```

### Installed Components

- **Drawer** (`components/ui/drawer.tsx`) - Responsive sliding menu used in header navigation
- **Utils** (`utils/classnames.ts`) - CSS class management utilities

### Key Dependencies Added

- **@radix-ui/react-dialog** ^1.1.15 - Accessible dialog/modal primitives
- **vaul** ^1.1.2 - Optimized drawer component for mobile interfaces
- **lucide-react** ^0.544.0 - Modern icon library with consistent design
- **class-variance-authority** ^0.7.1 - Component variant management
- **clsx** ^2.1.1 - Conditional CSS class utility
- **tailwind-merge** ^3.3.1 - Intelligent Tailwind class merging

### Usage Patterns

```typescript
// Import shadcn/ui components
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";

// Responsive drawer implementation
<Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
  <DrawerTrigger asChild>
    <button className="lg:hidden" aria-label="Open menu">
      <MenuIcon />
    </button>
  </DrawerTrigger>
  <DrawerContent className="w-80 sm:w-96">
    <DrawerHeader>
      <DrawerTitle>Menu</DrawerTitle>
      <DrawerDescription>Site navigation</DrawerDescription>
    </DrawerHeader>
    {/* Content */}
  </DrawerContent>
</Drawer>
```

### Adding New Components

Use the shadcn/ui CLI to add components:

```bash
# Add a new component (e.g., button)
npx shadcn@latest add button

# Component will be created in components/ui/button.tsx
```

### Design Principles

- **Accessibility First**: All components follow WCAG guidelines with proper ARIA attributes
- **Responsive Design**: Components adapt seamlessly across device sizes
- **Customizable**: Fully customizable with Tailwind CSS utilities
- **Type Safe**: Complete TypeScript support with strict typing
- **Performance**: Tree-shakable components with minimal bundle impact
- **Consistency**: Unified design language across the application

### Best Practices

- Always use `asChild` prop when wrapping custom elements
- Implement proper focus management for keyboard navigation
- Use semantic HTML elements within component structures
- Test components with screen readers and keyboard-only navigation
- Maintain consistent spacing and sizing with Tailwind utilities
- Follow the established color palette (sky-700, slate variants)

## 🔧 Code Quality Standards

### ESLint Configuration

The project uses comprehensive ESLint plugins:

- **eslint-plugin-prettier**: Integrates Prettier formatting
- **eslint-plugin-import**: Validates import/export statements
- **eslint-plugin-sonarjs**: Detects code smells and complexity issues
- **eslint-plugin-security**: Identifies security vulnerabilities
- **eslint-plugin-unicorn**: Enforces modern JavaScript practices
- **eslint-plugin-unused-imports**: Removes unused imports automatically
- **eslint-plugin-simple-import-sort**: Sorts imports consistently
- **eslint-plugin-jsx-a11y**: Ensures accessibility compliance
- **eslint-plugin-vitest**: Provides specialized ESLint rules for Vitest testing framework

### Import Organization

Imports should be organized in this order:

1. React and Next.js imports
2. Third-party library imports
3. Internal component imports
4. Relative imports
5. Type-only imports (using `import type`)

### Key Rules Enforced

```javascript
{
  'prettier/prettier': 'error',
  'unused-imports/no-unused-imports': 'error',
  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',
  'unicorn/prevent-abbreviations': 'off',     // Disabled for choir terminology
  'unicorn/filename-case': 'off'              // Allows flexibility in naming
}
```

### ESLint for Testing

The project includes **eslint-plugin-vitest** which provides specialized linting rules for Vitest tests:

#### Key Vitest ESLint Rules

- **vitest/no-focused-tests**: Prevents `.only()` tests in production code
- **vitest/no-disabled-tests**: Warns about `.skip()` tests that may be forgotten
- **vitest/consistent-test-it**: Encourages consistent use of `test` vs `it`
- **vitest/recommended**: All recommended Vitest best practices enabled

#### Benefits

- **Error Prevention**: Catches common testing mistakes before runtime
- **Best Practices**: Enforces proper use of Vitest APIs
- **Code Quality**: Maintains consistent testing patterns across the codebase
- **Developer Experience**: Provides helpful hints for better test organization

## 🧪 Testing Framework

### Testing Stack

The project uses a modern testing setup:

- **Test Runner**: Vitest 3.2.4 for fast execution with hot module reloading
- **Testing Library**: React Testing Library for component testing with user-centric queries
- **Matchers**: jest-dom for DOM-specific assertions
- **Environment**: jsdom for browser simulation
- **Coverage**: V8 provider for accurate code coverage reports

### Testing Configuration

#### Global Setup

- Vitest globals are enabled (`describe`, `it`, `expect`, etc. available without imports)
- TypeScript configured with `"vitest/globals"` and `"@testing-library/jest-dom"` types
- ESLint configured to recognize Vitest globals in test files with **eslint-plugin-vitest**
- Test setup file at `__tests__/setup.ts` for browser API mocks

#### Key Features

- **No Import Required**: Test functions are globally available
- **Mock Support**: Browser APIs (window, document) automatically mocked
- **Coverage Reports**: Comprehensive coverage with detailed HTML reports
- **Watch Mode**: Tests re-run automatically on file changes
- **Interactive UI**: Visual test runner with Vitest UI

### Testing Best Practices

#### Component Testing

- Use React Testing Library's user-centric queries (`getByRole`, `getByLabelText`)
- Test behavior and accessibility, not implementation details
- Mock Next.js components (`Image`, `Link`) for isolated testing
- **Mock shadcn/ui SVG icons** properly in test files:
  ```typescript
  vi.mock("@/assets/icons/menu.svg", () => ({
    default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="menu-icon" {...props} />,
  }));
  ```
- Test responsive design and interactive elements
- **Test drawer interactions** and state management
- Verify accessibility compliance with shadcn/ui components

#### Test Organization

- Place test files in `__tests__/` directory
- Use descriptive test names explaining the expected behavior
- Group related tests with `describe` blocks
- Follow Arrange-Act-Assert pattern

#### Coverage Standards

- Maintain high component coverage (current: 93.59%)
- Focus on critical paths and user interactions
- Exclude configuration files and Next.js boilerplate from coverage
- Use coverage reports to identify untested code paths

#### Example Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Running Tests

- **Development**: `yarn test` for watch mode during development
- **CI/CD**: `yarn test:run` for single run in production pipelines
- **Coverage**: `yarn test:coverage` for comprehensive code coverage reports
- **Interactive**: `yarn test:ui` for visual test exploration

## � Data Validation System

The project includes a comprehensive data validation system to ensure data integrity and prevent runtime errors.

### Overview

The validation system automatically checks:

- **Structure Validation**: Required fields (title, slug, date, location, media) and optional fields (description, programme)
- **Unique Constraints**: Ensures all concert slugs are unique
- **Data Format**: Validates slug format (URL-friendly), date format (ISO), and field types
- **Asset Existence**: Verifies that all referenced media files exist in the public directory

### Implementation

- **Standalone Script**: `scripts/validate-concerts.js` - Node.js script with all validation functions
- **Helper Functions**: Modular validation functions to reduce cognitive complexity
- **CI/CD Integration**: Automatic validation in GitHub Actions workflow
- **Error Reporting**: Detailed error messages with field paths and values

### Key Validation Functions

- **`validateConcert(concert, index)`**: Validates a single concert object
- **`validateConcerts(concerts)`**: Validates array structure and unique slugs
- **`validateMediaAssets(concerts, publicDir)`**: Checks asset file existence
- **`validateConcertsWithAssets(concerts, publicDir)`**: Complete validation

### Usage in Development

```bash
# Validate concerts data
yarn validate:concerts

# Alternative command
yarn validate
```

### CI/CD Validation

Validation runs automatically on:

- Push to main, develop, or feature branches
- Pull requests to main or develop
- Changes to data files (`assets/contents/**`) or media files (`public/concerts/**`)

### Validation Rules

**Required Fields:**

- `title`: Non-empty string
- `slug`: URL-friendly format (lowercase, numbers, hyphens only)
- `date`: Array of valid ISO date strings
- `location`: Non-empty string
- `media`: Path to existing media file

**Optional Fields:**

- `description`: String if provided
- `programme`: Array of non-empty strings if provided

### Error Handling

The system provides detailed error reporting:

- Field-specific error messages
- Categorized errors (structure vs assets)
- Exit codes for CI/CD integration (0 = success, 1 = failure)

## �🛠️ Development Workflow

### Available Scripts

- `yarn dev` - Development server with Turbopack
- `yarn build` - Production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint checks
- `yarn lint:fix` - Auto-fix ESLint issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check if code is properly formatted
- `yarn type-check` - TypeScript type validation
- `yarn test` - Run tests in watch mode
- `yarn test:run` - Run tests once
- `yarn test:coverage` - Generate comprehensive code coverage reports
- `yarn test:ui` - Open Vitest UI for interactive testing
- `yarn validate:concerts` - Validate concerts data structure and asset existence
- `yarn validate` - Alias for data validation

### Pre-commit Checklist

1. Run `yarn lint` to check for code quality issues
2. Run `yarn format` to ensure consistent formatting
3. Run `yarn type-check` to validate TypeScript
4. Run `yarn test:run` to ensure all tests pass
5. Run `yarn validate` to ensure data integrity
6. Test the application with `yarn dev`

## 🌐 Content Guidelines

### Language & Localization

- Primary language: French (site serves French-speaking choir community)
- Use proper French typography and punctuation
- Consider internationalization if expanding to other languages

### Content Structure

- Focus on choir activities, concerts, and community engagement
- Maintain professional yet welcoming tone
- Ensure accessibility for all users
- Include proper metadata for SEO

## 🔒 Security & Performance

### Security Considerations

- ESLint security plugin actively monitors for vulnerabilities
- Sanitize any user inputs
- Use Next.js built-in security features
- Implement proper CORS policies if needed

### Performance Guidelines

- Optimize images using Next.js `Image` component
- Implement proper loading states
- Use React 19 features like Server Components when beneficial
- Leverage Next.js caching strategies
- **Implement responsive navigation** patterns:
  - Desktop: Classical navigation (lg+) for quick access
  - Mobile: Drawer navigation (<lg) for space efficiency
- Use `"use client"` directive only when needed for interactive components

## 📝 Code Contribution Guidelines

### When Making Changes

1. **Maintain Code Quality**: All code must pass ESLint checks without errors
2. **Follow Formatting**: Use Prettier for consistent code style
3. **Type Safety**: Ensure TypeScript compilation succeeds
4. **Testing**: Write tests for new components and maintain coverage standards
5. **Data Validation**: Ensure `yarn validate` passes without errors
6. **Accessibility**: Maintain WCAG compliance using jsx-a11y rules
7. **Performance**: Consider impact on bundle size and loading times

### Component Development

- Create reusable, well-typed components
- **Prefer shadcn/ui components** for UI elements when available
- Use semantic HTML elements
- Implement proper error boundaries where needed
- Follow React best practices for hooks and state management
- Write comprehensive tests for all new components
- Ensure accessibility compliance with ARIA attributes and semantic markup
- **Test responsive behavior** across different screen sizes
- **Mock shadcn/ui components** properly in test files
- Use `asChild` pattern when composing shadcn/ui components

### File Naming Conventions

- Use `kebab-case` for directories
- Use `PascalCase` for component files
- Use `camelCase` for utility files
- Include descriptive names that reflect component purpose

## 🎵 Domain-Specific Context

### Choir Terminology

- "Chœur" = Choir (French)
- "Pays du Mont-Blanc" = Mont-Blanc region
- Focus on classical/traditional choral music
- Community-centered organization
- Regional cultural significance

### Target Audience

- Choir members and their families
- Local community interested in choral music
- Potential new members
- Concert attendees
- Cultural institutions in the Mont-Blanc region

## 🚀 Deployment & Maintenance

### Deployment Platform

- Optimized for Vercel deployment
- Compatible with other Next.js hosting platforms
- Production builds use optimizations for performance

### Monitoring & Updates

- Keep dependencies updated regularly
- Monitor for security vulnerabilities
- Test thoroughly before deploying changes
- Maintain backward compatibility when possible

---

**Remember**: This project represents an important cultural institution. Maintain professionalism, respect the choir's mission, and ensure all changes enhance the user experience while preserving the site's integrity and purpose.

### Key Implementation Notes

- **shadcn/ui Integration**: The project now uses shadcn/ui for consistent, accessible UI components
- **Responsive Navigation**: Header implements responsive behavior with classical nav (desktop) and drawer (mobile)
- **Component Testing**: All shadcn/ui components require proper mocking and accessibility testing
- **Design System**: Follow the established color palette (sky-700) and spacing patterns for consistency
- **Data Validation**: The project includes comprehensive data validation with automated CI/CD checks
