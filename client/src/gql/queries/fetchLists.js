import gql from 'graphql-tag';

export default gql`
{
  user {
    id
    lists
      {
        id
        name
      }
    teams{
      id
      name
    }
    }
}
`;