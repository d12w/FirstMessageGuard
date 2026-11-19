# FirstMessageGuard v0.1.0

**Status: Experimental**

FirstMessageGuard displays a confirmation dialog before the first message send attempt in each channel visit.

## Included

- One confirmation prompt on the first send attempt after entering a channel.
- Confirming permits the message and suppresses further prompts until the user changes channels.
- Cancelling keeps the message draft in the composer and prompts again on the next attempt.
- Re-entering a channel starts a new visit and re-enables the prompt.
- Visit state is kept in memory only.

## Compatibility

Vencord and Equicord source builds with UserPlugins support and the required MessageEvents API.

## Known limitations

- The prompt is consumed when the send attempt is confirmed, not after server delivery.
- Only sending flows intercepted by the built-in MessageEvents API can be guarded.
- Re-test after major Discord, Vencord, or Equicord updates.
