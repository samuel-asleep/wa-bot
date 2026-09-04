import type { WaClient, WaIncomingMessageEvent } from 'zapo-js'
import { getCommand } from './commands/index.js'
import { react } from './lib/react.js'

function extractText(event: WaIncomingMessageEvent): string | undefined {
  return (
    event.message?.conversation ??
    event.message?.extendedTextMessage?.text ??
    undefined
  )
}

export function registerHandlers(client: WaClient) {
  client.on('message', async (event) => {
    const text = extractText(event)?.trim()
    if (!text?.startsWith('!')) return

    const [rawName, ...args] = text.slice(1).split(/\s+/)
    const cmd = getCommand(rawName)

    if (!cmd) return

    try {
      await cmd(client, event, args)
    } catch (err) {
      await react(client, event, '❌')
      console.error(`[${rawName}]`, err)
    }
  })
}
