import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import CreateGroup from 'App/Validators/CreateGroupValidator'

export default class GroupsController {
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateGroup)
    const group = await Group.create(payload)
    await group.related('players').attach([payload.master])
    await group.load('players')
    return response.created({ group })
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const payload = request.all()

    const group = await Group.findOrFail(id)
    const updatedGroup = await group.merge(payload).save()
    return response.ok({ group: updatedGroup })
  }

  public async removePlayer({ request, response }: HttpContextContract) {
    const groupId = request.param('groupId') as number
    const playerId = request.param('playerId') as number

    const group = await Group.findOrFail(groupId)
    await group.related('players').detach([playerId])
    return response.ok({})
  }
}
