const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  input AddBookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: AddBookInput!, username: String!): User
    removeBook(bookId: String!, username: String!): User
  }
`;

module.exports = typeDefs;
