import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import User from './User'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public schedule: string

  @column()
  public location: string

  @column()
  public chronic: string

  @column()
  public master: number

  @belongsTo(() => User, { foreignKey: 'id' })
  public masterUser: BelongsTo<typeof User>
}
