import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.string('email').notNullable().unique()
      table.string('username').notNullable().unique()
      table.string('password').notNullable()
      table.string('avatar').defaultTo('')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
