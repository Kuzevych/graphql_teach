const e = require('express');
const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;


const Movies = require('../models/movie');
const Directors = require('../models/director');
const director = require('../models/director');
/*
// All IDs set automatically by mLab
// Don't forget to update after creation
const directorsJson = [
  { "name": "Quentin Tarantino", "age": 55 }, //5fa160b80f1acf65124ab5ff
  { "name": "Michael Radford", "age": 72 }, //5fa161100f1acf65124ab601
  { "name": "James McTeigue", "age": 51 }, //5fa1613a0f1acf65124ab602
  { "name": "Guy Ritchie", "age": 50 }, //5fa161490f1acf65124ab603
];
// directorId - it is ID from the directors collection
const moviesJson = [
  { "name": "Pulp Fiction", "genre": "Crime", "directorId":  },
  { "name": "1984", "genre": "Sci-Fi", "directorId":  },
  { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId":  },
  { "name": "Snatch", "genre": "Crime-Comedy", "directorId":  },
  { "name": "Reservoir Dogs", "genre": "Crime", "directorId":  },
  { "name": "The Hateful Eight", "genre": "Crime", "directorId":  },
  { "name": "Inglourious Basterds", "genre": "Crime", "directorId":  },
  { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId":  },
];
*/

let directors = [
    { "name": "Quentin Tarantino", "age": 55, id: "1" }, 
    { "name": "Michael Radford", "age": 72, id: "2" }, 
    { "name": "James McTeigue", "age": 51, id: "3" }, 
    { "name": "Guy Ritchie", "age": 50, id: "4" }, 
  ];

let movies = [
  { id: '1', name: "Pulp Fiction", genre: "Crime", directorId: "1" },
  { id: '2', name: "1984", genre: "Sci-Fi", directorId: "2" },
  { id: '3', name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
  { id: '4', name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
  { id: '5', name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
  { id: '6', name: "The Hateful Eight", genre: "Crime", directorId: "1" },
  { id: '7', name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
  { id: '8', name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "4" },
];



const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return directors.find(director => director.id === parent.id)
                // return Directors.findById(parent.id)
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args){
                // return Movies.findById(parent.id)
                return movies.filter(movie => movie.directorId === parent.id)
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                // const director = new Directors({
                //     name: args.name,
                //     age: args.age
                // });
                // director.save();
                const director = {
                  name: args.name,
                  age: args.age,
                  id: directors.length + 1
                };
                directors.push(director)
                return director;
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args){
                const movie = {
                     id: movies.length + 1, 
                     name: args.name, 
                     genre: args.genre, 
                     directorId: directors.length - 1
                }
                movies.push(movie);
                return movie
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: {
              id: { type: GraphQLID}
            },
            resolve: (parent, args) => {
                let index = null
                let back = {};
                directors.forEach((el,idx)=>{
                  if(el.id === args.id){
                      back = el;
                      index = idx
                  }
              })
              directors = [...directors.slice(0,index), ...directors.slice(index + 1, directors.length)]
              return back;
            },
        },
        deleteMovie: {
            type: MovieType,
            args: {
              id: { type: GraphQLID}
            },
            resolve: (parent, args) => {
                let index = null
                let back = {};
                movies.forEach((el,idx)=>{
                  if(el.id == args.id){
                      back = el;
                      index = idx
                  }
              })
                movies = [...movies.slice(0, index), ...movies.slice(index + 1, movies.length)]
              return back;
            },
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                let index = null
                directors.forEach((el,idx)=>{
                    if(el.id == args.id){
                        index = idx
                    }
                })
                directors[index] = {
                    name: args.name,
                    age: args.age
                }

                return directors[index]
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let index = null
                movies.forEach((el,idx)=>{
                    if(el.id == args.id){ 
                        index = idx
                    }
                })
                movies[index] = {
                    name: args.name,
                    genre: args.genre
                }

                return movies[index]
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return Movies.findById(args.id)
               return movies.find(el => el.id == args.id)
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return Directors.findById(args.id)
               return directors.find(el => el.id == args.id)
            },
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args){
                // return Movies.find({})
                return movies;
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args){
                // return Directors.find({})       
                return directors;
            }
        }
    },
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})