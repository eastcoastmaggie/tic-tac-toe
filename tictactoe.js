
const gameBoard = (function(){
    let playingField = Array(9).fill(null);
    function clearBoard(){
        playingField = Array(9).fill(null);;
    }
    function placePiece(playerPiece, pos){
        playingField[pos] = playerPiece;

    }
    function getBoard(){
        return playingField;
    }
    return {clearBoard, placePiece, getBoard};
})();

const Player = function(playerPiece, name){
    let ai = false;
    let challengeRating = 'easy';
    let gamesWon = 0;
    // methods
    const getPlayerPiece = () => playerPiece;
    const getName = () => name;
    const getGamesWon = () => gamesWon;
    const increaseGamesWon = () => gamesWon++;
    const setAI = (toggle) => {ai = toggle; }
    const getAI = () => ai;
    const getChallengeRating = () => challengeRating;
    const setChallengeRating = (level) => {challengeRating = level;}

    return {getPlayerPiece, getName, setAI, getAI, getGamesWon, setChallengeRating, getChallengeRating, increaseGamesWon}
};
const gamePlay = (function(){
    const playerOneToken = "X";
    const playerTwoToken = "O";
    let player1 = Player(playerOneToken, "Player One");
    let player2 = Player(playerTwoToken, "Player Two");
    let currentPlayer = (player1.getPlayerPiece() == "X") ? player1 : player2;
    let message = "";
    let winner =  null;
    let gameStarted = false;

    // cache dom
    let el = document.querySelector("#game-board");
    let playingFieldDOM = el.querySelectorAll('[data-position]');
    let messageDisplayMask = el.querySelector('.display-message');
    let messageDisplay = el.querySelector('.display-message-inner');
    let scoreBoard = el.querySelector("#score-board");
    let playerScore1 = scoreBoard.querySelector("#player1-score");
    let playerScore2 = scoreBoard.querySelector("#player2-score");
    let mask = document.createElement('div');
    let newGameBtn = el.querySelector('#new-game-btn');
    
    mask.classList.add('mask');
    el.appendChild(mask);
    newGame();

    newGameBtn.addEventListener('click', ()=>{
        reset();
        newGame();
    });

    // methods
    function reset(){
        player1 = Player(playerOneToken, "Player One");
        player2 = Player(playerTwoToken, "Player Two");
        currentPlayer = (player1.getPlayerPiece() == "X") ? player1 : player2;
        message = "";
        winner =  null;
        gameStarted = false;
        gameBoard.clearBoard();

    }
    function newGame(){
        currentPlayer = (player1.getPlayerPiece() == "X") ? player1 : player2;
        message = "";
        winner =  null;
        gameStarted = false;

        let titleScreen = document.createElement('div');
        let title = document.createElement('h1');
        let buttonDiv = document.createElement('div');
        let button = document.createElement('button');
        function playerSettings(name){
            let difficulty = ['easy', 'medium', 'hard'];
            let container = document.createElement('div');
            container.classList.add('player-container');
            let header = document.createElement('h2');
            let div = document.createElement('div');
            let label = document.createElement('h3');
            let toggleLabel = document.createElement('label');
            let aiToggle = document.createElement('input');
            let toggleSpan = document.createElement('span');

            header.textContent = name;
            div.classList.add('ai-toggle');
            label.textContent = "AI";
            toggleLabel.classList.add('switch');
            aiToggle.setAttribute('type', 'checkbox');
            aiToggle.dataset.player = name;
            toggleSpan.classList.add('slider');

            container.appendChild(header);            
            div.appendChild(label);

            toggleLabel.appendChild(aiToggle);
            toggleLabel.appendChild(toggleSpan);
            div.appendChild(toggleLabel);
            
            for(level of difficulty){
                let difficultyRadioBtns = document.createElement('input');
                let difficultyLabel = document.createElement('label');
                let radioRow = document.createElement('div');

                difficultyRadioBtns.classList.add('difficulty-radio-btn');
                radioRow.classList.add('hide');
                radioRow.dataset.playerRadio = name;
                difficultyRadioBtns.setAttribute('type', 'radio');
                difficultyRadioBtns.setAttribute('name', 'difficulty-'+ name)
                difficultyRadioBtns.setAttribute('id', `${level}-${name}`);
                difficultyRadioBtns.setAttribute('value', level);
                difficultyRadioBtns.dataset.player = name;
                difficultyLabel.setAttribute('for', `${level}-${name}`);
                difficultyLabel.textContent = level;
                if(level == 'easy'){
                    difficultyRadioBtns.checked = true;
                }
                
                radioRow.appendChild(difficultyRadioBtns);
                radioRow.appendChild(difficultyLabel);
                div.appendChild(radioRow);
            }

            aiToggle.addEventListener("change", function(){
            let difficultyBtn = el.querySelectorAll(`[data-player-radio="${name}"]`);  
            for (levelBtn of difficultyBtn){
                levelBtn.classList.toggle('hide');
            }
            })
            container.appendChild(div);
            titleScreen.appendChild(container);
        
        }
        buttonDiv.classList.add('btn-container');
        button.textContent = "Start";
        title.textContent = "Tic-Tac-Toe";
        title.classList.add('title');
        titleScreen.appendChild(title);
        playerSettings(player1.getName());
        playerSettings(player2.getName());

        buttonDiv.appendChild(button);
        titleScreen.appendChild(buttonDiv);
        titleScreen.classList.add('title-screen');
        el.appendChild(titleScreen);
        button.addEventListener('click', function(){
            player1.setAI(el.querySelector(`[data-player="${player1.getName()}"]`).checked);
            player2.setAI(el.querySelector(`[data-player="${player2.getName()}"]`).checked);
            player1.setChallengeRating(el.querySelector(`[name="difficulty-${player1.getName()}"]:checked`).value);
            player2.setChallengeRating(el.querySelector(`[name="difficulty-${player2.getName()}"]:checked`).value);
            
            el.removeChild(titleScreen);
            render();
            nextTurn();
        });

    }

    function nextTurn(){     
        if(currentPlayer.getAI() == true ){
            mask.classList.add('mask')
            setTimeout(() => aITurn(), 900);
        } else {
            mask.classList.remove('mask');
        }
    }
    function render(){
        for (let i = 0; i < playingFieldDOM.length; i++){
            playingFieldDOM[i].addEventListener('click', claimSquare);
        }
        for(let i = 0; i <  playingFieldDOM.length; i++){
            playingFieldDOM[i].textContent = gameBoard.getBoard()[i];
        }
        playerScore1.textContent = player1.getGamesWon();
        playerScore2.textContent = player2.getGamesWon();
        if(winner != null){
            messageDisplay.textContent = message;
            messageDisplayMask.classList.remove('hide');
        
        } else {
            messageDisplayMask.classList.add('hide');
        }
    }
    function aITurn(){
        const board = gameBoard.getBoard();
        let openPositions = [];
        let selection = null;
        let challengeRating = currentPlayer.getChallengeRating();

        if (board.filter(pos => pos == null).length > 0){
            // determine which positions are open
            let i = board.indexOf(null);
            while(i != -1 && i < board.length){
                openPositions.push(i);
                i++;
                i = board.indexOf(null, i);
            }
            if (challengeRating === 'easy'){
                easyMove();
            } else if (challengeRating === 'medium'){
                mediumMove();
            } else { 
                expertMove();}

            function easyMove(){
                selection = openPositions[Math.floor(Math.random() * openPositions.length)];
            }
            function expertMove(){
                // check for possible win

                let winCondition = false;
                let i = 0;
                while (!winCondition && i < openPositions.length){
                    let tempBoard = [...board];
                    tempBoard[openPositions[i]] = currentPlayer.getPlayerPiece();
                    winCondition = evalMove(openPositions[i], tempBoard, true);
                    if (winCondition == true){
                        selection = openPositions[i];
                    }
                    i++;
                }
            if (selection === null){
                let i = 0;
                let failCondition = null;
                let opponent = (currentPlayer === player1) ? player2 : player1;
                // check for opponent win
                while (!failCondition && i < openPositions.length){
                    let tempBoard = [...board];
                    tempBoard[openPositions[i]] = opponent.getPlayerPiece();

                    failCondition = evalMove(openPositions[i], tempBoard, true);
                    if (failCondition == true){
                        selection = openPositions[i];
                    }
                    i++;
                }
            }
                // take the centre
                if (selection === null){
                    let center = 4;
                    if(board[center] === null){
                        selection = center;
                    }
                }
                // take any move
                if (selection === null){ easyMove()}
            }
            function mediumMove(){
                // randomly play well
                if (Math.floor(Math.random()*2) == 1){
                    expertMove();
                } else {
                    easyMove();
                }

            }
        playingFieldDOM[selection].click();
        }
 
    }
    function claimSquare (event){
  
        let square = event.currentTarget.dataset.position;
        if (gameBoard.getBoard()[square] === null){
            gameBoard.placePiece(currentPlayer.getPlayerPiece(), square);
            evalMove(square);
            currentPlayer = (currentPlayer == player1) ? player2 : player1;
            if (winner === null){
                
                nextTurn();
            }
        }
    }
    function evalMove(token, board = gameBoard.getBoard(), test = false){
            const col = (token % 3);
            const row = (Math.floor(token/3));
            let addedTokenType = board[token];
            let winCondition = false;
            // check to see if the current player wins
            render();
            if ((board[col]== addedTokenType && board[col + 3] == addedTokenType
                && board[col + 6] == addedTokenType)
                || (board[row*3] == addedTokenType && board[row * 3 + 1] == addedTokenType
                && board[row*3 + 2] == addedTokenType)){
                
                winCondition = true;
                winner = (test === false) ? true : null;
                
            } else if ((board[0] == addedTokenType && board[4] == addedTokenType && board[8] == addedTokenType )
            || (board[2] == addedTokenType && board[4] == addedTokenType && board[6] == addedTokenType)){
                // check diagnal 0,4,8 or 2,4,6
                winCondition = true;
                winner = (test === false) ? true : null;
            
            } else if(board.indexOf(null) == -1){
            // no moves left, game over
                winCondition = false;
                winner = (test === false) ? false : null;
            }
            if (winner != null){
                endGame();
            }  else if (test === true){ 
                return winCondition;
            }

    }
    function endGame(){
        if(winner){
            message = `${currentPlayer.getName()} is the winner!`;
            currentPlayer.increaseGamesWon();
        } else {
            message = "Tie Game";
        }
        render();                                                                                      
        setTimeout(() => startRound(), 1500);
    }
    function startRound(){
        gameBoard.clearBoard();
        winner = null;
        currentPlayer = player1;
        render();
        nextTurn();
    }                                                                                             
})()