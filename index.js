$(document).ready(function () {
  // select existing elements
  const $body = $('body');

  // create new elements
  const $nav = $('<nav class="nav text-right" id="nav"></nav>');
  const $navList = $('<ul class="list" id="nav-list"></ul>');
  const $navListAbout = $('<li class="list-item" id="nav-list-about"><img src="assets/GitHub-Mark-120px-plus.png" class="icon" id="github-icon"></li>');

  const $header = $('<header class="header" id="header"></header>');
  const $title = $('<h1 class="title text-center" id="title"></h1>');
  const $titleTextMain = $('<span class="title-text title-text-main" id="main-title">SNAKEHACK!</span>');
  const $titleTextSecondary = $('<span class="title-text title-text-secondary" id="secondary-title">where you have to move like a snake</span>');

  const $gameWrapper = $('<div class="game-wrapper text-center" id="game-wrapper"></div>');
  const $scoreboard = $('<span class="scoreboard" id="scoreboard"></span>');
  const $gameCanvas = $('<canvas class="game-canvas" id="game-canvas"></canvas>');
  const $startButton = $('<span class="button button-start" id="start-button">Start</span>');

  // create event helper functions
  const ctx = $gameCanvas[0].getContext('2d');

  const playGame = function () {
    clearCanvas(ctx);
    sizeCanvas(ctx);

    const directionCoords = {
      up: coord(0, -100),
      down: coord(0, 100),
      right: coord(100, 0),
      left: coord(-100, 0),
    };

    let snake = [coord(1000,1000)];
    let snakeDirection = directionCoords.up;
    let apple = getNewAppleCoord();
    let nextDirection = directionCoords.up;

    $(document).keydown(function (event) {
      if (event.originalEvent.code === "KeyW" && snakeDirection !== directionCoords.down) {
        nextDirection = directionCoords.up;
      } else if (event.originalEvent.code === "KeyA" && snakeDirection !== directionCoords.right) {
        nextDirection = directionCoords.left;
      } else if (event.originalEvent.code === "KeyS" && snakeDirection !== directionCoords.up) {
        nextDirection = directionCoords.down;
      } else if (event.originalEvent.code === "KeyD" && snakeDirection !== directionCoords.left) {
        nextDirection = directionCoords.right;
      }
    });

    drawSnake(snake, ctx);
    drawApple(apple, ctx);

    const gameLoop = setInterval(function () {
      snakeDirection = nextDirection;
      snake.unshift(coord(snake[0].x + nextDirection.x, snake[0].y + nextDirection.y));
      if (snake[0].x < 0 || snake[0].x >= 2000 || snake[0].y < 0 || snake[0].y >= 2000 ||
          isEatingSelf(snake)) {
        // alert("you died");
        clearInterval(gameLoop);
      } else if (snake[0].x === apple.x && snake[0].y === apple.y) {
        while (isOverlapping(snake, apple)) {
          apple = getNewAppleCoord();
        }
      } else {
        snake.pop();
      }
      clearCanvas(ctx);
      drawSnake(snake, ctx);
      drawApple(apple, ctx);
    }, 100);
  };

  const sizeCanvas = function (canvas) {
    canvas.canvas.width  = 2000;
    canvas.canvas.height = 2000;
  }

  const coord = function (x, y) {
    return {x: x, y: y};
  };

  const getNewAppleCoord = function (xBound=2000, yBound=2000) {
    return coord(Math.floor(Math.random() * xBound/100) * 100, Math.floor(Math.random() * yBound/100) * 100);
  };

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
    canvas.fillRect(x, y, 100, 100);
  };

  const clearCanvas = function (canvas) {
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  };

  const isEatingSelf = function (snake) {
    for (let i = 0; i < snake.length; i++) {
      for (let j = i + 1; j < snake.length; j++) {
        if (snake[i].x === snake[j].x && snake[i].y === snake[j].y) {
          return true;
        }
      }
    }
    return false;
  };

  const isOverlapping = function (snake, apple) {
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === apple.x && snake[i].y === apple.y) {
        return true;
      }
    }
    return false;
  };

  // create event listeners
  $startButton.on('click', playGame);

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