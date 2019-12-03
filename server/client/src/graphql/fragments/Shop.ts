import gql from "graphql-tag"

export const ShopFragment = gql`
  fragment ShopFields on Shop {
    id
    name
  }
`
