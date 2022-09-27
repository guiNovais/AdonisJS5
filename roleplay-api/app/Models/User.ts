import { Group } from 'App/Models/Group'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import LinkToken from './LinkToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar: string

  @hasMany(() => LinkToken, { foreignKey: 'userId' })
  public tokens: HasMany<typeof LinkToken>

  @manyToMany(() => Group, {
    pivotTable: 'groups_users',
  })
  public players: ManyToMany<typeof Group>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}
