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
    const ctx = initializeCanvas();

    const directionCoords = {
      up: coord(  0,  -10),
      down: coord(  0, 10),
      right: coord( 10,  0 ),
      left: coord(-10,  0 ),
    };

    let snake = [coord(100,100)];
    let apple = getNewAppleCoord();
    let direction = directionCoords.up;


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

    drawSnake(snake, ctx);
    drawApple(apple, ctx);

    const gameLoop = setInterval(function () {
      snake.unshift(coord(snake[0].x + direction.x, snake[0].y + direction.y));
      if (snake[0].x < 0 || snake[0].x > 200 || snake[0].y < 0 || snake[0].y > 200) {
        alert("you died");
        clearInterval(gameLoop);
      } else if (snake[0].x === apple.x && snake[0].y === apple.y) {
        apple = getNewAppleCoord();
      } else {
        snake.pop();
      }
      clearCanvas(ctx);
      drawSnake(snake, ctx);
      drawApple(apple, ctx);
    }, 500);
  };

  const initializeCanvas = function () {
    // create canvas context
    const ctx = $gameCanvas[0].getContext('2d');
    ctx.canvas.width  = 200;
    ctx.canvas.height = 200;
    return ctx;
  };

  const coord = function (x, y) {
    return {x: x, y: y};
  }

  const getNewAppleCoord = function (xBound=200, yBound=200) {
    return coord(Math.floor(Math.random() * xBound/10) * 10, Math.floor(Math.random() * yBound/10) * 10);
  }

  const drawSnake = function (snakeCoordinates, canvas) {
    snakeCoordinates.forEach(function (coord) {
      drawCoord(coord.x, coord.y, "black", canvas);
    });
  };

  const drawApple = function (apple, canvas) {
    drawCoord(apple.x, apple.y, "red", canvas);
  };

  const drawCoord = function (x, y, color, canvas) {
    canvas.fillStyle = color;
    canvas.fillRect(x, y, 10, 10)
  }

  const clearCanvas = function (canvas) {
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  }

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