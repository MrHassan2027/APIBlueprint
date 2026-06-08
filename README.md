# APIBlueprint

> VS Code extension that reads your OpenAPI YAML and generates a typed TypeScript fetch client instantly

## What it does
Right-click an `openapi.yml` file in VS Code and select "Generate TypeScript Client". APIBlueprint parses the spec, generates a fully-typed fetch wrapper with request/response types, and writes it to `src/api/client.ts`. No `axios`, no `openapi-generator` CLI required.

## Quick Start
1. Install from the VS Code Marketplace: search **APIBlueprint**
2. Open a project with an `openapi.yml` or `openapi.json`
3. Right-click the file → **Generate TypeScript Client**
4. Import and use:

```typescript
import { UsersApi } from "./api/client";

const api = new UsersApi({ baseUrl: "https://api.example.com" });
const user = await api.getUserById({ id: 42 });
// user is typed as User — no manual types needed
```

## Features
- Generates typed interfaces for all request/response schemas
- One class per tag group (e.g., `UsersApi`, `OrdersApi`)
- Handles path params, query params, request bodies
- Auth header injection via config
- `--watch` mode: re-generates on spec file save
- Works with OpenAPI 3.0 and 3.1

## Tech Stack
| Tool | Why |
|------|-----|
| TypeScript | VS Code extension API |
| `js-yaml` | YAML spec parsing |
| `vscode` API | File system + command registration |
| Handlebars templates | Code generation |
