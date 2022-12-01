import BadRequest from 'App/Exceptions/BadRequestException'
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
    const groupId = Number.parseInt(request.param('groupId'))
    const playerId = Number.parseInt(request.param('playerId'))

    const group = await Group.findOrFail(groupId)

    if (playerId === group.master) throw new BadRequest('cannot remove master from group', 400)

    await group.related('players').detach([playerId])
    return response.ok({})
  }
}
