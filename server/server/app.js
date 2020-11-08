const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')
const Movies = require('../models/movie');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://admin1:admin1@graphql-tutorial.fknxc.mongodb.net/graphQLDB?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, () => {
  console.log('Connected to DB')
},
);

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
});