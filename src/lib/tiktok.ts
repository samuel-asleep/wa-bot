import { Readable } from 'node:stream'

interface TikTokResult {
  videoUrl: string
  author: string
  title: string
}

export async function fetchTikTok(url: string): Promise<TikTokResult> {
  const params = new URLSearchParams({ id: url, locale: 'en', tt: '' })

  const res = await fetch('https://ssstik.io/abc?url=dl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
      Referer: 'https://ssstik.io/',
      Origin: 'https://ssstik.io'
    },
    body: params.toString()
  })

  if (!res.ok) throw new Error(`ssstik responded ${res.status}`)

  const html = await res.text()

  // "Without watermark" button (non-HD) has a direct href
  const videoMatch = html.match(/class="[^"]*without_watermark[^"]*"[^>]*href="(https:\/\/tikcdn\.io\/ssstik\/\d[^"]+)"/)
    ?? html.match(/href="(https:\/\/tikcdn\.io\/ssstik\/\d[^"]+)"/)
  if (!videoMatch) throw new Error('Could not parse video URL from response')

  // <h2> inside avatarAndTextUsual = username
  const authorMatch = html.match(/<h2>([^<]+)<\/h2>/)
  // class="maintext" = video description / caption
  const captionMatch = html.match(/class="maintext">([^<]+)</)

  return {
    videoUrl: videoMatch[1],
    author: authorMatch?.[1]?.trim() ?? 'unknown',
    title: captionMatch?.[1]?.trim() ?? ''
  }
}

export async function streamTikTokVideo(videoUrl: string): Promise<Readable> {
  const res = await fetch(videoUrl, {
    headers: {
      Referer: 'https://ssstik.io/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36'
    }
  })

  if (!res.ok || !res.body) throw new Error(`Video fetch failed: ${res.status}`)

  return Readable.fromWeb(res.body as import('node:stream/web').ReadableStream)
}
