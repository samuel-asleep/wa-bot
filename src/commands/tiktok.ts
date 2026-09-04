import type { WaClient, WaIncomingMessageEvent } from 'zapo-js'
import { fetchTikTok, streamTikTokVideo } from '../lib/tiktok.js'
import { react, clearReaction } from '../lib/react.js'

export async function tiktokCommand(client: WaClient, event: WaIncomingMessageEvent, args: string[]) {
  const jid = event.key.remoteJid!
  const url = args[0]

  if (!url) {
    await client.message.send(jid, 'Usage: !tiktok <url>', { quote: event })
    return
  }

  await react(client, event, '⏳')

  try {
    const info = await fetchTikTok(url)
    const stream = await streamTikTokVideo(info.videoUrl)
    const caption = [`@${info.author}`, info.title].filter(Boolean).join('\n')

    await client.message.send(jid, {
      type: 'video',
      media: stream,
      mimetype: 'video/mp4',
      caption
    })

    await clearReaction(client, event)
  } catch (err) {
    await react(client, event, '❌')
    throw err
  }
}
