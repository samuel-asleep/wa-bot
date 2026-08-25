import { createPinoLogger, createStore, WaClient } from 'zapo-js'
import { createSqliteStore } from '@zapo-js/store-sqlite'
import { wamPlugin } from '@zapo-js/wam'
import qrcode from 'qrcode-terminal'

const logger = await createPinoLogger({ level: 'info', pretty: true })

const store = createStore({
  backends: {
    sqlite: createSqliteStore({ path: '.auth/state.sqlite', driver: 'auto' })
  },
  providers: {
    auth: 'sqlite',
    signal: 'sqlite',
    preKey: 'sqlite',
    session: 'sqlite',
    identity: 'sqlite',
    senderKey: 'sqlite',
    appState: 'sqlite',
    privacyToken: 'sqlite',
    messages: 'sqlite',
    threads: 'sqlite',
    contacts: 'sqlite'
  }
})

const client = new WaClient(
  {
    store,
    sessionId: 'default',
    deviceBrowser: 'safari',
    deviceOsDisplayName: 'Samuel',
    connectTimeoutMs: 15_000,
    nodeQueryTimeoutMs: 30_000,
    plugins: [wamPlugin({ syntheticUi: false })]
  },
  logger
)

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

client.on('message', async (event) => {
  if (event.key.fromMe) return

  const text =
    event.message?.conversation ??
    event.message?.extendedTextMessage?.text

  if (!text) return

  const normalized = text.trim().toLowerCase()
  if (normalized !== 'ping') return

  await client.message.send(event.key.remoteJid!, 'pong')
})

await client.connect()
