import { GraphQLContext } from '../../context'

export const productResolvers = {
  Product: {
    shop: async (parent: any, _: any, context: GraphQLContext) => {
      const result = await context.db.select().from('shop').where('id', '=', parent.shopId)
      return result[0]
    }
  },

  Query: {
    findProducts: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('product').where(args.fields)
    },
    findAllProducts: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('product')
    }
  },

  Mutation: {
    createProduct: async (_: any, args: any, context: GraphQLContext) => {
      const [ id ] = await context.db('product').insert(args.input).returning('id')
      const result = await context.db.select().from('product').where('id', '=', id)
      return result[0]
    },
    updateProduct: (_: any, args: any, context: GraphQLContext) => {
      return context.db('product').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('product').where('id', '=' , args.id);
        return result[0]
    })}
  }
}
