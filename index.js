$(document).ready(function () {
  // select existing elements
  const $body = $('body');

  // create new elements
  const $nav = $('<nav class="nav" id="nav"></nav>');
  const $navList = $('<ul class="list" id="nav-list"></ul>');
  const $navListAbout = $('<li class="list-item" id="nav-list-about"><img src="assets/github.png"></li>');

  const $header = $('<header class="header" id="header"></header>');
  const $title = $('<h1 class="title" id="title"></h1>');
  const $titleTextMain = $('<span class="title-text-main" id="main-title">SNAKEHACK</span>');
  const $titleTextSecondary = $('<span class="title-text-secondary" id="secondary-title">where you have to move like a snake</span>');

  const $gameWrapper = $('<div class="container game-wrapper" id="game-wrapper"></div>');
  const $scoreboard = $('<span class="scoreboard" id="scoreboard"></span>');
  const $gameCanvas = $('<canvas class="game-canvas" id="game-canvas"></canvas>');
  const $startButton = $('<span class="button button-start" id="start-button">Start</span>');

  // create event helper functions

  // create event listeners

  // append elements to DOM
  $nav.appendTo($body);
  $navList.appendTo($nav);
  $navListAbout.appendTo($navList);

  $header.appendTo($body);
  $title.appendTo($header);
  $titleTextMain.appendTo($title);
  $titleTextSecondary.appendTo($title);

  $gameWrapper.appendTo($body);
  $scoreboard.appendTo($gameWrapper);
  $gameCanvas.appendTo($gameWrapper);
  $startButton.appendTo($gameWrapper);
});