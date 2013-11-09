var mongoose = require('mongoose');
var _ = require('lodash');

var Hero = mongoose.Schema({
  name: String,
  health: Number,
  position: Number,
  hasPrincess: {type: Boolean, default: false},
  hasGold: {type: Boolean, default: false},
});

mongoose.model('Hero', Hero);
