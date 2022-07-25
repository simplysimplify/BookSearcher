import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: AddBookInput!, $username: String!) {
    saveBook(input: $input, username: $username) {
      _id
      username
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!, $username: String!) {
    removeBook(bookId: $bookId, username: $username) {
      _id
      username
    }
  }
`;
