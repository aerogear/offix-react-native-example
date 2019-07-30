import gql from 'graphql-tag'

export const typeDefs = gql`
  type Shop {
    id: ID!
    name: String!
    product: [Product!]
  }

  type Customer {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
    quantity: Int!
    shopId: ID!
  }

  input ShopInput {
    name: String!
  }

  input CustomerInput {
    name: String!
  }

  input ProductInput {
    name: String!
    quantity: Int!
    shopId: ID!
  }

  input ShopFilter {
    id: ID
    name: String
  }

  input CustomerFilter {
    id: ID
    name: String
  }

  input ProductFilter {
    id: ID
    name: String
    quantity: Int
    shopId: ID
  }

  type Query {
    findShops(fields: ShopFilter!): [Shop!]!
    findCustomers(fields: CustomerFilter!): [Customer!]!
    findProducts(fields: ProductFilter!): [Product!]!
    findAllShops: [Shop!]!
    findAllCustomers: [Customer!]!
    findAllProducts: [Product!]!
  }

  type Mutation {
    createShop(input: ShopInput!): Shop!
    createCustomer(input: CustomerInput!): Customer!
    createProduct(input: ProductInput!): Product!
    updateShop(id: ID!, input: ShopInput!): Shop!
    updateCustomer(id: ID!, input: CustomerInput!): Customer!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteShop(id: ID!): ID!
    deleteCustomer(id: ID!): ID!
    deleteProduct(id: ID!): ID!
  }

  type Subscription {
    newShop: Shop!
    newCustomer: Customer!
    newProduct: Product!
    updatedShop: Shop!
    updatedCustomer: Customer!
    updatedProduct: Product!
    deletedShop: ID!
    deletedCustomer: ID!
    deletedProduct: ID!
  }
`
