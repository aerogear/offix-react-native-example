import gql from "graphql-tag"

export const PersonFragment = gql`
  fragment PersonFields on Person {
    id
    name
  }
`
