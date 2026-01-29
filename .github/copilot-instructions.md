# AThursdayAdmin Copilot Instructions

## Architecture Overview
- **Standalone Angular 21 app** with SSR enabled (`src/server.ts`, `main.server.ts`)
- **Token-based authentication**: Bearer tokens in localStorage, auto-attached via `tokenInterceptor`
- **Backend API**: `http://localhost:5000/api/*` (auth, category, products)
- **Routing**: Public `/login`, protected routes under `MainLayout` with `authGuard`
- **Component structure**: Pages in `src/app/pages/`, services in `src/app/services/`, shared in `src/app/shared/`

## Key Patterns
- **Dependency injection**: Use `inject()` instead of constructor injection
- **HTTP services**: CRUD methods with `retry(2)` for GET, `retry(1)` for mutations, `catchError` logging
- **Components**: 
  - `zone.run(() => { ...; cdr.detectChanges(); })` for async updates
  - `takeUntil(destroy$)` for subscriptions, `finalize()` for loading states
  - Modal-based CRUD (showAdd, showEdit, etc.) with actionLoading flags
- **Search**: Debounced with `debounceTime(300)`, `distinctUntilChanged()`
- **TrackBy**: Use `trackById` in `*ngFor` for performance

## Development Workflow
- **Start dev server**: `npm start` (ng serve)
- **Build**: `npm run build` (ng build)
- **Test**: `npm test` (Vitest)
- **SSR serve**: `npm run serve:ssr:a-thursday-admin`
- **Generate component**: `ng generate component --standalone`

## Code Style
- **Prettier**: `printWidth: 100`, `singleQuote: true`, Angular parser for HTML
- **Selector prefix**: `app-`
- **Styling**: Tailwind CSS classes
- **Imports**: Group Angular core, then external, then local

## Examples
- **Service method**: `this.http.get<Category[]>(API).pipe(retry(2), catchError(this.handleError))`
- **Component update**: `this.zone.run(() => { this.data = res; this.cdr.detectChanges(); });`
- **Auth check**: `if (auth.isLoggedIn()) return true; router.navigateByUrl('/login');`</content>
<parameter name="filePath">g:\PHIAN_INFO\a-thursday-admin\.github\copilot-instructions.md