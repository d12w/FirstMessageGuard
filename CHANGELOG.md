# Changelog

## 0.1.0 - Experimental

- Initial FirstMessageGuard implementation.
- Adds a confirmation before the first message attempt in each channel visit.
- Resets the confirmation state when the selected channel changes.
- Keeps cancelled message drafts through the built-in MessageEvents API cancellation path.
