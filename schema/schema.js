const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");
const BookModal = require("../model/book");
const AuthorModal = require("../model/author");

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return authors.find((author) => author.id === parent.authorId);
        // console.log(parent);
        return AuthorModal.findById(parent.author);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books.filter((ele) => ele.authorId === parent.id);

        console.log("fs", parent);
        return BookModal.find({ author: parent._id }).then((res) => res);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return books.find((ele) => ele.id === args.id);
        return BookModal.findById(args.id).then((res) => res);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return authors.find((ele) => ele.id === args.id);
        return AuthorModal.findById(args.id).then((res) => res);
      },
    },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return BookModal.find({}).then((res) => res);
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve(parent, args) {
        return AuthorModal.find({}).then((res) => res);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new AuthorModal({ name: args.name, age: args.age });

        return author.save().then((res) => res);
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new BookModal({
          name: args.name,
          genre: args.genre,
          author: args.author,
        });
        return book.save();
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type: GraphQLID },
      },
      resolve(parent, args) {
        let update = {};
        args.name ? (update.name = args.name) : null;
        args.genre ? (update.genre = args.genre) : null;
        args.author ? (update.author = args.author) : null;

        return BookModal.findOneAndUpdate({ _id: args.id }, update, {
          new: true,
        }).then((res) => res);
      },
    },
    deleteBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return BookModal.findByIdAndDelete(args.id).then((res) => res);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
