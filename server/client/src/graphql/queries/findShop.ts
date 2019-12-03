import gql from "graphql-tag"
import { ShopFragment } from "../fragments/Shop"

export const findShops = gql`
  query findShops($id: ID!, $name: String!) {
    findShops(fields: {id: $id, name: $name}) {
      ...ShopFields
    }
  }

  ${ShopFragment}
`
