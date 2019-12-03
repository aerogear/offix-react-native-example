import gql from "graphql-tag"
import { ProductFragment } from "../fragments/Product"

export const createProduct = gql`
  mutation createProduct($id: ID!, $name: String!, $quantity: Int!) {
    createProduct(input: {name: $name, quantity: $quantity}) {
      ...ProductFields
    }
  }

  ${ProductFragment}
`
