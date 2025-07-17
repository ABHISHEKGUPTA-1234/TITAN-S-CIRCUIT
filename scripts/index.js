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
let phase = "placement";
let selectedCircle = null;
let redPlaced = 0;
let bluePlaced = 0;
let redscore = 0;
let bluescore = 0;
let redseconds = 300;
let blueseconds = 300;
let turnseconds = 20;
let refreshtotal = null;
let refreshturn = null;
const outercircles = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
const middlecircles = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
const innercircles = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];
const neighbors = {
    c1: ['c2', 'c6'], c2: ['c1', 'c3', 'b3'], c3: ['c2', 'c4'],
    c4: ['c3', 'c5', 'b2'], c5: ['c4', 'c6'], c6: ['c1', 'c5', 'b4'],
    b1: ['a1', 'b3', 'b4'], b2: ['b5', 'b6', 'c4'], b3: ['b1', 'b6', 'c2'],
    b4: ['b1', 'b5', 'c6'], b5: ['b2', 'b4', 'a6'], b6: ['b2', 'b3', 'a5'],
    a1: ['b1', 'a3', 'a4'], a2: ['a5', 'a6'], a3: ['a1', 'a5'],
    a4: ['a1', 'a6'], a5: ['a2', 'a3', 'b6'], a6: ['a2', 'a4', 'b5'],
};
const moveSound = new Audio('../sounds/placment timer.mp3');
const startSound = new Audio('../sounds/start.mp3');
const buttonClickSound = new Audio('../sounds/button.mp3');
const eliminateSound = new Audio('../sounds/eliminate.mp3');
const endSound = new Audio('../sounds/end.mp3');
endSound.preload = 'auto';
eliminateSound.preload = 'auto';
buttonClickSound.preload = 'auto';
moveSound.preload = 'auto';
startSound.preload = 'auto';
const allSounds = [moveSound, startSound, buttonClickSound, eliminateSound, endSound];
function initializeGameUI() {
    selectedCircle = null;
    phase = "placement";
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
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
    updateTurnVisuals();
    document.body.style.transition = "background 2s ease";
    document.body.style.background = "rgb(136, 247, 190)";
    document.getElementById('main-game').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('end-screen').style.display = 'none';
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
    if (currentTurn === 0) {
        timer.style.background = "linear-gradient(45deg, #4d0000, #660000)"; // red style
        timer.style.borderColor = "#ff4d4d";
    } 
    else {
        timer.style.background = "linear-gradient(45deg, #003366, #004080)"; // blue style
        timer.style.borderColor = "#4da8ff";
    }
    document.body.style.transition = "background 2s ease";
    document.body.style.background = currentTurn === 0 ? "#ffe6e6" : "#e6f0ff"; // red or blue tint
}
function score() {
    redscore = 0;
    bluescore = 0;
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
    setTimeout(() => {
        document.getElementById('main-game').style.display = 'none';
        const winnerText = document.getElementById('winner-text');
        if (win === 'RED' || win === 'BLUE') {
            winnerText.textContent = `${win} WINS`;
            document.body.style.background = win === 'RED' ? '#ffe6e6' : '#e6f0ff';
        } 
        else {
            winnerText.textContent = `IT'S A DRAW`;
            document.body.style.background = "#f0f0f0";
        }
        document.getElementById('end-screen').style.display = 'flex';
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
        if (redscore > bluescore) winner("RED");
        else if (bluescore > redscore) winner("BLUE");
        else winner("DRAW");
    }
}
function middleunlocked() {
    if (compare(outercircles, outer) || ismiddleunlocked) {
        ismiddleunlocked = 1;
        return true;
    }
    return false;
}
function innerunlocked() {
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
                if (middlecircles.includes(n) && !middleunlocked()) return false;
                if (innercircles.includes(n) && !innerunlocked()) return false;
                return true;
            });
            return validNeighbors.length > 0;
        });
    }
    const redHasMove = hasMove(redcircles);
    const blueHasMove = hasMove(bluecircles);
    if (!redHasMove && redcircles.length > 0){
        setTimeout(() => {
            winner("BLUE");
        }, 100);
    } 
    else if (!blueHasMove && bluecircles.length > 0) {
        setTimeout(() => {
            winner("RED");
        }, 100);
    }
}
function click(circ) {
    if (paused || gameEnded) return;
    const circle = document.querySelector(`.${circ}`);
    if (!circle) return;
    if (phase === "placement") {
        if (circle.getAttribute('fill') !== 'grey') return;
        if (outercircles.includes(circ)&&!outer.includes(circ)) outer.push(circ);
        else if (middlecircles.includes(circ)){
            if (!middleunlocked()) return;
            if (!middle.includes(circ)) middle.push(circ);
        } 
        else if (innercircles.includes(circ)) {
            if (!innerunlocked()) return;
            if (!inner.includes(circ)) inner.push(circ);
        }
        let color = null;
        if (currentTurn === 0 && redPlaced < 4) {
            color = 'red';
            redPlaced++;
        } 
        else if (currentTurn === 1 && bluePlaced < 4) {
            color = 'blue';
            bluePlaced++;
        } 
        else return;
        circle.setAttribute('fill', color);
        if (color === 'red') redcircles.push(circ);
        else bluecircles.push(circ);
        moveSound.currentTime = 0;
        moveSound.play();
        turnseconds = 20;
        clearInterval(refreshturn);
        refreshturn = setInterval(turncountdown, 1000);
        turncountdown();
        checkElimination();
        if (redPlaced < 4 || bluePlaced < 4) {
            currentTurn = 1 - currentTurn;
            updateTurnVisuals();
        }
        setTimeout(() => {
            redcircles = redcircles.filter(id => {
                const c = document.querySelector(`.${id}`);
                return c && c.getAttribute('fill') === 'red';
            });
            bluecircles = bluecircles.filter(id => {
                const c = document.querySelector(`.${id}`);
                return c && c.getAttribute('fill') === 'blue';
            });
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
                currentTurn = 0;
                updateTurnVisuals();
                checkNoMoves();
            }
            score();
            setTimeout(inner1, 100);
        }, 200);
    } 
    else if (phase === "movement") movement(circ);
}
function movement(circ) {
    const circle = document.querySelector(`.${circ}`);
    const fill = circle.getAttribute('fill');
    if (!selectedCircle){ 
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
    if (from === to || !neighbors[from]?.includes(to) || toCircle.getAttribute('fill') !== 'grey') {
        resetSelection();
        return;
    }
    if (middlecircles.includes(to) && !middleunlocked()) {
        resetSelection();
        return;
    }
    if (innercircles.includes(to) && !innerunlocked()) {
        resetSelection();
        return;
    }
    const color = fromCircle.getAttribute('fill');
    fromCircle.setAttribute('fill', 'grey');
    toCircle.setAttribute('fill', color);
    toCircle.setAttribute('stroke', 'black');
    moveSound.currentTime = 0;
    moveSound.play();
    if (color === 'red') {
        redcircles = redcircles.filter(id => id !== from);
        redcircles.push(to);
    } 
    else {
        bluecircles = bluecircles.filter(id => id !== from);
        bluecircles.push(to);
    }
    resetSelection();
    checkElimination();
    score();
    setTimeout(() => {
        if (redcircles.length === 0) {
            winner("BLUE");
            return;
        } 
        else if (bluecircles.length === 0) {
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
            winner(winnerColor);
            return;
        }
        currentTurn = nextPlayer;
        updateTurnVisuals();
        turnseconds = 20;
        clearInterval(refreshturn);
        refreshturn = setInterval(turncountdown, 1000);
        setTimeout(inner1, 500);
    }, 700);
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
        if (neighs.length < 2) return;
        const surrounded = neighs.every(n => {
            const neighborCircle = document.querySelector(`.${n}`);
            return neighborCircle && neighborCircle.getAttribute('fill') === enemy;
        });
        if (surrounded) eliminations.push({ circ, color });
    });
    if (eliminations.length > 0) {
        setTimeout(() => { 
            eliminations.forEach(({ circ, color }) => {
                const circle = document.querySelector(`.${circ}`);
                circle.setAttribute('fill', 'grey');
                eliminateSound.currentTime = 0;
                eliminateSound.play();
                if (color === 'red') redcircles = redcircles.filter(c => c !== circ);
                else bluecircles = bluecircles.filter(c => c !== circ);
                outer = outer.filter(c => c !== circ);
                middle = middle.filter(c => c !== circ);
                inner = inner.filter(c => c !== circ);
            });
            score();
            if (phase === "movement") {
                setTimeout(() => {
                    if (redcircles.length === 0) winner("BLUE");
                    else if (bluecircles.length === 0) winner("RED");
                    else checkNoMoves();
                    setTimeout(inner1, 500);
                }, 700);
            } 
            else setTimeout(inner1, 500);
        }, 120);
    }
}
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
    } 
    else {
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
        currentTurn = 1 - currentTurn; 
        updateTurnVisuals(); 
        turnseconds = 20;
        clearInterval(refreshturn);
        refreshturn = setInterval(turncountdown, 1000); 
    }
}
function pause() {
    if (paused) return;
    paused = 1;
    clearInterval(refreshtotal);
    clearInterval(refreshturn);
    refreshtotal = null;
    refreshturn = null;
    allSounds.forEach(sound => {
        sound.wasPlaying = !sound.paused;
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
        if (sound.wasPlaying) sound.play().catch(() => {});
    });
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
}
function fullyResetGameWithoutWelcome() {
    if (refreshtotal) clearInterval(refreshtotal);
    refreshtotal = null;
    if (refreshturn) clearInterval(refreshturn);
    refreshturn = null;
    selectedCircle = null;
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
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
    updateTurnVisuals();
    refreshtotal = setInterval(totalcountdown, 1000);
    refreshturn = setInterval(turncountdown, 1000);
    totalcountdown();
    turncountdown();
}
function reset() {
    if (refreshtotal) clearInterval(refreshtotal);
    refreshtotal = null;
    if (refreshturn) clearInterval(refreshturn);
    refreshturn = null;
    selectedCircle = null;
    redPlaced = 0;
    bluePlaced = 0;
    redcircles = [];
    bluecircles = [];
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
    refreshtotal = setInterval(totalcountdown, 1000);
    refreshturn = setInterval(turncountdown, 1000);
    totalcountdown();
    turncountdown();
    document.getElementById('main-game').style.display = 'none';
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.body.style.background = "rgb(136, 247, 190)";
}
window.addEventListener('DOMContentLoaded', () => {
    initializeGameUI();
    const continueBtn = document.getElementById('continue-button');
    if (continueBtn) {
        continueBtn.onclick = () => {
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('main-game').style.display = 'block';
            startSound.currentTime = 0;
            startSound.play().catch(err => {
                console.error('Autoplay error for start sound:', err);
            });
            fullyResetGameWithoutWelcome();
        };
    }
    const endContinueBtn = document.getElementById('end-continue-button');
    if (endContinueBtn) {
        endContinueBtn.onclick = () => {
            document.getElementById('end-screen').style.display = 'none';
            document.getElementById('start-screen').style.display = 'flex';
            document.body.style.background = "rgb(136, 247, 190)";
        };
    }
});
