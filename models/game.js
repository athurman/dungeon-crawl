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
  startTime: {type: Date, default: Date.now},
  endTime: Date,
  didWin: {type: Boolean, default: false},
  score: Number
});

Game.pre('save', function(next){
  if(this.board.length === 0){
    this.board = _.range(this.numSquare);
    this.positions = _.range(this.numSquare);

    this.startPoint = _.sample(this.board);
    this.positions.splice(this.startPoint, 1);

    this.endPoint = _.sample(this.positions);
    this.positions.splice(this.endPoint, 1);

    this.princess = _.sample(this.positions);
    this.positions.splice(this.princess, 1);

    this.gold = _.sample(this.positions);
    this.positions.splice(this.gold, 1);

    this.dragon = {instaKill: false, position: _.sample(this.board)};

    this.positions = _.shuffle(this.positions);
    var length = this.numSquare * 0.07;

    this.wormholes = this.positions.slice(0, length);

    var tiles = _.range(this.numSquare);
    tiles = _.shuffle(this.positions);
    var total = this.numSquare * 0.1;

    this.orcs = tiles.slice(0, total);
    this.orcs = _.map(this.orcs, function(n){return {damage: _.sample([1,2,3,4,5]), position: n};});
  }
  next();
});

mongoose.model('Game', Game);