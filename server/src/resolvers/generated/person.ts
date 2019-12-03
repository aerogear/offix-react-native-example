import { GraphQLContext } from '../../context'

export const personResolvers = {
  Person: {
    shop: async (parent: any, _: any, context: GraphQLContext) => {
      const result = await context.db.select().from('shop').where('id', '=', parent.shopId)
      return result[0]
    }
  },

  Query: {
    findPersons: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('person').where(args.fields)
    },
    findAllPersons: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('person')
    }
  },

  Mutation: {
    createPerson: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await context.db('person').insert(args.input).returning('id')
      const result = await context.db.select().from('person').where('id', '=', id)
      return result[0]
    },
    updatePerson: (_: any, args: any, context: GraphQLContext) => {
      return context.db('person').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('person').where('id', '=' , args.id);
        return result[0]
    })}
  }
}
