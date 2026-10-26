# Shared contracts

This package owns the Zod schemas and inferred TypeScript types used by the backend and frontend. Keep schemas grouped by domain in `src/<domain>.schema.ts` and export them through the package subpath, such as `@time-manager/contracts/users`. The root entrypoint re-exports all domains for consumers that need the complete contract surface.

Validate HTTP request bodies in backend middleware or controllers. Validate HTTP responses in the matching frontend feature API module, then return typed domain data to pages and components. UI pages should not import Zod schemas or parse raw HTTP responses.