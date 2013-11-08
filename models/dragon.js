var mongoose = require('mongoose');
var _ = require('lodash');

var Dragon = mongoose.Schema({
  name: {type: String, default: 'Death'},
  startPoint: Number,
  instaKill: {type: Boolean, default: false}
});

mongoose.model('Dragon', Dragon);
