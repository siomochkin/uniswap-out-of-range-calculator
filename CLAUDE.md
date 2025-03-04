# Project Commands and Guidelines

## Build & Run Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines

### TypeScript
- Use strict TypeScript with explicit types for function parameters and returns
- Enable `noUnusedLocals` and `noUnusedParameters` settings
- Prefer type inference where possible

### React
- Use functional components with hooks
- Use React 18 features (concurrent rendering)
- Component props should have explicit interfaces

### Import Order
- React imports first
- Third-party libraries second
- Local imports third, organized by path depth

### Naming Conventions
- PascalCase for components and type definitions
- camelCase for variables and functions
- Use descriptive names that reflect purpose

### State Management
- Use React's built-in hooks for state (useState, useEffect, etc.)
- Prefer local component state when possible

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design patterns