import qrcode from 'qrcode-terminal'
import { createClient } from './client.js'
import { registerHandlers } from './handler.js'

const { client } = await createClient()

client.on('auth_qr', ({ qr, ttlMs }) => {
  console.log(`Scan this QR within ${ttlMs}ms:`)
  qrcode.generate(qr, { small: true })
})

client.on('auth_paired', ({ credentials }) => {
  console.log('Paired as', credentials.meJid)
})

client.on('connection', (event) => {
  console.log('connection:', event.status, event.reason ?? '')
})

registerHandlers(client)

await client.connect()
