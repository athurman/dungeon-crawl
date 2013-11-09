'use strict';

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('#form').on('submit', submitNewGame);
  $('#board').on('click', '.tile', clickMoveSpace);
}



//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function submitNewGame(e) {
  var url = '/games/start?player=' + $('input[name="player"]').val() + '&numSquare=' + $('input[name="numSquare"]').val();
  sendGenericAjaxRequest(url, {}, 'post', null, e, function(data, status, jqXHR){
    console.log(data);
    htmlAddBoard(data, e);
  });
  console.log('complete');
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
  htmlMoveDragon();
  htmlMoveOrcs();
}

//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function htmlAddBoard(game, e){
  $('input[name="player"]').val('');
  $('input[name="numSquare"]').val('');
  $('#board > div.tile').remove();
  for(var i = 0; i < game.numSquare; i++){
    var $space = $('<div>').addClass('tile').attr('data-position', [i]);
    $('#board').append($space);
  }
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