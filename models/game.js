var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema({
  hero: {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
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
  if(!this.board.length){
    this.board = _.range(this.numSquare);
    this.startPoint = _.sample(this.board);
    this.endPoint = _.sample(this.board);
    this.wormholes = function() {
      for(var i =0; i < this.numSquare / 0.07; i++){
        var position = _.sample(this.board);
        this.wormholes.push(position);
      }
    };
  }
  next();
});

mongoose.model('Game', Game);