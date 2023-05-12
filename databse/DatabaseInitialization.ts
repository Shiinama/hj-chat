import SQLite from 'react-native-sqlite-storage'

export class DatabaseInitialization {
  // Perform any updates to the database schema. These can occur during initial configuration, or after an app store update.
  // This should be called each time the database is opened.
  public updateDatabaseTables(database: SQLite.SQLiteDatabase): Promise<void> {
    let dbVersion: number = 0
    console.log('Beginning database updates...')

    // First: create tables if they do not already exist
    return database
      .transaction(this.createTables)
      .then(() => {
        // Get the current database version
        return this.getDatabaseVersion(database)
      })
      .then(version => {
        dbVersion = version
        console.log('Current database version is: ' + dbVersion)

        // Perform DB updates based on this version

        // This is included as an example of how you make database schema changes once the app has been shipped
        if (dbVersion < 1) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion1Inserts);
        }
        // otherwise,
        return
      })
      .then(() => {
        if (dbVersion < 2) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion2Inserts);
        }
        // otherwise,
        return
      })
  }

  // Perform initial setup of the database tables
  private createTables(transaction: SQLite.Transaction) {
    // DANGER! For dev only
    const dropAllTables = false
    if (dropAllTables) {
      transaction.executeSql('DROP TABLE IF EXISTS List;')
      transaction.executeSql('DROP TABLE IF EXISTS ListItem;')
      transaction.executeSql('DROP TABLE IF EXISTS Version;')
    }

    transaction.executeSql(`
      CREATE TABLE IF NOT EXISTS Messages(
        id INTEGER PRIMARY KEY NOT NULL,
        uid TEXT,
        userId INTEGER,
        userUid TEXT,
        status TEXT,
        type TEXT,
        replyUid TEXT,
        text TEXT,
        translation TEXT,
        voiceUrl TEXT,
        botId INTEGER,
        content TEXT,
        createdDate TEXT,
        updatedDate TEXT,
        botUid TEXT
      );
    `)

    // Version table
    transaction.executeSql(`
      CREATE TABLE IF NOT EXISTS Version(
        version_id INTEGER PRIMARY KEY NOT NULL,
        version INTEGER
      );
    `)
  }

  // Get the version of the database, as specified in the Version table
  private getDatabaseVersion(database: SQLite.SQLiteDatabase): Promise<number> {
    // Select the highest version number from the version table
    return database
      .executeSql('SELECT version FROM Version ORDER BY version DESC LIMIT 1;')
      .then(([results]) => {
        if (results.rows && results.rows.length > 0) {
          const version = results.rows.item(0).version
          return version
        } else {
          return 0
        }
      })
      .catch(error => {
        console.log(`No version set. Returning 0. Details: ${error}`)
        return 0
      })
  }
}
