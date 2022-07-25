import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { QUERY_USER } from "../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { removeBookId } from "../utils/localStorage";
import Auth from "../utils/auth";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;
  const { loading, data } = useQuery(QUERY_USER, {
    variables: {
      username: Auth.getProfile().data.username,
    },
  });

  useEffect(() => {
    const user = data?.user || {};
    setUserData(user);
  }, [loading]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const updatedUser = await removeBook({
        variables: {
          bookId: bookId,
          username: Auth.getProfile().data.username,
        },
      });
      setUserData({});
      setUserData(updatedUser);
      removeBookId(bookId);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
