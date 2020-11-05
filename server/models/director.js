const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const directorSchema = new Schema({
  name: String,
  age: String,
});

module.exports = mongoose.model('Director', directorSchema, 'director');