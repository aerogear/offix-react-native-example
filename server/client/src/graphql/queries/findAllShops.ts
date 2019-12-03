import gql from "graphql-tag"
import { ShopFragment } from "../fragments/Shop"

export const findAllShops = gql`
  query findAllShops {
    findAllShops {
      ...ShopFields
    }
  }

  ${ShopFragment}
`
