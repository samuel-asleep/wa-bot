import type { WaClient, WaIncomingMessageEvent } from 'zapo-js'
import { tiktokCommand } from './tiktok.js'

type CommandHandler = (client: WaClient, event: WaIncomingMessageEvent, args: string[]) => Promise<void>

const commands: Record<string, CommandHandler> = {
  tiktok: tiktokCommand
}

export function getCommand(name: string): CommandHandler | undefined {
  return commands[name.toLowerCase()]
}
