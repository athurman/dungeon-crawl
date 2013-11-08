var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema({
  hero: String,
  numSquare: Number,
  princess: {},
  gold: {},
  dragon: {type: mongoose.Schema.Types.ObjectId, ref: 'Dragon'},
  orcs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orcs'}],
  wormholes: [Number],
  board: [Number],
  startPoint: Number,
  endPoint: Number
});

Game.pre('save', function(next){
  if(this.board.length === 0){
    this.board = _.range(this.numSquare);
    this.startPoint = _.sample(this.board);
    this.endPoint = _.sample(this.board);

    var squares = _.range(this.numSquare);
    squares = _.shuffle(squares);
    var length = this.numSquare * 0.07;

    this.wormholes = squares.slice(0, length);
  }
  next();
});

mongoose.model('Game', Game);