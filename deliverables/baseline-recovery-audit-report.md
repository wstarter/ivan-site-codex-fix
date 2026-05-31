# Baseline Recovery Audit Report

Audit date: 2026-05-31

Workspace audited:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix`

Scope: baseline recovery audit only. No Sprint 1 implementation, build, ZIP generation, deletion, upload, push, or commit was performed.

## 1. Current repository baseline

| Check | Result |
| --- | --- |
| Current branch | `main` |
| `package.json` React | `^19.2.0` |
| `package.json` React DOM | `^19.2.0` |
| `package-lock.json` | Not present |
| `bun.lock` | Present |
| `bun.lock` resolved React | `react@19.2.5` |
| `bun.lock` resolved React DOM | `react-dom@19.2.5` |
| WP theme version in `wordpress-theme/ivan-sedative-theme/style.css` | `1.0.0` |
| `src/wp-entry.tsx` uses `createRoot` | Yes |
| `hydrateRoot(document)` count in `src/wp-entry.tsx` | `0` |
| `src/lib/interaction-safety.ts` exists | Yes |
| Mobile menu interaction safety exists | Yes |

The current `MobileMenu.tsx` imports `unlockBodyInteraction`, locks body interaction only while open, clears locks during cleanup, clears locks on route changes, and returns `null` while closed so the full-screen menu overlay is unmounted.

The current interaction safety helper exports both `unlockBodyInteraction()` and `installInteractionSafetyNet()`. It includes the expected `pagehide`, `popstate`, `beforeunload`, and `visibilitychange` safety listeners.

The `18.3.1` text found in the current `bun.lock` belongs to indirect packages such as `react-is@18.3.1` and a Recharts dependency. It is not the application React runtime baseline.

## 2. Candidate stable artifacts

### Full source ZIP: `IJ-codex-source-files.zip`

Path:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\IJ-codex-source-files.zip`

SHA-256:

`D61C5C927524DA86A94099C40D4B71832590A5FE93FBC4CB48BC8C2D096B4327`

| Check | Result |
| --- | --- |
| Artifact type | Full source snapshot |
| Contains `package.json` | Yes |
| React | `^19.2.0` |
| React DOM | `^19.2.0` |
| Contains theme `style.css` | Yes |
| Theme version | `1.0.0` |
| Contains `src/wp-entry.tsx` | Yes |
| `hydrateRoot(document)` count | `0` |
| `createRoot` present | Yes |
| Interaction safety source exists | Yes |
| Mobile menu safety exists | Yes |

This archive is not the expected React 18 / theme `1.0.3` stable baseline.

It contains two nested ZIPs:

- `IJ-source-files.zip`
- `wordpress-theme/ivan-sedative-theme.zip`

Both nested ZIPs are byte-for-byte duplicates of the standalone ZIPs audited below.

### Full source ZIP: `IJ-source-files.zip`

Path:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\IJ-source-files.zip`

SHA-256:

`CA4EA483674F0D4CF543E8BFE6AA0E8C4B1D8F63F5887A85C0D8DFF72E5890F2`

| Check | Result |
| --- | --- |
| Artifact type | Full source snapshot |
| Contains `package.json` | Yes |
| React | `^19.2.0` |
| React DOM | `^19.2.0` |
| Contains theme `style.css` | Yes |
| Theme version | `1.0.0` |
| Contains `src/wp-entry.tsx` | Yes |
| `hydrateRoot(document)` count | `0` |
| `createRoot` present | Yes |
| Interaction safety source exists | Yes |
| Mobile menu safety exists | Yes |

This archive is also not the expected React 18 / theme `1.0.3` stable baseline.

It contains a nested `wordpress-theme/ivan-sedative-theme.zip` with the same SHA-256 as the standalone installer below.

### Installable theme ZIP: `wordpress-theme/ivan-sedative-theme.zip`

Path:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`F5CF19DFB174AE1075154301C4C5CCC66F4BAD57DF4AF9E935B1D94993EA2CAF`

| Check | Result |
| --- | --- |
| Artifact type | Built installable WordPress theme only |
| Contains `package.json` | No |
| React version from package metadata | Not available |
| React DOM version from package metadata | Not available |
| Contains theme `style.css` | Yes |
| Theme version | `1.0.0` |
| Contains `src/wp-entry.tsx` source | No |
| Manifest exists | Yes |
| Manifest entry is `src/wp-entry.tsx` | Yes |
| `hydrateRoot(document)` count in built JS | `0` |
| `createRoot` present in built JS | Yes |
| Interaction safety present in built JS | Yes |
| Mobile menu safety marker present in built JS | Yes |

This is an installable theme artifact with the interaction-lock fix, but it is theme version `1.0.0`, not `1.0.3`.

### Generated artifact directory: `dist-wp/`

| Check | Result |
| --- | --- |
| Artifact type | Generated WP app build directory |
| Manifest exists | Yes |
| Manifest entry is `src/wp-entry.tsx` | Yes |
| `hydrateRoot(document)` count in built JS | `0` |
| `createRoot` present in built JS | Yes |
| Interaction safety present in built JS | Yes |

This is generated output, not a source recovery archive.

### Generated artifact directory: `wordpress-theme/ivan-sedative-theme/`

| Check | Result |
| --- | --- |
| Artifact type | Unpacked generated WordPress theme tree |
| Theme version | `1.0.0` |
| Manifest exists | Yes |
| Manifest entry is `src/wp-entry.tsx` | Yes |
| `hydrateRoot(document)` count in built JS | `0` |
| `createRoot` present in built JS | Yes |
| Interaction safety present in built JS | Yes |

This tree mirrors the generated installer and is not a React 18 / theme `1.0.3` recovery source.

### Prior report: `deliverables/interaction-lock-fix-report.md`

The prior report was inspected. It documents the interaction-lock repair, the WordPress entry architecture, the safety helper, deferred CF7 initialization, and successful ZIP inspection. It does not provide a React `18.3.1` / theme `1.0.3` source artifact.

## 3. Best candidate source of truth

No full source version with React `18.3.1`, React DOM `18.3.1`, and WordPress theme version `1.0.3` exists inside this repository.

No built installable theme ZIP with theme version `1.0.3` exists inside this repository.

The best available recovery starting point is the current repository itself. It is a full source tree and it preserves the working interaction-lock fix, but its runtime metadata is React `^19.2.0` / React DOM `^19.2.0` and its theme header is `1.0.0`.

## 4. Recommended next action

**B) Use current repo and perform controlled baseline downgrade/recovery from React 19 to React 18.**

The recovery should be handled as a separate explicitly authorized task. It should preserve the existing interaction-lock source code, set React and React DOM to `18.3.1`, regenerate the dependency lock state, restore the WordPress theme header to `Version: 1.0.3`, build, package, and verify the final installer ZIP before Sprint 1 begins.

## 5. Audit inventory summary

The repository contains exactly three ZIP files outside `node_modules`:

- `IJ-codex-source-files.zip`
- `IJ-source-files.zip`
- `wordpress-theme/ivan-sedative-theme.zip`

Nested archive hash checks confirmed:

- `IJ-codex-source-files.zip!/IJ-source-files.zip` matches standalone `IJ-source-files.zip`.
- `IJ-codex-source-files.zip!/wordpress-theme/ivan-sedative-theme.zip` matches standalone `wordpress-theme/ivan-sedative-theme.zip`.
- `IJ-source-files.zip!/wordpress-theme/ivan-sedative-theme.zip` matches standalone `wordpress-theme/ivan-sedative-theme.zip`.

No reliable React 18 / theme `1.0.3` stable source or installer was found locally.
