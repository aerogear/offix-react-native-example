import gql from "graphql-tag"
import { ShopFragment } from "../fragments/Shop"

export const createShop = gql`
  mutation createShop($id: ID!, $name: String!) {
    createShop(input: {name: $name}) {
      ...ShopFields
    }
  }

  ${ShopFragment}
`
