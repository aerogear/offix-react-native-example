import gql from 'graphql-tag';

const shopsQuery = gql`
  query {
    findAllShops{
      id
      name
    }
  }
`;

const addShopMutation = gql`
  mutation createShop($name: String!) {
    createShop(input: { name: $name }) {
      id
      name
    }
  }
`;

export {
    shopsQuery,
    addShopMutation
}