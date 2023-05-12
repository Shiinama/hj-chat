import SQLite from 'react-native-sqlite-storage'
import { DatabaseInitialization } from './DatabaseInitialization'
import { List } from './types'
import { ListItem } from './types'
import { DATABASE } from './Constants'
import { AppState, AppStateStatus } from 'react-native'

export interface Database {
  addMessage(text: string, list: List): Promise<void>
  getListItems(list: List, doneItemsLast: boolean): Promise<ListItem[]>
  // Update
  updateListItem(listItem: ListItem): Promise<void>
  // Delete
  deleteList(list: List): Promise<void>
}

let databaseInstance: SQLite.SQLiteDatabase | undefined

async function addMessage(message: List): Promise<void> {
  const chatSet = new Array(Object.keys(message).length).fill('?')
  const columns = Object.keys(message).join(', ')
  const values = Object.values(message)

  if (message === undefined) {
    return Promise.reject(Error(`Could not add item to undefined message.`))
  }
  return getDatabase()
    .then(db => db.executeSql(`INSERT INTO Messages (${columns}) VALUES (${chatSet});`, values))
    .then(([results]) => {
      console.log(`[db] message  created successfully with id: ${results.insertId}`)
      return results
    })
}

async function getLastMessage() {
  return getDatabase()
    .then(db => db.executeSql(`SELECT * FROM Messages;`))
    .then(([results]) => {
      console.log(results)
    })
}

async function getListItems(list: List, orderByDone = false): Promise<ListItem[]> {
  if (list === undefined) {
    return Promise.resolve([])
  }
  return getDatabase()
    .then(db =>
      db.executeSql(
        `SELECT item_id as id, text, done FROM ListItem WHERE list_id = ? ${orderByDone ? 'ORDER BY done' : ''};`,
        [list.id]
      )
    )
    .then(([results]) => {
      if (results === undefined) {
        return []
      }
      const count = results.rows.length
      const listItems: ListItem[] = []
      for (let i = 0; i < count; i++) {
        const row = results.rows.item(i)
        const { text, done: doneNumber, id } = row
        const done = doneNumber === 1 ? true : false

        console.log(`[db] List item text: ${text}, done? ${done} id: ${id}`)
        listItems.push({ id, text, done })
      }
      console.log(`[db] List items for list "${list.title}":`, listItems)
      return listItems
    })
}

async function updateListItem(listItem: ListItem): Promise<void> {
  const doneNumber = listItem.done ? 1 : 0
  return getDatabase()
    .then(db =>
      db.executeSql('UPDATE ListItem SET text = ?, done = ? WHERE item_id = ?;', [
        listItem.text,
        doneNumber,
        listItem.id,
      ])
    )
    .then(([results]) => {
      console.log(`[db] List item with id: ${listItem.id} updated.`)
    })
}

async function deleteList(list: List): Promise<void> {
  console.log(`[db] Deleting list titled: "${list.title}" with id: ${list.id}`)
  return getDatabase()
    .then(db => {
      // Delete list items first, then delete the list itself
      return db.executeSql('DELETE FROM ListItem WHERE list_id = ?;', [list.id]).then(() => db)
    })
    .then(db => db.executeSql('DELETE FROM List WHERE list_id = ?;', [list.id]))
    .then(() => {
      console.log(`[db] Deleted list titled: "${list.title}"!`)
    })
}

// "Private" helpers

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databaseInstance !== undefined) {
    return Promise.resolve(databaseInstance)
  }
  // otherwise: open the database first
  return open()
}

// Open a connection to the database
async function open(): Promise<SQLite.SQLiteDatabase> {
  SQLite.DEBUG(true)
  SQLite.enablePromise(true)

  if (databaseInstance) {
    console.log('[db] Database is already open: returning the existing instance')
    return databaseInstance
  }

  // Otherwise, create a new instance
  const db = await SQLite.openDatabase({
    name: DATABASE.FILE_NAME,
    location: 'default',
  })
  console.log('[db] Database open!')

  // Perform any database initialization or updates, if needed
  const databaseInitialization = new DatabaseInitialization()
  await databaseInitialization.updateDatabaseTables(db)

  databaseInstance = db
  return db
}

// Close the connection to the database
async function close(): Promise<void> {
  if (databaseInstance === undefined) {
    console.log("[db] No need to close DB again - it's already closed")
    return
  }
  const status = await databaseInstance.close()
  console.log('[db] Database closed.')
  databaseInstance = undefined
}

// Listen to app state changes. Close the database when the app is put into the background (or enters the "inactive" state)
let appState = 'active'
console.log('[db] Adding listener to handle app state changes')
AppState.addEventListener('change', handleAppStateChange)

// Handle the app going from foreground to background, and vice versa.
function handleAppStateChange(nextAppState: AppStateStatus) {
  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    // App has moved from the foreground into the background (or become inactive)
    console.log('[db] App has gone to the background - closing DB connection.')
    close()
  }
  appState = nextAppState
}

// Export the functions which fulfill the Database interface contract
export const sqliteDatabase: Database = {
  addMessage,
  getLastMessage,
  getListItems,
  updateListItem,
  deleteList,
}
