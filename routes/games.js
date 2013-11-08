var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Hero = mongoose.model('Hero');
var Orc = mongoose.model('Orc');
var Dragon = mongoose.model('Dragon');
var colors = require('colors');
var _ = require('lodash');
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
  new Game(req.query).save(function(err, game){
    new Hero().save(function(err, hero){
      hero.name = game.player;
      hero.health = game.numSquare;
      game.hero = hero;
      game.save(function(err, game){
        res.send(game);
      });
    });
    // new Dragon().save(function(err, dragon){
    //   dragon.startPoint = _.sample(game.board);
    //   game.dragon = dragon;
    //   game.save();
    // });
    // for(var i = 0; i < game.numSquare * 0.05; i++){
    //   new Orc().save(function(err, orc){
    //     orc.startPoint = _.sample(game.board);
    //     game.orcs.push(orc);
    //     game.save();
    //   });
    // }
    // game.save(function(err, game){
    //   console.log(game);
    //   res.send(game);
    // });
  });
};
