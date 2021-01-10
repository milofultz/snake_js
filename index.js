$(document).ready(function () {
  // select existing elements
  const $body = $('body');

  // create new elements
  const $nav = $('<nav class="nav text-right" id="nav"></nav>');
  const $navList = $('<ul class="list" id="nav-list"></ul>');
  const $navListAbout = $('<li class="list-item" id="nav-list-about"><a href="http://www.github.com/milofultz" target="_blank"><img src="assets/GitHub-Mark-120px-plus.png" class="icon" id="github-icon"></a></li>');

  const $header = $('<header class="header" id="header"></header>');
  const $title = $('<h1 class="title text-center" id="title"></h1>');
  const $titleTextMain = $('<span class="title-text title-text-main" id="main-title">SNAKEHACK!</span>');
  const $titleTextSecondary = $('<span class="title-text title-text-secondary" id="secondary-title">where you have to move like a snake</span>');
  const $keys = $('<div class="rules text-center" id="rules"><strong class="main-text rules-header" id="rules-header">Keys:</strong></div>');
  const $keysLegend = $('<table class="rules-legend table center" id="rules-legend" summary="Which keys do which direction"></table>');

  const $gameWrapper = $('<div class="game-wrapper text-center" id="game-wrapper"></div>');
  const $scoreboard = $('<span class="scoreboard" id="scoreboard"></span>');
  const $gameCanvas = $('<canvas class="game-canvas" id="game-canvas"></canvas>');
  const $startButton = $('<span class="button button-start disable-select" id="start-button">Start</span>');
  const $changeKeysButton = $('<span class="button button-change disable-select" id="change-keys-button">Change Keys</span>');
  const $speedButton = $('<span class="button button-speed speed-normal disable-select" id="speed-button">Normal</span>');

  // create event helper functions
  const keysCtrl = (function () {
    const keysets = [
      {
        up: { code: 'ArrowUp', label: 'Up' },
        down: { code: 'ArrowDown', label: 'Down' },
        left: { code: 'ArrowLeft', label: 'Left' },
        right: { code: 'ArrowRight', label: 'Right' },
      },
      {
        up: { code: 'KeyW', label: 'W' },
        down: { code: 'KeyS', label: 'S' },
        left: { code: 'KeyA', label: 'A' },
        right: { code: 'KeyD', label: 'D' },
      },
      {
        up: { code: 'KeyJ', label: 'J' },
        down: { code: 'KeyK', label: 'K' },
        left: { code: 'KeyH', label: 'H' },
        right: { code: 'KeyL', label: 'L' },
      },
      {
        up: { code: 'KeyD', label: 'D' },
        down: { code: 'KeyC', label: 'C' },
        left: { code: 'KeyA', label: 'A' },
        right: { code: 'KeyS', label: 'S' },
      },
      {
        up: { code: 'KeyI', label: 'I' },
        down: { code: 'KeyM', label: 'M' },
        left: { code: 'KeyJ', label: 'J' },
        right: { code: 'KeyK', label: 'K' },
      }
    ]
    let currentKeysetIndex = 0;
    let currentKeyset = keysets[currentKeysetIndex];

    return {
      changeKeyset: function () {
        currentKeysetIndex = (currentKeysetIndex + 1) % keysets.length;
        currentKeyset = keysets[currentKeysetIndex];
      },
      getKeyset: function () {
        return currentKeyset;
      },
      getKeysetText: function () {
        return currentKeyset.up.label + currentKeyset.left.label + currentKeyset.down.label + currentKeyset.right.label;
      },
      fillKeys: function () {
        $keysLegend.html('');

        const $keysHeader = $('<thead class="keys-header table-head" id="keys-header"></thead>');
        const $keysBody = $('<tbody class="keys-body table-body" id="keys-body"></tbody>');

        const directionsLabels = {
          up: '↑',
          left: '←',
          down: '↓',
          right: '→'
        };

        const $keysHeaderRow = $('<tr class="keys-header-row table-row" id="keys-header-row"></tr>');
        const $keysActualRow = $('<tr class="keys-actual-row table-row" id="keys-actual-row"></tr>');
        for (let dir in directionsLabels) {
          const $keysColHeading = $('<th class="table-col-heading table-cell" id="keys-heading-' + dir + '">' + directionsLabels[dir] + '</th>');
          $keysColHeading.appendTo($keysHeaderRow);
          const $keysActual = $('<td class="table-data table-cell" id="keys-data-' + dir + '">' + currentKeyset[dir].label + '</th>');
          $keysActual.appendTo($keysActualRow);
        }
        $keysHeaderRow.appendTo($keysHeader);
        $keysActualRow.appendTo($keysBody);
        $keysHeader.appendTo($keysLegend);
        $keysActualRow.appendTo($keysLegend);
      }
    };
  })();

  const gameCtrl = (function () {
    const canvas = $gameCanvas[0].getContext('2d');

    const sizeCanvas = function (canvas) {
      canvas.canvas.width  = 2000;
      canvas.canvas.height = 2000;
    };

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

    const writeText = function (text, color, canvas) {
      canvas.font = "200px sans-serif";
      canvas.fillStyle = color;
      canvas.textAlign = "center";
      canvas.fillText(text, 1000, 1000);
      canvas.strokeText(text, 1000, 1000);
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

    let speedSettings = [
      { speed: 300, label: "Slow" },
      { speed: 150, label: "Normal" },
      { speed: 100, label: "Fast" },
      { speed: 50, label: "Very Fast" }
    ];
    let currentSpeedIndex = 1;
    let currentSpeed = speedSettings[1].speed;
    let changeKeysSwitch = false;
    let gameInPlay = false;

    return {
      toggleChangeKeys: function () {
        changeKeysSwitch = changeKeysSwitch ? false : true;
      },
      changeSpeed: function () {
        currentSpeedIndex = (currentSpeedIndex + 1) % speedSettings.length;
        currentSpeed = speedSettings[currentSpeedIndex].speed;
        lastLabel = speedSettings[(speedSettings.length + currentSpeedIndex - 1) % speedSettings.length].label;
        currentLabel = speedSettings[currentSpeedIndex].label;
        $speedButton.text(currentLabel);
        $speedButton.removeClass('speed-' + lastLabel.toLowerCase().replace(' ', '-'))
                    .addClass('speed-' + currentLabel.toLowerCase().replace(' ', '-'));
      },
      gameInPlay: function () {
        return gameInPlay;
      },
      play: function () {

        // define vars

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
        let gameText = '';

        // define helper functions

        const keyChanger = function () {
          keysCtrl.fillKeys();
          let keyset = keysCtrl.getKeyset();
          $(document).off('keydown');
          $(document).keydown(function (event) {
            if (event.originalEvent.code === keyset.up.code && snakeDirection !== directionCoords.down) {
              event.preventDefault();
              nextDirection = directionCoords.up;
            } else if (event.originalEvent.code === keyset.left.code && snakeDirection !== directionCoords.right) {
              event.preventDefault();
              nextDirection = directionCoords.left;
            } else if (event.originalEvent.code === keyset.down.code && snakeDirection !== directionCoords.up) {
              event.preventDefault();
              nextDirection = directionCoords.down;
            } else if (event.originalEvent.code === keyset.right.code && snakeDirection !== directionCoords.left) {
              event.preventDefault();
              nextDirection = directionCoords.right;
            }
          });
        };

        const stopGame = function () {
          clearInterval(keyChanger);
          clearInterval(gameLoop);
          gameInPlay = false;
          $startButton.off('click', stopGame);
        };

        // start event listeners

        $startButton.on('click', stopGame);

        // prepare for game

        clearCanvas(canvas);
        sizeCanvas(canvas);
        drawSnake(snake, canvas);
        drawApple(apple, canvas);
        keyChanger();
        if (changeKeysSwitch) {
          let keyChangeTimer = setInterval(function () {
            keyChanger();
            keysCtrl.changeKeyset();
            const keyText = keysCtrl.getKeysetText();
            setTimeout(function () {
              gameText = '3: ' + keyText;
            }, 9000);
            setTimeout(function () {
              gameText = '2: ' + keyText;
            }, 10000);
            setTimeout(function () {
              gameText = '1: ' + keyText;
            }, 11000);
            setTimeout(function () {
              gameText = '';
            }, 11999);
          }, 12000);
        }

        // run game

        let gameLoop = setInterval(function () {
          gameInPlay = true;

          snakeDirection = nextDirection;
          snake.unshift(coord(snake[0].x + nextDirection.x, snake[0].y + nextDirection.y));
          if (snake[0].x < 0 || snake[0].x >= 2000 || snake[0].y < 0 || snake[0].y >= 2000 ||
              isEatingSelf(snake)) {
            clearCanvas(canvas);
            writeText("You lost!", "rgba(0, 0, 0, 1)", canvas);
            stopGame();``
            return;
          } else if (snake[0].x === apple.x && snake[0].y === apple.y) {
            while (isOverlapping(snake, apple)) {
              apple = getNewAppleCoord();
            }
          } else {
            snake.pop();
          }
          clearCanvas(canvas);
          drawSnake(snake, canvas);
          drawApple(apple, canvas);
          writeText(gameText, "rgba(0, 0, 0, 1)", canvas);
        }, currentSpeed);
      }
    }
  })();

  keysCtrl.fillKeys();

  // create event listeners
  $keys.on('click', function () {
    if (!gameCtrl.gameInPlay()) {
      keysCtrl.changeKeyset();
      keysCtrl.fillKeys();
    }
  });
  $startButton.on('click', function () {
    gameCtrl.play();
  });
  $changeKeysButton.on('click', function () {
    gameCtrl.toggleChangeKeys();
    if (Array.from($changeKeysButton[0].classList).includes('button-on')) {
      $changeKeysButton.removeClass('button-on');
    } else {
      $changeKeysButton.addClass('button-on');
    }
  });
  $speedButton.on('click', gameCtrl.changeSpeed);

  // append elements to DOM
  $nav.appendTo($body);
  $navList.appendTo($nav);
  $navListAbout.appendTo($navList);

  $header.appendTo($body);
  $title.appendTo($header);
  $titleTextMain.appendTo($title);
  $titleTextSecondary.appendTo($title);
  $keys.appendTo($header);
  $keysLegend.appendTo($keys);

  $gameWrapper.appendTo($body);
  $scoreboard.appendTo($gameWrapper);
  $gameCanvas.appendTo($gameWrapper);
  $startButton.appendTo($gameWrapper);
  $changeKeysButton.appendTo($gameWrapper);
  $speedButton.appendTo($gameWrapper);
});