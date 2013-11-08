var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema{
  hero:  {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
  numSquare: {type: Number, match: [/^((49|[59]\d|[1-9]\d{2})(?<!500)(\.\d+)?|500(\.0+)?)$/, '{VALUE} is an invalid number.']}
  princess: {},
  gold: {},
  dragon: {type: mongoose.Schema.Types.ObjectId, ref: 'Dragon'},
  orcs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orcs'}],
  wormholes: [{}],
}

mongoose.model('Game', Game);