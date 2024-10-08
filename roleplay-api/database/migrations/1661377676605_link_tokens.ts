import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'link_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('token', 255).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
