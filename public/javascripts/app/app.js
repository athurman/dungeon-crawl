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
  var url = '/games/start?hero=' + $('input[name="hero"]').val() + '&numSquare=' + $('input[name="numSquare"]').val();
  sendGenericAjaxRequest(url, {}, 'post', null, e, function(data){
    console.log(data);
    htmlAddBoard(data);
  });
}



//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function htmlAddBoard(data){

  for(var i = 0; i < game.numSquare; i++){
    var square = $('<td class="tile"></td>');
    var $card = $(card);
      $('#board > th').append($card);
  };
}


//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //
//  ------------------------------------------------------------------ //

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  console.log(url);
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