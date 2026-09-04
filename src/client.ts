import { createPinoLogger, createStore, WaClient } from 'zapo-js'
import { createSqliteStore } from '@zapo-js/store-sqlite'

export async function createClient() {
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
      connectTimeoutMs: 15_000,
      nodeQueryTimeoutMs: 30_000,
      history: { enabled: true, requireFullSync: true }
    },
    logger
  )

  return { client, logger }
}
