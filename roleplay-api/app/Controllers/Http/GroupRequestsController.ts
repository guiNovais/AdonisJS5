import BadRequest from 'App/Exceptions/BadRequestException'
import GroupRequest from 'App/Models/GroupRequest'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'

export default class GroupRequestsController {
  public async index({ request, response }: HttpContextContract) {
    const { master } = request.qs()

    if (!master) throw new BadRequest('master query should be provided', 422)

    const groupRequests = await GroupRequest.query()
      .select('id', 'userId', 'groupId', 'status')
      .preload('group', (query) => {
        query.select('name', 'master')
      })
      .preload('user', (query) => {
        query.select('username')
      })
      .whereHas('group', (query) => {
        query.where('master', master)
      })
      .where('status', 'PENDING')
    return response.ok({ groupRequests })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const groupId = request.param('groupId') as number
    const userId = auth.user!.id

    const existingGroupRequest = await GroupRequest.query()
      .where('groupId', groupId)
      .andWhere('userId', userId)
      .first()

    if (existingGroupRequest) throw new BadRequest('group request already exists', 409)

    const userAlreadyInGroup = await Group.query()
      .whereHas('players', (query) => {
        query.where('id', userId)
      })
      .andWhere('id', groupId)
      .first()

    if (userAlreadyInGroup) throw new BadRequest('user is already in the group', 422)

    const groupRequest = await GroupRequest.create({ groupId, userId })
    await groupRequest.refresh()
    return response.created({ groupRequest })
  }

  public async accept({ request, response, bouncer }: HttpContextContract) {
    const groupId = request.param('groupId')
    const requestId = request.param('requestId')

    const groupRequest = await GroupRequest.query()
      .where('id', requestId)
      .andWhere('groupId', groupId)
      .firstOrFail()
    await groupRequest.load('group')
    await bouncer.authorize('acceptGroupRequest', groupRequest)

    const updatedGroupRequest = await groupRequest.merge({ status: 'ACCEPTED' }).save()

    await groupRequest.load('group')
    await groupRequest.group.related('players').attach([groupRequest.userId])

    return response.ok({ groupRequest: updatedGroupRequest })
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const groupId = request.param('groupId')
    const requestId = request.param('requestId')

    const groupRequest = await GroupRequest.query()
      .where('id', requestId)
      .andWhere('groupId', groupId)
      .firstOrFail()
    await groupRequest.load('group')
    await bouncer.authorize('rejectGroupRequest', groupRequest)

    await groupRequest.delete()
    return response.ok({})
  }
}
