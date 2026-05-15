import { faker } from '@faker-js/faker'
import type { User } from '../schema'

faker.seed(67890)

/** 对标 react-template/features/users/data/users.ts（本地演示条数为 50） */
export function buildInitialUsers(): User[] {
  return Array.from({ length: 50 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      username: faker.internet
        .username({ firstName, lastName })
        .toLocaleLowerCase(),
      email: faker.internet.email({ firstName }).toLocaleLowerCase(),
      phoneNumber: faker.phone.number({ style: 'international' }),
      status: faker.helpers.arrayElement([
        'active',
        'inactive',
        'invited',
        'suspended',
      ]) as User['status'],
      role: faker.helpers.arrayElement([
        'superadmin',
        'admin',
        'cashier',
        'manager',
      ]) as User['role'],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }
  })
}

export const INITIAL_USERS = buildInitialUsers()
