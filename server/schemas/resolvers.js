const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("thoughts");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    removeBook: async (parent, { bookId, username }) => {
      if (bookId && username) {
        return User.findOneAndUpdate(
          { username: username },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (
      parent,
      { input: { authors, description, bookId, image, link, title }, username }
    ) => {
      const newBook = {
        authors: [],
        description: description,
        bookId: bookId,
        image: image,
        link: link,
        title: title,
      };
      authors.forEach((element) => {
        newBook.authors.push(element);
      });

      if (bookId && username) {
        return User.findOneAndUpdate(
          { username: username },
          { $addToSet: { savedBooks: newBook } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
