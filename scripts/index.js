// =========================================
// Global Variables and Constants
// =========================================

// Game State Variables
let blue = 0;
let red = 0;
let outer = [];
let middle = [];
let inner = [];
let paused = 0;
let ismiddleunlocked = 0;
let isinnerunlocked = 0;
let currentTurn = 0;
let redcircles = [];
let bluecircles = [];
let gameEnded = false;
let phase = "placement"; // "placement" or "movement"
let selectedCircle = null;
let redPlaced = 0;
let bluePlaced = 0;
let redscore = 0;
let bluescore = 0;

// Timer Variables
let redseconds = 300;
let blueseconds = 300;
let turnseconds = 20;
let refreshtotal = null; // Will hold setInterval ID
let refreshturn = null;  // Will hold setInterval ID

// Circle Grouping Constants (representing IDs of SVG circles)
const outercircles = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
const middlecircles = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
const innercircles = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];

// Neighbors for movement and elimination logic
const neighbors = {
    c1: ['c2', 'c6'], c2: ['c1', 'c3', 'b3'], c3: ['c2', 'c4'],
    c4: ['c3', 'c5', 'b2'], c5: ['c4', 'c6'], c6: ['c1', 'c5', 'b4'],
    b1: ['a1', 'b3', 'b4'], b2: ['b5', 'b6', 'c4'], b3: ['b1', 'b6', 'c2'],
    b4: ['b1', 'b5', 'c6'], b5: ['b2', 'b4', 'a6'], b6: ['b2', 'b3', 'a5'],
    a1: ['b1', 'a3', 'a4'], a2: ['a5', 'a6'], a3: ['a1', 'a5'],
    a4: ['a1', 'a6'], a5: ['a2', 'a3', 'b6'], a6: ['a2', 'a4', 'b5'],
};

// =========================================
// Audio Setup
// =========================================

const moveSound = new Audio('../sounds/placment timer.mp3');
const startSound = new Audio('../sounds/start.mp3');
const buttonClickSound = new Audio('../sounds/button.mp3');
const eliminateSound = new Audio('../sounds/eliminate.mp3');
const endSound = new Audio('../sounds/end.mp3');

// Preload sounds for better performance
endSound.preload = 'auto';
eliminateSound.preload = 'auto';
buttonClickSound.preload = 'auto';
moveSound.preload = 'auto';
startSound.preload = 'auto';

const allSounds = [moveSound, startSound, buttonClickSound, eliminateSound, endSound];

// =========================================
// Game State Management and UI Updates
// =========================================

function initializeGameUI() {
    selectedCircle = null;
    phase = "placement";
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
    blue = 0;
    red = 0;
    outer = [];
    middle = [];
    inner = [];
    paused = 0;
    ismiddleunlocked = 0;
    isinnerunlocked = 0;
    currentTurn = 0;
    redseconds = 300;
    blueseconds = 300;
    turnseconds = 20;
    gameEnded = false;

    clearInterval(refreshtotal);
    clearInterval(refreshturn);

    document.querySelector('#red').innerHTML = `RED TIME: 05:00`;
    document.querySelector('#blue').innerHTML = `BLUE TIME: 05:00`;
    document.querySelector('.turn-timer').innerHTML = `TURN TIME: 00:20`;

    [...outercircles, ...middlecircles, ...innercircles].forEach(id => {
        const circle = document.querySelector(`.${id}`);
        if (circle) {
            circle.setAttribute('fill', 'grey');
            circle.setAttribute('stroke', 'black');
        }
    });

    score();
    updateTurnVisuals(); // Ensure initial turn visuals are correct

    // Show welcome screen with green background
    document.body.style.transition = "background 2s ease";
    document.body.style.background = "rgb(136, 247, 190)"; // green

    document.getElementById('main-game').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('end-screen').style.display = 'none'; // Ensure end screen is hidden
}

function resetSelection() {
    if (selectedCircle) {
        const circle = document.querySelector(`.${selectedCircle}`);
        if (circle) {
            circle.setAttribute('stroke', 'black');
        }
    }
    selectedCircle = null;
}

function updateTurnVisuals() {
    const timer = document.querySelector('.turn-timer');
    if (!timer) return;

    if (currentTurn === 0) {
        timer.style.background = "linear-gradient(45deg, #4d0000, #660000)"; // red style
        timer.style.borderColor = "#ff4d4d";
    } else {
        timer.style.background = "linear-gradient(45deg, #003366, #004080)"; // blue style
        timer.style.borderColor = "#4da8ff";
    }

    document.body.style.transition = "background 2s ease";
    document.body.style.background = currentTurn === 0 ? "#ffe6e6" : "#e6f0ff"; // red or blue tint
}

function score() {
    redscore = 0;
    bluescore = 0;

    // Outer circle connections
    if (redcircles.includes("c1") && redcircles.includes("c2")) redscore += 1;
    if (redcircles.includes("c1") && redcircles.includes("c6")) redscore += 2;
    if (redcircles.includes("c2") && redcircles.includes("c3")) redscore += 1;
    if (redcircles.includes("c3") && redcircles.includes("c4")) redscore += 3;
    if (redcircles.includes("c4") && redcircles.includes("c5")) redscore += 2;
    if (redcircles.includes("c5") && redcircles.includes("c6")) redscore += 1;

    if (bluecircles.includes("c1") && bluecircles.includes("c2")) bluescore += 1;
    if (bluecircles.includes("c1") && bluecircles.includes("c6")) bluescore += 2;
    if (bluecircles.includes("c2") && bluecircles.includes("c3")) bluescore += 1;
    if (bluecircles.includes("c3") && bluecircles.includes("c4")) bluescore += 3;
    if (bluecircles.includes("c4") && bluecircles.includes("c5")) bluescore += 2;
    if (bluecircles.includes("c5") && bluecircles.includes("c6")) bluescore += 1;

    // Middle circle connections
    if (redcircles.includes("b1") && redcircles.includes("b4")) redscore += 4;
    if (redcircles.includes("b1") && redcircles.includes("b3")) redscore += 5;
    if (redcircles.includes("b3") && redcircles.includes("b6")) redscore += 6;
    if (redcircles.includes("b6") && redcircles.includes("b2")) redscore += 4;
    if (redcircles.includes("b2") && redcircles.includes("b5")) redscore += 5;
    if (redcircles.includes("b5") && redcircles.includes("b4")) redscore += 6;

    if (bluecircles.includes("b1") && bluecircles.includes("b4")) bluescore += 4;
    if (bluecircles.includes("b1") && bluecircles.includes("b3")) bluescore += 5;
    if (bluecircles.includes("b3") && bluecircles.includes("b6")) bluescore += 6;
    if (bluecircles.includes("b6") && bluecircles.includes("b2")) bluescore += 4;
    if (bluecircles.includes("b2") && bluecircles.includes("b5")) bluescore += 5;
    if (bluecircles.includes("b5") && bluecircles.includes("b4")) bluescore += 6;

    // Inner circle connections
    if (redcircles.includes("a1") && redcircles.includes("a3")) redscore += 8;
    if (redcircles.includes("a1") && redcircles.includes("a4")) redscore += 9;
    if (redcircles.includes("a3") && redcircles.includes("a5")) redscore += 8;
    if (redcircles.includes("a5") && redcircles.includes("a2")) redscore += 9;
    if (redcircles.includes("a2") && redcircles.includes("a6")) redscore += 8;
    if (redcircles.includes("a4") && redcircles.includes("a6")) redscore += 8;

    if (bluecircles.includes("a1") && bluecircles.includes("a3")) bluescore += 8;
    if (bluecircles.includes("a1") && bluecircles.includes("a4")) bluescore += 9;
    if (bluecircles.includes("a3") && bluecircles.includes("a5")) bluescore += 8;
    if (bluecircles.includes("a5") && bluecircles.includes("a2")) bluescore += 9;
    if (bluecircles.includes("a2") && bluecircles.includes("a6")) bluescore += 8;
    if (bluecircles.includes("a4") && bluecircles.includes("a6")) bluescore += 8;

    // Inter-layer connections
    if (redcircles.includes("a1") && redcircles.includes("b1")) redscore += 1;
    if (redcircles.includes("a6") && redcircles.includes("b5")) redscore += 1;
    if (redcircles.includes("a5") && redcircles.includes("b6")) redscore += 1;
    if (redcircles.includes("c2") && redcircles.includes("b3")) redscore += 1;
    if (redcircles.includes("b4") && redcircles.includes("c6")) redscore += 1;
    if (redcircles.includes("b2") && redcircles.includes("c4")) redscore += 1;

    if (bluecircles.includes("a1") && bluecircles.includes("b1")) bluescore += 1;
    if (bluecircles.includes("a6") && bluecircles.includes("b5")) bluescore += 1;
    if (bluecircles.includes("a5") && bluecircles.includes("b6")) bluescore += 1;
    if (bluecircles.includes("c2") && bluecircles.includes("b3")) bluescore += 1;
    if (bluecircles.includes("b4") && bluecircles.includes("c6")) bluescore += 1;
    if (bluecircles.includes("b2") && bluecircles.includes("c4")) bluescore += 1;

    document.querySelector('.red-score').innerHTML = `RED: ${redscore}`;
    document.querySelector('.blue-score').innerHTML = `BLUE: ${bluescore}`;
}

function winner(win) {
    gameEnded = true;
    endSound.currentTime = 0;
    endSound.play().catch(err => console.error("End sound error:", err));
    clearInterval(refreshtotal);
    clearInterval(refreshturn);
    refreshtotal = null;
    refreshturn = null;

    // Delay by 0.5 seconds before showing end screen to allow sounds to start
    setTimeout(() => {
        document.getElementById('main-game').style.display = 'none';
        const winnerText = document.getElementById('winner-text');
        winnerText.textContent = `${win} WINS`;
        document.getElementById('end-screen').style.display = 'flex';
        document.body.style.background = win === 'RED' ? '#ffe6e6' : '#e6f0ff';
    }, 500);
}

function showDrawMessage() {
    gameEnded = true;
    endSound.currentTime = 0;
    endSound.play();
    clearInterval(refreshtotal);
    clearInterval(refreshturn);
    refreshtotal = null;
    refreshturn = null;

    setTimeout(() => {
        document.getElementById('main-game').style.display = 'none';
        const winnerText = document.getElementById('winner-text');
        winnerText.textContent = `IT'S A DRAW`;
        document.getElementById('end-screen').style.display = 'flex';
        document.body.style.background = "#f0f0f0"; // neutral background
    }, 500);
}

function compare(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
}

function inner1() {
    if (gameEnded) return;

    const allFilled = innercircles.every(id => {
        const circle = document.querySelector(`.${id}`);
        return circle && circle.getAttribute('fill') !== 'grey';
    });

    if (allFilled) {
        gameEnded = true;

        if (redscore > bluescore) {
            winner("RED");
        } else if (bluescore > redscore) {
            winner("BLUE");
        } else {
            showDrawMessage();
        }
    }
}

function middleunlocked() {
    // True if all outer circles are filled OR if middle is already unlocked
    if (compare(outercircles, outer) || ismiddleunlocked) {
        ismiddleunlocked = 1;
        return true;
    }
    return false;
}

function innerunlocked() {
    // Unlock only when all middle circles are filled (not grey) at least once OR if inner is already unlocked
    const allMiddleFilled = middlecircles.every(id => {
        const circle = document.querySelector(`.${id}`);
        return circle && circle.getAttribute('fill') !== 'grey';
    });

    if (allMiddleFilled || isinnerunlocked) {
        isinnerunlocked = 1;
        return true;
    }
    return false;
}

function checkAllEliminated() {
    if (phase !== "movement") return;

    const redAlive = redcircles.length;
    const blueAlive = bluecircles.length;

    if (redAlive === 0) {
        setTimeout(() => {
            winner("BLUE");
        }, 1000);
    } else if (blueAlive === 0) {
        setTimeout(() => {
            winner("RED");
        }, 1000);
    }
}

function checkNoMoves() {
    function hasMove(playerCircles) {
        return playerCircles.some(from => {
            const color = document.querySelector(`.${from}`)?.getAttribute('fill');
            if (!color) return false;

            const validNeighbors = (neighbors[from] || []).filter(n => {
                const neighborCircle = document.querySelector(`.${n}`);
                if (!neighborCircle || neighborCircle.getAttribute('fill') === 'red' || neighborCircle.getAttribute('fill') === 'blue') return false;

                // Layer unlocking logic
                if (middlecircles.includes(n) && !middleunlocked()) return false;
                if (innercircles.includes(n) && !innerunlocked()) return false;

                return true;
            });
            return validNeighbors.length > 0;
        });
    }

    const redHasMove = hasMove(redcircles);
    const blueHasMove = hasMove(bluecircles);

    if (!redHasMove && redcircles.length > 0) { // Check if there are still pieces before declaring no moves
        setTimeout(() => {
            winner("BLUE");
        }, 100);
    } else if (!blueHasMove && bluecircles.length > 0) {
        setTimeout(() => {
            winner("RED");
        }, 100);
    }
}

// =========================================
// Core Game Logic (Placement, Movement, Elimination)
// =========================================

function click(circ) {
    if (paused || gameEnded) return;

    const circle = document.querySelector(`.${circ}`);
    if (!circle) return;

    if (phase === "placement") {
        if (circle.getAttribute('fill') !== 'grey') return; // Cannot place on an already filled circle

        // Determine which layer the circle belongs to and check unlock conditions
        if (outercircles.includes(circ)) {
            if (!outer.includes(circ)) outer.push(circ);
        } else if (middlecircles.includes(circ)) {
            if (!middleunlocked()) return;
            if (!middle.includes(circ)) middle.push(circ);
        } else if (innercircles.includes(circ)) {
            if (!innerunlocked()) return;
            if (!inner.includes(circ)) inner.push(circ);
        }

        let color = null;
        if (currentTurn === 0 && redPlaced < 4) {
            color = 'red';
            redPlaced++;
        } else if (currentTurn === 1 && bluePlaced < 4) {
            color = 'blue';
            bluePlaced++;
        } else {
            return; // Max pieces placed for current turn's player
        }

        circle.setAttribute('fill', color);
        if (color === 'red') redcircles.push(circ);
        else bluecircles.push(circ);

        moveSound.currentTime = 0;
        moveSound.play();

        // Reset turn timer for the next turn
        turnseconds = 20;
        clearInterval(refreshturn);
        refreshturn = setInterval(turncountdown, 1000);
        turncountdown(); // Call immediately to update display

        checkElimination(); // Check for eliminations after placing

        // Switch turn immediately for placement phase
        if (redPlaced < 4 || bluePlaced < 4) {
            currentTurn = 1 - currentTurn;
            updateTurnVisuals();
        }

        // Delay score and phase transition to allow elimination visuals
        setTimeout(() => {
            redcircles = redcircles.filter(id => {
                const c = document.querySelector(`.${id}`);
                return c && c.getAttribute('fill') === 'red';
            });
            bluecircles = bluecircles.filter(id => {
                const c = document.querySelector(`.${id}`);
                return c && c.getAttribute('fill') === 'blue';
            });

            // Only check for elimination if both players have placed their pieces
            if (redPlaced >= 4 && bluePlaced >= 4) {
                if (redcircles.length === 0) {
                    winner("BLUE");
                    return;
                }
                if (bluecircles.length === 0) {
                    winner("RED");
                    return;
                }

                phase = "movement";
                currentTurn = 0; // Red starts movement
                updateTurnVisuals();
                checkNoMoves();
            }

            score();
            setTimeout(inner1, 100);
        }, 200);
    } else if (phase === "movement") {
        movement(circ);
    }
}

function movement(circ) {
    const circle = document.querySelector(`.${circ}`);
    const fill = circle.getAttribute('fill');

    if (!selectedCircle) {
        // Select a piece if it belongs to the current player
        if ((currentTurn === 0 && redcircles.includes(circ)) ||
            (currentTurn === 1 && bluecircles.includes(circ))) {
            selectedCircle = circ;
            circle.setAttribute('stroke', 'yellow');
        }
        return;
    }

    const from = selectedCircle;
    const to = circ;
    const fromCircle = document.querySelector(`.${from}`);
    const toCircle = document.querySelector(`.${to}`);

    // Invalid move conditions
    if (from === to || !neighbors[from]?.includes(to) || toCircle.getAttribute('fill') !== 'grey') {
        resetSelection();
        return;
    }

    // Layer unlock checks for destination
    if (middlecircles.includes(to) && !middleunlocked()) {
        resetSelection();
        return;
    }
    if (innercircles.includes(to) && !innerunlocked()) {
        resetSelection();
        return;
    }

    const color = fromCircle.getAttribute('fill');

    // Perform the move
    fromCircle.setAttribute('fill', 'grey');
    toCircle.setAttribute('fill', color);
    toCircle.setAttribute('stroke', 'black'); // Reset stroke after moving
    moveSound.currentTime = 0;
    moveSound.play();

    // Update player's circle array
    if (color === 'red') {
        redcircles = redcircles.filter(id => id !== from);
        redcircles.push(to);
    } else {
        bluecircles = bluecircles.filter(id => id !== from);
        bluecircles.push(to);
    }

    resetSelection(); // Deselect the piece

    checkElimination(); // Check for eliminations after move
    score(); // Update scores

    // Delay subsequent game logic to allow elimination visuals to complete
    setTimeout(() => {
        if (redcircles.length === 0) {
            winner("BLUE");
            return;
        } else if (bluecircles.length === 0) {
            winner("RED");
            return;
        }

        const nextPlayer = 1 - currentTurn;
        const nextCircles = nextPlayer === 0 ? redcircles : bluecircles;

        const nextHasMoves = nextCircles.some(from => {
            const possible = neighbors[from]?.some(n => {
                const neighborCircle = document.querySelector(`.${n}`);
                if (!neighborCircle || neighborCircle.getAttribute('fill') !== 'grey') return false;
                if (middlecircles.includes(n) && !middleunlocked()) return false;
                if (innercircles.includes(n) && !innerunlocked()) return false;
                return true;
            });
            return possible;
        });

        if (!nextHasMoves) {
            const loser = nextPlayer === 0 ? "RED" : "BLUE";
            const winnerColor = currentTurn === 0 ? "RED" : "BLUE";
            // alert(`${loser} has no valid moves. ${winnerColor} wins!`); // Alert removed for smoother UX
            winner(winnerColor);
            return;
        }

        // Switch turn and reset turn timer
        currentTurn = nextPlayer;
        updateTurnVisuals();
        turnseconds = 20;
        clearInterval(refreshturn);
        refreshturn = setInterval(turncountdown, 1000);

        setTimeout(inner1, 500); // Check inner ring win condition after a delay
    }, 700); // Wait for visuals
}

function checkElimination() {
    const allCircles = [...outercircles, ...middlecircles, ...innercircles];
    const eliminations = [];

    allCircles.forEach(circ => {
        const circle = document.querySelector(`.${circ}`);
        const color = circle?.getAttribute('fill');

        if (color !== 'red' && color !== 'blue') return;

        const enemy = color === 'red' ? 'blue' : 'red';
        const neighs = neighbors[circ] || [];

        if (neighs.length < 2) return; // Need at least two neighbors to be surrounded

        const surrounded = neighs.every(n => {
            const neighborCircle = document.querySelector(`.${n}`);
            return neighborCircle && neighborCircle.getAttribute('fill') === enemy;
        });

        if (surrounded) {
            eliminations.push({ circ, color });
        }
    });

    if (eliminations.length > 0) {
        setTimeout(() => { // Delay elimination to allow visual processing
            eliminations.forEach(({ circ, color }) => {
                const circle = document.querySelector(`.${circ}`);
                circle.setAttribute('fill', 'grey'); // Set to grey (eliminated)
                eliminateSound.currentTime = 0;
                eliminateSound.play();

                // Remove from player's active circles
                if (color === 'red') {
                    redcircles = redcircles.filter(c => c !== circ);
                } else {
                    bluecircles = bluecircles.filter(c => c !== circ);
                }

                // Remove from layer tracking arrays (if present)
                outer = outer.filter(c => c !== circ);
                middle = middle.filter(c => c !== circ);
                inner = inner.filter(c => c !== circ);
            });

            score(); // Update score after eliminations

            if (phase === "movement") {
                // Delay winner checks to allow UI to update after eliminations
                setTimeout(() => {
                    if (redcircles.length === 0) {
                        winner("BLUE");
                    } else if (bluecircles.length === 0) {
                        winner("RED");
                    } else {
                        checkNoMoves(); // Re-check for no moves if game continues
                    }
                    setTimeout(inner1, 500);
                }, 700); // Additional delay for visual sync
            } else {
                setTimeout(inner1, 500); // For placement phase
            }
        }, 120); // Short delay before elimination starts
    }
}

// =========================================
// Timer Functions
// =========================================

function resetTimers() {
    clearInterval(refreshtotal);
    clearInterval(refreshturn);

    refreshtotal = setInterval(totalcountdown, 1000);
    refreshturn = setInterval(turncountdown, 1000);
}

function totalcountdown() {
    if (paused || gameEnded) return;

    if (currentTurn === 0) {
        const minutes = '0' + Math.floor(redseconds / 60);
        let seconds = redseconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        const countdown = document.querySelector('#red');
        countdown.innerHTML = `RED TIME: ${minutes}:${seconds}`;
        redseconds--;
        if (redseconds < 0) {
            clearInterval(refreshtotal);
            countdown.innerHTML = "RED TIME: 00:00";
            winner("BLUE");
        }
    } else {
        const minutes = '0' + Math.floor(blueseconds / 60);
        let seconds = blueseconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        const countdown = document.querySelector('#blue');
        countdown.innerHTML = `BLUE TIME: ${minutes}:${seconds}`;
        blueseconds--;
        if (blueseconds < 0) {
            clearInterval(refreshtotal);
            countdown.innerHTML = "BLUE TIME: 00:00";
            winner("RED");
        }
    }
}

function turncountdown() {
    if (paused || gameEnded) return;

    const minutes = '0' + Math.floor(turnseconds / 60);
    let seconds = turnseconds % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const countdown = document.querySelector('.turn-timer');
    countdown.innerHTML = `TURN TIME: ${minutes}:${seconds}`;
    turnseconds--;

    if (turnseconds < 0) {
        currentTurn = 1 - currentTurn; // Switch turn
        updateTurnVisuals(); // Update background and timer border
        turnseconds = 20; // Reset turn time
        clearInterval(refreshturn); // Clear old interval
        refreshturn = setInterval(turncountdown, 1000); // Start new interval
    }
}

// =========================================
// Game Flow Control (Pause, Reset, Start Screens)
// =========================================

function pause() {
    if (paused) return;
    paused = 1;

    clearInterval(refreshtotal);
    clearInterval(refreshturn);
    refreshtotal = null; // Clear interval IDs
    refreshturn = null;

    allSounds.forEach(sound => {
        sound.wasPlaying = !sound.paused; // Store if sound was playing
        if (!sound.paused) sound.pause();
    });

    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
}

function resume() {
    if (!paused) return;
    paused = 0;

    if (!refreshtotal) refreshtotal = setInterval(totalcountdown, 1000);
    if (!refreshturn) refreshturn = setInterval(turncountdown, 1000);

    allSounds.forEach(sound => {
        if (sound.wasPlaying) sound.play().catch(() => {}); // Resume sounds that were playing
    });

    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
}

function fullyResetGameWithoutWelcome() {
    // Stop any running intervals before resetting
    if (refreshtotal) clearInterval(refreshtotal);
    refreshtotal = null;
    if (refreshturn) clearInterval(refreshturn);
    refreshturn = null;

    // Reset all game state variables
    selectedCircle = null;
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
    blue = 0;
    red = 0;
    outer = [];
    middle = [];
    inner = [];
    paused = 0;
    ismiddleunlocked = 0;
    isinnerunlocked = 0;
    currentTurn = 0;
    redseconds = 300;
    blueseconds = 300;
    turnseconds = 20;
    phase = "placement";
    gameEnded = false;

    // Reset UI elements
    document.querySelector('#red').innerHTML = `RED TIME: 05:00`;
    document.querySelector('#blue').innerHTML = `BLUE TIME: 05:00`;
    document.querySelector('.turn-timer').innerHTML = `TURN TIME: 00:20`;

    // Reset circles visually to grey
    [...outercircles, ...middlecircles, ...innercircles].forEach(id => {
        const circle = document.querySelector(`.${id}`);
        if (circle) {
            circle.setAttribute('fill', 'grey');
            circle.setAttribute('stroke', 'black');
        }
    });

    score(); // Update scores display
    updateTurnVisuals(); // Update turn visuals for initial state

    // Restart timers
    refreshtotal = setInterval(totalcountdown, 1000);
    refreshturn = setInterval(turncountdown, 1000);
    totalcountdown(); // Call immediately to update display
    turncountdown();
}

function reset() {
    // Stop any running intervals before resetting
    if (refreshtotal) clearInterval(refreshtotal);
    refreshtotal = null;
    if (refreshturn) clearInterval(refreshturn);
    refreshturn = null;

    // Reset all game state variables
    selectedCircle = null;
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
    blue = 0;
    red = 0;
    outer = [];
    middle = [];
    inner = [];
    paused = 0;
    ismiddleunlocked = 0;
    isinnerunlocked = 0;
    currentTurn = 0;
    redseconds = 300;
    blueseconds = 300;
    turnseconds = 20;
    phase = "placement";
    gameEnded = false;

    // Reset UI visuals
    document.querySelector('#red').innerHTML = `RED TIME: 05:00`;
    document.querySelector('#blue').innerHTML = `BLUE TIME: 05:00`;
    document.querySelector('.turn-timer').innerHTML = `TURN TIME: 00:20`;

    [...outercircles, ...middlecircles, ...innercircles].forEach(id => {
        const circle = document.querySelector(`.${id}`);
        if (circle) {
            circle.setAttribute('fill', 'grey');
            circle.setAttribute('stroke', 'black');
        }
    });

    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
    updateTurnVisuals();
    score();

    // Restart intervals
    refreshtotal = setInterval(totalcountdown, 1000);
    refreshturn = setInterval(turncountdown, 1000);
    totalcountdown();
    turncountdown();

    // Show welcome screen again
    document.getElementById('main-game').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.body.style.background = "rgb(136, 247, 190)";
}


// =========================================
// Initialization and Event Listeners
// =========================================

// showWelcomeMessage() function removed as it seems to be an old/unused version
// Replaced by direct calls to display start screen.

window.addEventListener('DOMContentLoaded', () => {
    initializeGameUI(); // Initial setup of the game UI and state

    // Event listener for the "Continue" button on the start screen
    const continueBtn = document.getElementById('continue-button');
    if (continueBtn) {
        continueBtn.onclick = () => { // Using onclick for simplicity, addEventListener is better for multiple handlers
            // Hide start screen, show main game UI
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('main-game').style.display = 'block';

            // Play the start sound
            startSound.currentTime = 0;
            startSound.play().catch(err => {
                console.error('Autoplay error for start sound:', err);
            });

            // Start a fresh game without returning to welcome
            fullyResetGameWithoutWelcome();
        };
    }

    // Event listener for the "Continue" button on the end screen (after win/loss/draw)
    const endContinueBtn = document.getElementById('end-continue-button');
    if (endContinueBtn) {
        endContinueBtn.onclick = () => {
            // Go back to welcome screen (start screen)
            document.getElementById('end-screen').style.display = 'none';
            document.getElementById('start-screen').style.display = 'flex';
            document.body.style.background = "rgb(136, 247, 190)";
        };
    }
});
