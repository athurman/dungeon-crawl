var mongoose = require('mongoose');
var _ = require('lodash');

var Orc = mongoose.Schema({
  startPoint: Number,
  damage: {type: Number, default: function(){return _.sample([1,2,3,4,5]);}}
});

mongoose.model('Orc', Orc);
