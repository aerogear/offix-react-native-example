import gql from "graphql-tag"
import { PersonFragment } from "../fragments/Person"

export const createPerson = gql`
  mutation createPerson($id: ID!, $name: String!) {
    createPerson(input: {name: $name}) {
      ...PersonFields
    }
  }

  ${PersonFragment}
`
