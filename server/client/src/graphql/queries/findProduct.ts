import gql from "graphql-tag"
import { ProductFragment } from "../fragments/Product"

export const findProducts = gql`
  query findProducts($id: ID!, $name: String!, $quantity: Int!) {
    findProducts(fields: {id: $id, name: $name, quantity: $quantity}) {
      ...ProductFields
    }
  }

  ${ProductFragment}
`
