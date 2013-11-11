var mongoose = require('mongoose');

var Hero = mongoose.Schema({
  name: String,
  health: Number,
  position: Number,
});

mongoose.model('Hero', Hero);
