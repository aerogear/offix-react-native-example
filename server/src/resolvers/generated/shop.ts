import { GraphQLContext } from '../../context'

export const shopResolvers = {
  Shop: {
    products: (parent: any, _: any, context: GraphQLContext) => {
      return context.db.select().from('product').where('shopId', '=', parent.id)
    },
    customers: (parent: any, _: any, context: GraphQLContext) => {
      return context.db.select().from('person').where('shopId', '=', parent.id)
    }
  },

  Query: {
    findShops: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('shop').where(args.fields)
    },
    findAllShops: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('shop')
    }
  },

  Mutation: {
    createShop: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await context.db('shop').insert(args.input).returning('id')
      const result = await context.db.select().from('shop').where('id', '=', id)
      return result[0]
    },
    updateShop: (_: any, args: any, context: GraphQLContext) => {
      return context.db('shop').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('shop').where('id', '=' , args.id);
        return result[0]
    })}
  }
}
