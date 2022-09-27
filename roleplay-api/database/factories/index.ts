import Factory from '@ioc:Adonis/Lucid/Factory'
import Group from 'App/Models/Group'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.internet.url(),
  }
}).build()

export const GroupFactory = Factory.define(Group, ({ faker }) => {
  return {
    name: faker.name.findName(),
    description: faker.lorem.text(),
    schedule: faker.lorem.text(),
    location: faker.address.street(),
    chronic: faker.lorem.paragraph(),
  }
}).build()
