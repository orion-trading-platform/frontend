# transactional

Email templates built with [react-email](https://react.email/docs/introduction).

This package lives here according to the [official monorepo setup guide](https://react.email/docs/getting-started/monorepo-setup/npm).

> **Naming convention:** Use `snake_case` for all template files (e.g. `password_reset.tsx`). The exported `.html` filenames must match the names the Python and Go backends expect, and both backends use snake_case.

---

## What is react-email?

React Email lets you write email templates as React components. At export time, `@react-email/render` converts the component tree into a plain HTML string that any email provider can send (we currently are using Resend). You get component reuse, TypeScript, and a live preview server — without fighting raw HTML tables.

**Simple example:**

```tsx
import { Html, Heading, Text } from '@react-email/components';

// Placeholder constants — exported literally into the HTML so the backend can
// substitute real values at send time via simple string replacement.
const RESET_TOKEN = '{{reset_token}}';
const EXPIRE_MINUTES = '{{expire_minutes}}';

export default function PasswordReset() {
  return (
    <Html>
      <Heading>Password Reset Request</Heading>
      <Text>Enter the code below to reset your password. It expires in {EXPIRE_MINUTES} minutes.</Text>
      <Text style={{ fontFamily: 'monospace', fontSize: '1.4em', letterSpacing: '0.1em' }}>
        <strong>{RESET_TOKEN}</strong>
      </Text>
      <Text>If you didn't request this, please ignore this email.</Text>
    </Html>
  );
}
```

> [!NOTE]
> An expanded working example with image handling is in [`emails/simple_example.tsx`](emails/simple_example.tsx).

---

## Development

Preview templates in a browser with hot reload.

From the **repo root** (preferred):

```bash
npm run dev -w transactional
```

Or from this directory (no separate `npm install` needed — the root workspace install covers it):

```bash
cd packages/transactional
npm run dev
```

This opens the react-email dev server (usually at `http://localhost:3000`) showing all templates in `emails/`.

### Images and static assets

> **Disclaimer:** Email clients block data URIs and have no filesystem access — `<Img src>` must be an **absolute URL** in any exported or sent email. The approach below is for local preview only.

Templates run in Node.js, so you can read a local file and encode it as a base64 data URI for the preview server. Relative paths and `public/` directory serving do **not** work — the react-email dev server doesn't expose the filesystem.

```tsx
import { readFileSync } from 'fs';
import { join } from 'path';

function getLogoSrc(): string {
  try {
    const svg = readFileSync(join(__dirname, '../../../apps/web_client/src/assets/logo-black.svg'));
    return `data:image/svg+xml;base64,${svg.toString('base64')}`;
  } catch {
    return 'https://oriontrading.pro/logo-black.svg'; // fallback
  }
}

const logoSrc = getLogoSrc();
// Then: <Img src={logoSrc} ... />
```

Before running `npm run export`, swap `logoSrc` for the hosted absolute URL — data URIs will be stripped by email clients.

---

## Exporting to HTML

When templates are ready, export them to static HTML files.

From the **repo root** (preferred):

```bash
npm run export -w transactional
```

Or from this directory:

```bash
npm run export
```

This writes one `.html` file per template into `packages/transactional/out/`.

**Then commit those `.html` files to both backend directories:**

Each backend keeps its own copy because Go's `//go:embed` cannot reference paths outside its own module, so a single shared location isn't possible.

| Destination | Used by |
|---|---|
| `database-system/api/emails/` | Python (read at runtime via `pathlib`) |
| `database-system/api-go/handlers/emails/` | Go (embedded into binary at compile time) |

Both files are identical — update both whenever a template changes.

**Dynamic values** (tokens, expiry times, etc.) are not passed as props. Instead, use literal placeholder strings in the template (e.g. `{{reset_token}}`, `{{expire_minutes}}`), which the backend substitutes before sending. See [`emails/password_reset.tsx`](emails/password_reset.tsx) for the pattern.

---

## Resources

- [Introduction](https://react.email/docs/introduction)
- [Component library](https://react.email/components)
- [Template gallery](https://react.email/templates)
