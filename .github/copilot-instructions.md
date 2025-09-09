# Copilot Instructions for Chœur des Pays du Mont-Blanc (CPMB)

## 🎯 Project Overview

This is the official website for **Chœur des Pays du Mont-Blanc**, a choir based in the Mont-Blanc region. The site showcases the choir's activities, concerts, and provides information to visitors about this vocal ensemble.

**Live Site**: https://choeurdespaysdumontblanc.fr/

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS 4.1.13
- **Runtime**: React 19.1.1
- **Package Manager**: Yarn 4.9.4

### Development Tools
- **Linting**: ESLint with comprehensive plugins for code quality, security, and accessibility
- **Formatting**: Prettier with TailwindCSS class sorting
- **Type Checking**: TypeScript compiler with strict mode

## 📁 Project Structure

```
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage component
│   └── globals.css        # Global styles and Tailwind CSS imports
├── public/                # Static assets (images, icons, etc.)
├── .github/               # GitHub configurations and workflows
├── .vscode/               # VS Code settings
├── eslint.config.js       # ESLint configuration with advanced plugins
├── .prettierrc            # Prettier configuration with TailwindCSS plugin
├── .prettierignore        # Files to exclude from Prettier
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.ts         # Next.js configuration
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

## 🛠️ Development Workflow

### Available Scripts
- `yarn dev` - Development server with Turbopack
- `yarn build` - Production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint checks
- `yarn lint:fix` - Auto-fix ESLint issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check if code is properly formatted
- `yarn type-check` - TypeScript type validation

### Pre-commit Checklist
1. Run `yarn lint` to check for code quality issues
2. Run `yarn format` to ensure consistent formatting
3. Run `yarn type-check` to validate TypeScript
4. Test the application with `yarn dev`

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

## 📝 Code Contribution Guidelines

### When Making Changes
1. **Maintain Code Quality**: All code must pass ESLint checks without errors
2. **Follow Formatting**: Use Prettier for consistent code style
3. **Type Safety**: Ensure TypeScript compilation succeeds
4. **Accessibility**: Maintain WCAG compliance using jsx-a11y rules
5. **Performance**: Consider impact on bundle size and loading times

### Component Development
- Create reusable, well-typed components
- Use semantic HTML elements
- Implement proper error boundaries where needed
- Follow React best practices for hooks and state management

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