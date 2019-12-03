import gql from "graphql-tag"
import { PersonFragment } from "../fragments/Person"

export const findPersons = gql`
  query findPersons($id: ID!, $name: String!) {
    findPersons(fields: {id: $id, name: $name}) {
      ...PersonFields
    }
  }

  ${PersonFragment}
`
