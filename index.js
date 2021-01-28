$(document).ready(function () {
  // select existing elements
  const $body = $('body');

  // create new elements
  const $nav = $('<nav class="nav text-right" id="nav"></nav>');
  const $navList = $('<ul class="list" id="nav-list"></ul>');
  const $navListAbout = $('<li class="list-item" id="nav-list-about"><a href="http://www.github.com/milofultz" target="_blank"><img src="assets/GitHub-Mark-120px-plus.png" class="icon icon--github" id="github-icon"></a></li>');

  const $main = $('<main class="main container" id="main"></main>');

  const $title = $('<h1 class="title text-center" id="title"></h1>');
  const $titleTextMain = $('<span class="title__text title__text--main" id="main-title">SNAKEHACK!</span>');

  const $header = $('<header class="keys__header" id="keys-header"></header>');
  const $keys = $('<div class="keys text-center disable-select" id="keys"><strong id="keys-header-text">Keys:</strong></div>');
  const $keysLegend = $('<table class="keys__legend table center" id="keys-legend" summary="Which keys do which direction"></table>');

  const $gameWrapper = $('<div class="game__wrapper text-center" id="game-wrapper"></div>');
  const $gameCanvas = $('<canvas class="game__canvas" id="game-canvas"></canvas>');
  const $gameButtons = $('<div class="game__buttons"></div>');
  const $startButton = $('<span class="button button__start disable-select" id="start-button">Start</span>');
  const $changeKeysButton = $('<span class="button button__change button__change--on disable-select" id="change-keys-button">Change Keys</span>');
  const $speedButton = $('<span class="button button__speed--normal disable-select" id="speed-button">Normal</span>');

  // create event helper functions
  const keysCtrl = (function () {
    const keysets = [
      {
        up: { code: 'ArrowUp', label: '↑' },
        down: { code: 'ArrowDown', label: '↓' },
        left: { code: 'ArrowLeft', label: '←' },
        right: { code: 'ArrowRight', label: '→' },
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
        return currentKeyset.up.label + ' ' + currentKeyset.left.label + ' ' + currentKeyset.down.label + ' ' + currentKeyset.right.label;
      },
      getNextKeysetText: function () {
        let nextKeyset = keysets[(currentKeysetIndex + 1) % keysets.length];
        return nextKeyset.up.label + ' ' + nextKeyset.left.label + ' ' + nextKeyset.down.label + ' ' + nextKeyset.right.label;
      },
      fillKeys: function () {
        $keysLegend.html('');

        const $keysHeader = $('<thead class="keys__direction table-head" id="keys-direction"></thead>');
        const $keysBody = $('<tbody class="keys__body table-body" id="keys-body"></tbody>');

        const directionsLabels = {
          up: '⬆️',
          down: '⬇️',
          left: '⬅️',
          right: '➡️'
        };

        const $keysHeaderRow = $('<tr class="keys__direction-row table-row" id="keys-direction-row"></tr>');
        const $keysActualRow = $('<tr class="keys__body-row table-row" id="keys-body-row"></tr>');
        for (let dir in directionsLabels) {
          const $keysColHeading = $('<th class="table__col-heading table__cell" id="keys-heading-' + dir + '">' + directionsLabels[dir] + '</th>');
          $keysColHeading.appendTo($keysHeaderRow);
          const $keysActual = $('<td class="table-data table__cell" id="keys-data-' + dir + '">' + currentKeyset[dir].label + '</th>');
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
      canvas.font = "200px 'Space Mono'";
      canvas.fillStyle = color;
      canvas.textAlign = "center";
      canvas.fillText(text, 1000, 1000);
      canvas.strokeStyle = '#fff';
      canvas.lineWidth = 2;
      canvas.strokeText(text, 1000, 1000);
    };

    const clearCanvas = function (canvas) {
      canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
      canvas.fillStyle = "rgb(255, 255, 255)";
      canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
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
    let changeKeysSwitch = true;
    let gameInPlay = false;
    clearCanvas(canvas);

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
        $speedButton.removeClass('button__speed--' + lastLabel.toLowerCase().replace(' ', '-'))
                    .addClass('button__speed--' + currentLabel.toLowerCase().replace(' ', '-'));
      },
      gameInPlay: function () {
        return gameInPlay;
      },
      play: function () {
        gameInPlay = true;
        let currentGameInPlay = true;

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
        let changeInterval = 10000;
        let score = 0;
        let gameText = '';

        // define helper functions

        const setControls = function () {
          keysCtrl.fillKeys();
          let keyset = keysCtrl.getKeyset();
          $(document).off('keydown');
          $(document).keydown(function (event) {
            event.preventDefault();
            if (event.originalEvent.code === keyset.up.code && snakeDirection !== directionCoords.down) {
              nextDirection = directionCoords.up;
            } else if (event.originalEvent.code === keyset.left.code && snakeDirection !== directionCoords.right) {
              nextDirection = directionCoords.left;
            } else if (event.originalEvent.code === keyset.down.code && snakeDirection !== directionCoords.up) {
              nextDirection = directionCoords.down;
            } else if (event.originalEvent.code === keyset.right.code && snakeDirection !== directionCoords.left) {
              nextDirection = directionCoords.right;
            }
          });
        };

        const changeKeys = function () {
          let keyText;

          setTimeout(function () {
            if (currentGameInPlay) {
              keyText = keysCtrl.getNextKeysetText()
              gameText = '3: ' + keyText;
            }
          }, changeInterval - 3000);
          setTimeout(function () {
            if (currentGameInPlay) {
              gameText = '2: ' + keyText;
            }
          }, changeInterval - 2000);
          setTimeout(function () {
            if (currentGameInPlay) {
              gameText = '1: ' + keyText;
            }
          }, changeInterval - 1000);
          setTimeout(function () {
            if (currentGameInPlay) {
              gameText = '';
              keysCtrl.changeKeyset();
              setControls();
            }
          }, changeInterval - 1);
        };

        const stopGame = function () {
          clearInterval(keyChangeTimer);
          clearInterval(gameLoop);
          gameInPlay = false;
          currentGameInPlay = false;
          $startButton.text('Start');
          $(document).off('keydown');
          $startButton.off('click', stopGame);
        };

        // start event listeners

        $startButton.on('click', stopGame);

        // prepare for game

        sizeCanvas(canvas);
        clearCanvas(canvas);
        drawSnake(snake, canvas);
        drawApple(apple, canvas);
        $startButton.text('Stop');
        setControls();

        // run game

        let keyChangeTimer;

        if (changeKeysSwitch) {
          changeKeys();
          keyChangeTimer = setInterval(changeKeys, changeInterval);
        }

        let gameLoop = setInterval(function () {
          snakeDirection = nextDirection;
          snake.unshift(coord(snake[0].x + nextDirection.x, snake[0].y + nextDirection.y));
          if (snake[0].x < 0 || snake[0].x >= 2000 || snake[0].y < 0 || snake[0].y >= 2000 ||
              isEatingSelf(snake)) {
            writeText(`You lost!`, "rgba(0, 0, 0, 1)", canvas);
            setTimeout(function () {
              clearCanvas(canvas);
              writeText(`Score: ${score}`, "rgba(0, 0, 0, 1)", canvas);
            }, 1300);
            stopGame();
            return;
          } else if (snake[0].x === apple.x && snake[0].y === apple.y) {
            score += 1;
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

  // spin keys
  (function () {
    let num = 9;
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      keysCtrl.changeKeyset();
    }
    keysCtrl.fillKeys();
    for (let i = 1; i < num; i++) {
      setTimeout(function () {
        keysCtrl.changeKeyset();
        keysCtrl.fillKeys();
      }, i ** 3);
    }
  })();

  // create event listeners
  $keysLegend.on('click', function () {
    if (!gameCtrl.gameInPlay()) {
      keysCtrl.changeKeyset();
      keysCtrl.fillKeys();
    }
  });
  $startButton.on('click', function () {
    if (!gameCtrl.gameInPlay()) gameCtrl.play();
  });
  $changeKeysButton.on('click', function () {
    gameCtrl.toggleChangeKeys();
    if (Array.from($changeKeysButton[0].classList).includes('button__change--on')) {
      $changeKeysButton.removeClass('button__change--on');
    } else {
      $changeKeysButton.addClass('button__change--on');
    }
  });
  $speedButton.on('click', gameCtrl.changeSpeed);

  // append elements to DOM
  $nav.appendTo($body);
  $navList.appendTo($nav);
  $navListAbout.appendTo($navList);

  $main.appendTo($body);

  $header.appendTo($main);
  $title.appendTo($header);
  $titleTextMain.appendTo($title);
  $keys.appendTo($header);
  $keysLegend.appendTo($keys);

  $gameWrapper.appendTo($main);
  $gameCanvas.appendTo($gameWrapper);
  $gameButtons.appendTo($gameWrapper);
  $startButton.appendTo($gameButtons);
  $changeKeysButton.appendTo($gameButtons);
  $speedButton.appendTo($gameButtons);
});
