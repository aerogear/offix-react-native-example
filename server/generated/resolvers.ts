import { GraphQLContext } from '../src/context'
  
enum Subscriptions {
  NEW_SHOP = 'newshop',
  UPDATED_SHOP = 'updatedshop',
  DELETED_SHOP = 'deletedshop',
  NEW_CUSTOMER = 'newcustomer',
  UPDATED_CUSTOMER = 'updatedcustomer',
  DELETED_CUSTOMER = 'deletedcustomer',
  NEW_PRODUCT = 'newproduct',
  UPDATED_PRODUCT = 'updatedproduct',
  DELETED_PRODUCT = 'deletedproduct'
}

export const resolvers = {
  Shop: {
    product: (parent: any, _: any, context: GraphQLContext) => {
      return context.db.select().from('product').where('shopId', '=', parent.id)
    }
  },

  Query: {
    findShops: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('shop').where(args.fields)
    },
    findCustomers: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('customer').where(args.fields)
    },
    findProducts: (_: any, args: any, context: GraphQLContext) => {
      return context.db.select().from('product').where(args.fields)
    },
    findAllShops: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('shop')
    },
    findAllCustomers: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('customer')
    },
    findAllProducts: (_: any, __: any, context: GraphQLContext) => {
      return context.db.select().from('product')
    }
  },

  Mutation: {
    createShop: async (_: any, args: any, context: GraphQLContext) => {
      const result = await context.db('shop').insert(args.input).returning('*')
      context.pubsub.publish(Subscriptions.NEW_SHOP, {
        newShop: result[0]
      })
      return result[0]
    },
    createCustomer: async (_: any, args: any, context: GraphQLContext) => {
      const result = await context.db('customer').insert(args.input).returning('*')
      context.pubsub.publish(Subscriptions.NEW_CUSTOMER, {
        newCustomer: result[0]
      })
      return result[0]
    },
    createProduct: async (_: any, args: any, context: GraphQLContext) => {
      const result = await context.db('product').insert(args.input).returning('*')
      context.pubsub.publish(Subscriptions.NEW_PRODUCT, {
        newProduct: result[0]
      })
      return result[0]
    },
    updateShop: (_: any, args: any, context: GraphQLContext) => {
      return context.db('shop').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('shop').where('id', '=' , args.id);
        context.pubsub.publish(Subscriptions.UPDATED_SHOP, {
          updatedShop: result[0]
        })
        return result[0]
    })},
    updateCustomer: (_: any, args: any, context: GraphQLContext) => {
      return context.db('customer').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('customer').where('id', '=' , args.id);
        context.pubsub.publish(Subscriptions.UPDATED_CUSTOMER, {
          updatedCustomer: result[0]
        })
        return result[0]
    })},
    updateProduct: (_: any, args: any, context: GraphQLContext) => {
      return context.db('product').where('id', '=' , args.id).update(args.input).then( async () => {
        const result = await context.db.select().from('product').where('id', '=' , args.id);
        context.pubsub.publish(Subscriptions.UPDATED_PRODUCT, {
          updatedProduct: result[0]
        })
        return result[0]
    })},
    deleteShop: (_: any, args: any, context: GraphQLContext) => {
      return context.db('shop').where('id', '=' , args.id).del().then( () => {
        context.pubsub.publish(Subscriptions.DELETED_SHOP, {
          deletedShop: args.id
        })
        return args.id;
    })},
    deleteCustomer: (_: any, args: any, context: GraphQLContext) => {
      return context.db('customer').where('id', '=' , args.id).del().then( () => {
        context.pubsub.publish(Subscriptions.DELETED_CUSTOMER, {
          deletedCustomer: args.id
        })
        return args.id;
    })},
    deleteProduct: (_: any, args: any, context: GraphQLContext) => {
      return context.db('product').where('id', '=' , args.id).del().then( () => {
        context.pubsub.publish(Subscriptions.DELETED_PRODUCT, {
          deletedProduct: args.id
        })
        return args.id;
    })}
  },

  Subscription: {
    newShop: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.NEW_SHOP)
      }
    },
    newCustomer: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.NEW_CUSTOMER)
      }
    },
    newProduct: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.NEW_PRODUCT)
      }
    },
    updatedShop: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.UPDATED_SHOP)
      }
    },
    updatedCustomer: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.UPDATED_CUSTOMER)
      }
    },
    updatedProduct: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.UPDATED_PRODUCT)
      }
    },
    deletedShop: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.DELETED_SHOP)
      }
    },
    deletedCustomer: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.DELETED_CUSTOMER)
      }
    },
    deletedProduct: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator(Subscriptions.DELETED_PRODUCT)
      }
    }
  }
}
