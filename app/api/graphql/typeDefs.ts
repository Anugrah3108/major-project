import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    loginUser(userCred: String!, password: String!): Boolean
    currentUser: User
  }
  type Mutation {
    createUser(
      name: String!
      email: String!
      username: String!
      password: String!
    ): User
    updateUserRole(userId: String!, role: String!): Boolean
    updateUserProfile(
      userId: String!
      name: String
      email: String
      username: String
      avatar: String
    ): Boolean
  }

  type User {
    name: String
    email: String
    username: String
    role: String
    avatar: String
  }
`;

export default typeDefs;
