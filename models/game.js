var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema({
  player: String,
  hero: {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
  numSquare: Number,
  princess: Number,
  gold: Number,
  dragon: {},
  orcs: [],
  wormholes: [Number],
  board: [Number],
  startPoint: Number,
  endPoint: Number,
});

Game.pre('save', function(next){
  if(this.board.length === 0){
    this.board = _.range(this.numSquare);
    this.startPoint = _.sample(this.board);
    this.endPoint = _.sample(this.board);
    this.princess = _.sample(this.board);
    this.gold = _.sample(this.board);
    this.dragon = {instaKill: false, position: _.sample(this.board)};

    var squares = _.range(this.numSquare);
    squares = _.shuffle(squares);
    var length = this.numSquare * 0.07;

    this.wormholes = squares.slice(0, length);

    var tiles = _.range(this.numSquare);
    tiles = _.shuffle(squares);
    var total = this.numSquare * 0.05;

    this.orcs = tiles.slice(0, total);
    this.orcs = _.map(this.orcs, function(n){return {damage: _.sample([1,2,3,4,5]), position: n};});
  }
  next();
});

mongoose.model('Game', Game);