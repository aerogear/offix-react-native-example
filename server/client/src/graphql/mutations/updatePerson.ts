import gql from "graphql-tag"
import { PersonFragment } from "../fragments/Person"

export const updatePerson = gql`
  mutation updatePerson($id: ID!, $name: String!) {
    updatePerson(id: $id, input: {name: $name}) {
      ...PersonFields
    }
  }

  ${PersonFragment}
`
