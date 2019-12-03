import gql from "graphql-tag"
import { ProductFragment } from "../fragments/Product"

export const updateProduct = gql`
  mutation updateProduct($id: ID!, $name: String!, $quantity: Int!) {
    updateProduct(id: $id, input: {name: $name, quantity: $quantity}) {
      ...ProductFields
    }
  }

  ${ProductFragment}
`
