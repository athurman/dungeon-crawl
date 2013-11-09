'use strict';

$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('#form').on('submit', submitNewGame);
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
    console.log(data);
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