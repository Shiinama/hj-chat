import React from 'react'
import * as SQLite from 'expo-sqlite'
const DB_NAME = 'db.myshell'

const db = SQLite.openDatabase(DB_NAME)

type Data = {
  id: number
  name: string
  age: number
}

type InsertDataFn = (tableName: string, data: Partial<Data>) => Promise<SQLite.SQLResultSet>
type UpdateDataFn = (tableName: string, data: Partial<Data>, id: number) => Promise<SQLite.SQLResultSet>
type DeleteDataFn = (tableName: string, id: number) => Promise<SQLite.SQLResultSet>
type ClearTableFn = (tableName: string) => Promise<SQLite.SQLResultSet>

export const useInsertData = (): InsertDataFn => {
  const insert: InsertDataFn = (tableName, data) => {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(', ')
      const values = Object.values(data)
        .map(val => `"${val}"`)
        .join(', ')

      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ${tableName} (${columns}) VALUES (${values})`,
          [],
          (_, result) => resolve(result),
          (_, error) => reject(error) as any
        )
      })
    })
  }

  return insert
}

export const useUpdateData = (): UpdateDataFn => {
  const update: UpdateDataFn = (tableName, data, id) => {
    return new Promise((resolve, reject) => {
      const columns = Object.entries(data)
        .map(([key, value]) => `${key}="${value}"`)
        .join(', ')

      db.transaction(tx => {
        tx.executeSql(
          `UPDATE ${tableName} SET ${columns} WHERE id=${id}`,
          [],
          (_, result) => resolve(result),
          (_, error) => reject(error) as any
        )
      })
    })
  }

  return update
}

export const useDeleteData = (): DeleteDataFn => {
  const remove: DeleteDataFn = (tableName, id) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${tableName} WHERE id=${id}`,
          [],
          (_, result) => resolve(result),
          (_, error) => reject(error) as any
        )
      })
    })
  }

  return remove
}

export const useClearTable = (): ClearTableFn => {
  const clear: ClearTableFn = tableName => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${tableName}`,
          [],
          (_, result) => resolve(result),
          (_, error) => reject(error) as any
        )
      })
    })
  }

  return clear
}
