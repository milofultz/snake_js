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
  // use CSS grid
  const $gameGrid = $('<div class="game-grid" id="game-grid"></div>');
  const $startButton = $('<span class="button button-start" id="start-button">Start</span>');

  // create event helper functions

  // create event listeners

  // append elements to DOM
});