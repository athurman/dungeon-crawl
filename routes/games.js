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
      hero.position = game.startPoint;
      hero.save(function(err, hero){
        game.hero = hero;
        game.save(function(err, game){
          console.log(game.hero);
          res.send(game);
        });
      });
    });
  });
};

/*
 * GET /games/:id/health
 */

exports.health = function(req, res){
  Game.findById(req.params.id).populate('hero').exec(function(err, game){
    console.log(game.hero);
    res.send(game);
  });
};

/*
 * GET /games/:id/treasures
 */

exports.treasures = function(req, res){
  Game.findById(req.params.id).populate('hero').exec(function(err, game){
    console.log(game.hero);
    res.send(game);
  });
};

/*
 * GET /games/instructions
 */

exports.instructions = function(req, res){
  console.log('games.instructions'.italic.underline.bold.magenta);
  res.render('games/instructions', {title: 'Dungeon Crawl | Instructions'});
};
