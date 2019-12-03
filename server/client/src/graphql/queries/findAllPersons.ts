import gql from "graphql-tag"
import { PersonFragment } from "../fragments/Person"

export const findAllPersons = gql`
  query findAllPersons {
    findAllPersons {
      ...PersonFields
    }
  }

  ${PersonFragment}
`
