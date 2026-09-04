import type { WaClient, WaIncomingMessageEvent } from 'zapo-js'

export async function react(client: WaClient, event: WaIncomingMessageEvent, emoji: string) {
  const jid = event.key.remoteJid!
  await client.message.send(jid, { type: 'reaction', emoji, target: event })
}

export async function clearReaction(client: WaClient, event: WaIncomingMessageEvent) {
  await react(client, event, '')
}
