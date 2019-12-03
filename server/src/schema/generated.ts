import gql from 'graphql-tag'

export const typeDefs = gql`
  

  type Shop {
    id: ID!
    name: String!
    products: [Product!]
    customers: [Person!]
  }

  type Person {
    id: ID!
    name: String!
    shop: Shop!
  }

  type Product {
    id: ID!
    name: String!
    quantity: Int!
    shop: Shop!
  }

  input ShopInput {
    name: String!
  }

  input PersonInput {
    name: String!
    shopId: ID!
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

  input PersonFilter {
    id: ID
    name: String
    shopId: ID
  }

  input ProductFilter {
    id: ID
    name: String
    quantity: Int
    shopId: ID
  }

  type Query {
    findShops(fields: ShopFilter!): [Shop!]!
    findPersons(fields: PersonFilter!): [Person!]!
    findProducts(fields: ProductFilter!): [Product!]!
    findAllShops: [Shop!]!
    findAllPersons: [Person!]!
    findAllProducts: [Product!]!
  }

  type Mutation {
    createShop(input: ShopInput!): Shop!
    createPerson(input: PersonInput!): Person!
    createProduct(input: ProductInput!): Product!
    updateShop(id: ID!, input: ShopInput!): Shop!
    updatePerson(id: ID!, input: PersonInput!): Person!
    updateProduct(id: ID!, input: ProductInput!): Product!
  }
`
