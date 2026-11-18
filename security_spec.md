# Security Specification & Red Team Audit (Firestore Rules - Password Capability Model)

## 1. Data Invariants
- No collection permits unauthenticated scraping: `allow list: if false;` is strictly enforced on `/system`, `/teacherAccess`, `/workspaces`, and `/publicFeedbacks`.
- Student records reside inside `/workspaces/{workspaceKey}/students/{studentId}`, where `{workspaceKey}` is a 256-bit (64-hex-char) random capability key stored only in `/teacherAccess/{teacherHash}` (which is keyed by the SHA-256 digest of the trainer's password).
- Students query `/publicFeedbacks/{accessHash}` directly via `get` using the SHA-256 digest of their individual password; they can never list `/publicFeedbacks` or access `/workspaces`.
- Every document write enforces strict `keys().hasAll(...)` + `keys().hasOnly(...)`, strict string length bounds, bounded `criterios` array (`size() <= 6`), immutable `workspaceKey` and `createdAt`, `request.time` timestamps, and atomic dual-write verification via `existsAfter()`.
- `/system/init` can only be created once (`!exists(/databases/.../system/init)`) and can never be overwritten or deleted, preventing anyone from resetting the trainer password after bootstrap.

## 2. "Dirty Dozen" Adversarial Payloads
1. Blanket `list` on `/publicFeedbacks` -> **PERMISSION_DENIED**
2. Blanket `list` on `/teacherAccess` -> **PERMISSION_DENIED**
3. Blanket `list` on `/workspaces` -> **PERMISSION_DENIED**
4. `get` on `/publicFeedbacks/short-id` (non-64-hex hash) -> **PERMISSION_DENIED**
5. Overwriting or deleting `/system/init` after bootstrap -> **PERMISSION_DENIED**
6. Creating `/workspaces/{invalidKey}` with non-64-hex ID -> **PERMISSION_DENIED**
7. Shadow/Ghost field injection (`{ ...validStudent, isAdmin: true }`) -> **PERMISSION_DENIED**
8. Oversized string DoS (`name` > 120 chars or `feedback` > 50,000 chars) -> **PERMISSION_DENIED**
9. Oversized `criterios` array (`criterios.size() == 10`) -> **PERMISSION_DENIED**
10. Invalid `studentId` path poisoning (`../etc/passwd` or 500-char ID) -> **PERMISSION_DENIED**
11. Client-forged timestamp (`updatedAt: "2020-01-01"`) instead of `request.time` -> **PERMISSION_DENIED**
12. Update attempting to mutate immutable `workspaceKey` or `createdAt` -> **PERMISSION_DENIED**
