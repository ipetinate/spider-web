import { IoCContainer } from '@/container'
import { DecoratorProperties } from '@/models/decorators'

export function Resolver(
  { scope }: DecoratorProperties = { scope: 'singleton' }
): ClassDecorator {
  return (target) => {
    const serviceKey = Symbol(target.name)

    Reflect.defineMetadata('serviceKey', serviceKey, target)
    Reflect.defineMetadata('serviceScope', scope, target)

    IoCContainer.register(target, scope)

    Reflect.defineMetadata('graphql:queries', getQueryMethods(target), target)
    Reflect.defineMetadata(
      'graphql:mutations',
      getMutationMethods(target),
      target
    )
  }
}

function getQueryMethods(target: any): any[] {
  const queryMethods = Object.getOwnPropertyNames(target.prototype)
    .filter((method) => method.startsWith('get') || method === 'find')
    .map((method) => ({
      name: method,
      method: target.prototype[method]
    }))

  return queryMethods
}

function getMutationMethods(target: any): any[] {
  const mutationMethods = Object.getOwnPropertyNames(target.prototype)
    .filter(
      (method) => method.startsWith('create') || method.startsWith('update')
    )
    .map((method) => ({
      name: method,
      method: target.prototype[method]
    }))

  return mutationMethods
}