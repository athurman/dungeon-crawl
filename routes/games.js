var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var colors = require('colors');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random

/*
 * GET /
 */

exports.index = function(req, res){
  console.log('games.index'.italic.underline.bold.magenta);
  res.render('games/index', {title: 'Dungeon Crawl'});
};

/*
 * POST /games/start
 */

exports.start = function(req, res){

  console.log(req.query);
  new Game(req.query).save(function(err, game){
    console.log(game);
  });
};
