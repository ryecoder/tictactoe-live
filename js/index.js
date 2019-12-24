const playerFactory = (name, marker, selections, score) => {
  return { name, marker, selections, score };
};

const gameBoardManager = (() => {
  // each square in the item board
  const boardItems = document.querySelectorAll(".game-board-item");

  const showWinnerSelections = combination => {
    boardItems.forEach(item => {
      itemData = parseInt(item.getAttribute("data-item-number"));
      if (combination[0].indexOf(itemData) >= 0) {
        item.firstElementChild.classList.add("colorize");
      }
    });
  };

  // announce the winner, update ui
  const announceWinner = player => {
    // update player scores
    if (player.marker === "far fa-circle") {
      document.querySelector("#p1-score").textContent = player.score + " wins";
    } else {
      document.querySelector("#p2-score").textContent = player.score + " wins";
    }
    // update banner text based on winner
    document.querySelector(".banner-text").textContent = player.name + " Wins!";
    // show winner's selections
    showWinnerSelections(
      gameManager.checkWinningCombination(gameManager.currentPlayer())
    );
    // reset for next game
    setTimeout(() => {
      gameManager.resetGame();
    }, 2000);
  };

  // adds all listeners to clickables
  const addListeners = () => {
    // listeners for the grid items
    boardItems.forEach(item => {
      item.addEventListener("click", () => {
        const itemChild = item.firstElementChild;
        if (
          !itemChild.classList.contains("locked") &&
          !gameManager.checkAWinner()
        ) {
          // change the marker of the item based on the current player
          itemChild.className = gameManager.currentPlayer().marker + " locked";
          // update current player selection
          gameManager
            .currentPlayer()
            .selections.push(item.getAttribute("data-item-number"));
          // if there is no winner update for next player
          if (!gameManager.checkAWinner()) {
            // switch player and update banner
            gameManager.switchPlayers();
            document.querySelector(".banner-text").textContent =
              gameManager.currentPlayer().name + "'s Turn";

            // checks if its draw and resets the game
            if (gameManager.checkDraw()) {
              document.querySelector(".banner-text").textContent =
                "Its a draw!";
              // reset for next game
              setTimeout(() => {
                gameManager.resetGame();
              }, 2000);
            }

            document.querySelector(
              "#marker"
            ).className = gameManager.currentPlayer().marker;
          } else {
            //update score and announce winner
            gameManager.currentPlayer().score++;
            announceWinner(gameManager.currentPlayer());
          }
        }
      });
    });
    // listener for the reset button
    document.querySelector("#reset-btn").addEventListener("click", () => {
      gameInit();
      gameManager.gameInit();
    });
    // listener for settings button
    document.querySelector("#settings-btn").addEventListener("click", () => {
      document.querySelector(".settings").style.display = "unset";
    });
    // listener for settings close
    document.querySelector("#close-btn").addEventListener("click", () => {
      document.querySelector(".settings").style.display = "none";
    });
    // listener for settings save button
    document.querySelector("#save").addEventListener("click", () => {
      document.querySelector(".settings").style.display = "none";
      gameInit();
      gameManager.gameInit();
    });
  };

  // used for resetting the game after a round
  const resetGame = () => {
    // clear board
    boardItems.forEach(item => {
      item.firstElementChild.className = "";
    });

    // set current player in banner
    document.querySelector(".banner-text").textContent =
      gameManager.currentPlayer().name + "'s Turn";
    document.querySelector(
      "#marker"
    ).className = gameManager.currentPlayer().marker;
  };

  // initialize board ui
  const gameInit = () => {
    // reset for next game
    resetGame();
    // reset the score board
    const boardStats = document.querySelectorAll(".stat p");
    boardStats.forEach(item => {
      item.textContent = "0 wins";
    });
  };

  return { gameInit, addListeners, announceWinner, resetGame };
})();

const gameManager = (() => {
  // global players
  let p1, p2;
  // global monitoring variable
  let isP1; // p1's turn
  let draw; // how many selections already

  // init method
  const gameInit = () => {
    // get names from DOM
    const p1name = document.querySelector("#p1-name").value;
    const p2name = document.querySelector("#p2-name").value;
    // get markers from DOM
    const p1marker = document.querySelector("#p1-marker").className;
    const p2marker = document.querySelector("#p2-marker").className;
    // set to players
    p1 = playerFactory(p1name, p1marker, [], 0);
    p2 = playerFactory(p2name, p2marker, [], 0);
    // set player 1 as first player
    isP1 = true;
    // set draw to 0
    draw = 0;

    // call gameboard manager, clear ui
    gameBoardManager.gameInit();
  };

  // resets game for a next round
  const resetGame = () => {
    p1.selections = [];
    p2.selections = [];
    gameBoardManager.resetGame();
    // set draw to 0
    draw = 0;
  };

  // returns the player object who is in turn
  const currentPlayer = () => {
    // true = p1, false = p2
    return isP1 ? p1 : p2;
  };

  // switches players
  const switchPlayers = () => {
    // switches currentPlayer at call
    isP1 = !isP1;
  };

  // algo to check if current player wins
  const checkWinningCombination = player => {
    // the winning combinations
    const winningCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ];
    // filter function that will store the winning combination if found in player selections
    const winFound = winningCombinations.filter(combi => {
      for (let i = 0; i < combi.length; i++) {
        if (player.selections.indexOf(combi[i] + "") === -1) {
          return false;
        }
      }
      return true;
    });
    // return winFound
    return winFound;
  };

  // update gameboard manager for if a winner is found, limits start loop at 3 selections
  const checkAWinner = () => {
    if (p1.selections.length >= 3 || p2.selections.length >= 3) {
      if (checkWinningCombination(currentPlayer()).length > 0) {
        return true;
      }
      return false;
    }
  };

  const checkDraw = () => {
    draw++;
    return draw >= 9 ? true : false;
  };

  return {
    gameInit,
    currentPlayer,
    switchPlayers,
    checkAWinner,
    resetGame,
    checkDraw,
    checkWinningCombination
  };
})();

gameManager.gameInit();
gameBoardManager.addListeners();
