'use strict';

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('#form').on('submit', submitNewGame);
  $('#board').on('click', '.tile', clickMoveSpace);
  $('div.hero').off('click');
}



//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function submitNewGame(e) {
  var url = '/games/start?player=' + $('input[name="player"]').val() + '&numSquare=' + $('input[name="numSquare"]').val();
  sendGenericAjaxRequest(url, {}, 'post', null, e, function(data, status, jqXHR){
    htmlAddBoard(data, e);
  });
}

function clickMoveSpace(e) {
  var $tile = $(this);
  var $pastHero = $('#board > div.hero');
  $pastHero.removeClass('hero');
  if($tile.hasClass('wormhole')) {
    var position = _.range($('div.tile').length);
    position = _.sample(position);
    $tile = $('#board > div.tile:nth-child(' + position + ')').addClass('hero');
  } else {
    $tile.addClass('hero');
  }
  var url = '/games/' + $('#board').data('game-id') + '/treasures';
  sendGenericAjaxRequest(url, {}, 'GET', null, e, function(data, status, jqXHR){
    console.log(data);
    hasPrincess(data, $tile);
    hasGold(data, $tile);
  });
  htmlMoveDragon();
  htmlMoveOrcs();
  restrictHeroMovement();
  if($tile.hasClass('endPoint')) {
    askWinLose();
  }
}

//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function htmlAddBoard(game, e){
  $('input[name="player"]').val('');
  $('input[name="numSquare"]').val('');
  $('#board > div.tile').remove();
  $('#sidebar > div').remove();
  for(var i = 0; i < game.numSquare; i++){
    var $space = $('<div>').addClass('tile').attr('data-position', [i]);
    $('#board').append($space);
  }
  $('#board').attr('data-game-id', game._id);
  var $endPoint = $('#board > div.tile:nth-child(' + game.endPoint + ')');
  $endPoint.addClass('endPoint');
  addWormHoles(game);
  addPlayer(game);
  addDragon(game);
  addOrcs(game);
  addHealth(game);
}

function htmlUpdateHealth(num) {
  $('#health-bar > div.health').remove();
  for(var i = 0; i < num; i++){
    var $health = $('<div>').addClass('health').attr('data-health-point', [i]);
    $('#health-bar').append($health);
  }
  var $hp = $('#health-bar > h4').text('HP: ' + $('#health-bar > div.health').length + ' pts');
}

function htmlMoveDragon() {
  var $pastDragon = $('#board > div.dragon');
  $pastDragon.removeClass('dragon');
  var move = _.range($('div.tile').length);
  move = _.sample(move);
  var $dragon = $('#board > div.tile:nth-child(' + move + ')').addClass('dragon');
  if($dragon.hasClass('wormhole')) {
    var position = _.range($('div.tile').length);
    position = _.sample(position);
    $dragon = $('#board > div.tile:nth-child(' + position + ')').addClass('dragon');
  }
  if($dragon.hasClass('hero')){
    alert('Game Over!');
    $('#board > div.tile').remove();
    $('#health-bar > div.health').remove();
    $('#health-bar > h4').text('');
    $('#health-bar > h4').text('HP: 0 pts');
  }
}

function htmlMoveOrcs() {
  var $pastOrcs = $('#board > div.orc');
  $pastOrcs.addClass('pastOrc').removeClass('orc');
  var $orc;
  var positionArray = _.range($('div.tile').length);
  for(var i = 0; i < $('#board > div.pastOrc').length; i++) {
    var position = _.sample(positionArray);
    var index = position;
    positionArray.splice(index, 1);
    var $tile = $('#board > div.tile:nth-child(' + position + ')');
    if(!$tile.hasClass('orc')) {
      $orc = $tile.addClass('orc');
      if($orc.hasClass('hero')) {
        var damage = _.sample([1,2,3,4,5]);
        var num = $('#health-bar > div.health').length;
        var health = num - damage;
        htmlUpdateHealth(health);
      }
      if($orc.hasClass('wormhole')){
        console.log('Touched the Wormhole!!');
        var move = _.range($('div.tile').length);
        move = _.sample(position);
        $orc = $('#board > div.tile:nth-child(' + position + ')').addClass('orc');
      }
    } else {
      console.log('Lost an orc');
    }
  }
  $pastOrcs.removeClass('pastOrc');
}

// Orcs disappear currently... the dragon eats them.  That is all.

//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
function addPlayer(game) {
  var $hero = $('#board > div.tile:nth-child(' + game.startPoint + ')');
  $hero.addClass('hero');
}

function addWormHoles(game) {
  for(var i =0; i < game.wormholes.length; i++){
    var $wormhole = $('#board > div.tile:nth-child(' + game.wormholes[i] + ')');
    $wormhole.addClass('wormhole');
  }
}

function addDragon(game) {
  var $dragon = $('#board > div.tile:nth-child(' + game.dragon.position + ')');
  $dragon.addClass('dragon');
}

function addOrcs(game) {
  for(var i =0; i < game.orcs.length; i++){
    var $orc = $('#board > div.tile:nth-child(' + game.orcs[i].position + ')');
    $orc.addClass('orc');
  }
}

function addHealth(game, e) {
  var url = '/games/' + game._id + '/health';
  sendGenericAjaxRequest(url, {}, 'GET', null, e, function(data, status, jqXHR){
    htmlUpdateHealth(data.hero.health);
  });
}

function hasPrincess(game, tile) {
  if(tile.data('position') === game.princess){
    if(!$('div.tile').hasClass('princess')) {
      alert('Congratulations! You found the princess!');
      var $princess = $('<div>').attr('id', 'princess');
      $('#sidebar').append($princess);
      tile.addClass('princess');
    }
  }
}

function hasGold(game, tile) {
  if(tile.data('position') === game.gold) {
    if(!$('div.tile').hasClass('gold')) {
      alert('Congratulations! You found the gold!');
      var $gold = $('<div>').attr('id', 'gold');
      $('#sidebar').append($gold);
      tile.addClass('gold');
    }
  }
}

function askWinLose() {
  if($('div.tile').hasClass('gold', 'princess')) {
    alert('Ermah Gerd - WWEERRRNNEERRR');
  } else {
    alert('You Lose');
  }
}

function restrictHeroMovement(){
  $('#board').off('click');
  $('div.hero').prev().on('click', clickMoveSpace);
  $('div.hero').next().on('click', clickMoveSpace);

  var heroPosition = $('div.hero').data().position;
  var topLeft = heroPosition - 19;
  var top = heroPosition - 18;
  var topRight = heroPosition - 17;
  var bottomLeft = heroPosition + 19;
  var bottom = heroPosition + 20;
  var bottomRight = heroPosition + 21;

  $('#board > div:nth-child(' + topLeft + ')').on('click', clickMoveSpace);
  $('#board > div:nth-child(' + top + ')').on('click', clickMoveSpace);
  $('#board > div:nth-child(' + topRight + ')').on('click', clickMoveSpace);
  $('#board > div:nth-child(' + bottomLeft + ')').on('click', clickMoveSpace);
  $('#board > div:nth-child(' + bottom + ')').on('click', clickMoveSpace);
  $('#board > div:nth-child(' + bottomRight + ')').on('click', clickMoveSpace);
  }

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = successFn;
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //