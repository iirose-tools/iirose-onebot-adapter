import knex, { Knex } from "knex";
import path from 'path'

export default class database {
  public db: Knex;
  private path: string

  constructor(name: string) {
    this.path = path.join(process.cwd(), `./data/iirose.${name}.db`)

    this.db = knex({
      client: 'sqlite3',
      connection: {
        filename: this.path
      }
    })

    this.init()
  }

  private async init () {
    await this.db.schema.createTableIfNotExists('users', table => {
      table.string('uid', 13).primary()
      table.string('username', 256).index()
      table.string('avatar', 256)
    })

    await this.db.schema.createTableIfNotExists('messages', table => {
      table.increments('id')
      table.string('uid', 13).index()
      table.string('username', 256)
      table.string('avatar', 256)
      table.string('message', 256)
      table.integer('timestamp')
    })
  }
}