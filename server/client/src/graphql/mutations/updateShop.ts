import gql from "graphql-tag"
import { ShopFragment } from "../fragments/Shop"

export const updateShop = gql`
  mutation updateShop($id: ID!, $name: String!) {
    updateShop(id: $id, input: {name: $name}) {
      ...ShopFields
    }
  }

  ${ShopFragment}
`
