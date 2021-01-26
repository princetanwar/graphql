const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
mongoose.connect("mongodb://localhost:27017/fullstack", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to db"));

app.use(cors());
app.use(morgan("dev"));

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(4000, () => console.log("app is now listening on port 4000"));
