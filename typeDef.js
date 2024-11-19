const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Posts {
    id: ID
    content: String
    title: String
    userId: Int
  }
  input PostsByUser {
    content: String!
    title: String!
    userId: Int!
  }
  type UP {
    id: ID
    name: String
    email: String
    posts: [Posts!]!
  }
  input UPostRegistration {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUserPosts(id: ID!): [UP!]!
  }
  type Mutation {
    loginUPosts: Posts
    insertPost(input: PostsByUser!): Posts!
    registrationUPosts(input: UPostRegistration!): [UP!]!
  }
`;
module.exports = typeDefs;
