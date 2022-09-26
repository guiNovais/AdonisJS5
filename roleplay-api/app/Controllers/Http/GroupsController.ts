import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'

export default class GroupsController {
  public async store({ request, response }: HttpContextContract) {
    const payload = request.all()
    const group = await Group.create(payload)
    return response.created({ group })
  }
}
