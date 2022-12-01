import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'groups_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table
        .integer('group_id')
        .unsigned()
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE')
        .notNullable()
      table.enum('status', ['PENDING', 'ACCEPTED']).defaultTo('PENDING').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
