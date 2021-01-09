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
  const playGame = function () {
    initializeCanvas();

    // create the object to convert "direction" to coords
    const directionCoords = {
      up: coord(  0,  10),
      down: coord(  0, -10),
      right: coord( 10,  0 ),
      left: coord(-10,  0 ),
    };

    // create the snake array (array of coordinates)
    let snake = [coord(100,100)];
    // create the apple object (single coordinate)
    let apple = getRandomCoord();
    // create the direction var (last button pressed by user)
    let direction = directionCoords.up;


    // create event listeners for keyup to change direction var
    // destroy this at end of game
    $(document).keyup(function (event) {
      if (event.originalEvent.code === "KeyW") {
        direction = directionCoords.up;
      } else if (event.originalEvent.code === "KeyA") {
        direction = directionCoords.left;
      } else if (event.originalEvent.code === "KeyS") {
        direction = directionCoords.down;
      } else if (event.originalEvent.code === "KeyD") {
        direction = directionCoords.right;
      }
    });

    // draw snake
    drawSnake(snake);
    // draw apple

    // every second
      // add one element to head of snake at coordinate + (direction offset)
      // if current snake head is out of bounds
        // end game
      // else if current snake head is not apple coordinate
        // pop one element from end
      // draw snake
      // draw apple
  };

  const initializeCanvas = function () {
    // create canvas context
    const ctx = $gameCanvas[0].getContext('2d');
    ctx.canvas.width  = 200;
    ctx.canvas.height = 200;
  };

  const coord = function (x, y) {
    return {x: x, y: y};
  }

  const getRandomCoord = function (xBound=200, yBound=200) {
    return coord(Math.floor(Math.random() * xBound), Math.floor(Math.random() * yBound));
  }

  const drawSnake = function (snakeCoordinates) {
    const ctx = $gameCanvas[0].getContext('2d');
    ctx.fillStyle = "black";
    for (let i = 0; i < snakeCoordinates.length; i++) {
      ctx.fillRect(snakeCoordinates[0].x, snakeCoordinates[0].y, 10, 10)
    };
  };

  playGame();

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