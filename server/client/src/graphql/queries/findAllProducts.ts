import gql from "graphql-tag"
import { ProductFragment } from "../fragments/Product"

export const findAllProducts = gql`
  query findAllProducts {
    findAllProducts {
      ...ProductFields
    }
  }

  ${ProductFragment}
`
