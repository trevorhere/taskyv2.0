import gql from 'graphql-tag';

export default gql`
{
  user {
    id
    lists
      {
        id
        name
        description
      }
    teams{
      id
      name
      description
    }
    }
}
`;