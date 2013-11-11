var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Hero = mongoose.model('Hero');

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

/*
 * PUT /games/:id/finish
 */

exports.finish = function(req, res){
  console.log('games.finish'.italic.underline.bold.red);
  Game.findById(req.params.id, function(err, game){
    game.didWin = req.body.didWin;
    if(game.didWin) {
      game.endTime = Date.now();
      game.duration = (game.endTime - game.startTime) / 100;
      game.score = game.numSquare / game.duration;
    }
    game.save(function(err, game){
      res.send({status: 'Complete. Did Win? ' + game.didWin, time: game.duration});
    });
  });
};