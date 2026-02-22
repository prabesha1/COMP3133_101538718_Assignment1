require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const connectDB = require("./config/db");
const schema = require("./graphql/schema");
const root = require("./graphql/resolvers");
const { getUserFromToken } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(
  "/graphql",
  (req, res, next) => {
    // attach user to request (if token is provided)
    req.user = getUserFromToken(req);
    next();
  },
  graphqlHTTP((req) => ({
    schema,
    rootValue: root,
    graphiql: true, // browser testing UI
    context: { req },
    customFormatErrorFn: (err) => ({
      message: err.message,
    }),
  }))
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
