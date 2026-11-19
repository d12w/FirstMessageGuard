# FirstMessageGuard

A Vencord / Equicord user plugin that asks for confirmation before your first message in each channel visit.

## Security & Privacy

**Security confirmation:** The plugin source contains no outbound network requests, telemetry, analytics, or remote-service integrations. It does not collect or persist message content. It keeps only the active channel and current-visit confirmation state in memory, and uses the client’s built-in message-event and confirmation-modal APIs.

This describes the plugin’s own code; it is not a blanket security guarantee for Discord, Vencord, Equicord, or other installed plugins. Always review and install source you trust.

## How It Works

- The first time you try to send a message after entering a channel, an English confirmation dialog appears.
- **Send message** allows the pending message to continue. No more warnings appear in that channel until you leave it.
- **Go back**, Escape, or closing the dialog cancels that send attempt. Your draft remains in the composer, and the next attempt asks again.
- Switching to another channel starts a new visit. Returning to a previously visited channel also starts a new visit, so the warning appears again on your next send attempt.
- If you switch channels while the confirmation dialog is open, the pending send is cancelled to prevent sending from a stale channel visit.
- The visit state is memory-only and resets when the plugin is stopped or the client reloads.

## Installation

**Already built Vencord or Equicord from source?** You only need the plugin folder:

1. Download this repository as a ZIP and extract it.
2. Move the inner **`firstMessageGuard`** folder into your source directory’s **`src/userplugins/`** folder. Do not move individual files separately.
3. Rebuild or restart your source client, then enable **FirstMessageGuard** in **Settings → Plugins**.

The plugin depends on the built-in **`MessageEventsAPI`**. The client enables this dependency automatically when FirstMessageGuard is enabled.

## Compatibility

For Vencord and Equicord source builds with UserPlugins support and the `MessageEventsAPI` / `CHANNEL_SELECT` APIs. UserPlugins are not installed into ordinary prebuilt clients using the regular plugin list.

## Notes

- Confirmation is consumed when you confirm the send attempt, not when Discord confirms server delivery. A later network failure does not automatically restore the warning during that visit.
- Only send paths that pass through the client’s `MessageEventsAPI` pre-send hook can be intercepted.
- If the confirmation dialog cannot be opened, the plugin fails open so normal sending is not blocked.
- Re-test after major Discord, Vencord, or Equicord updates.
