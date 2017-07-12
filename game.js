function runGame() {

    const canvasElement = document.getElementById("game");
    const ctx = canvasElement.getContext("2d");
    
    const pigImage = new Image();
    pigImage.src = 'pig.png';

    const planeImage = new Image();
    planeImage.src = 'plane.png';

    //-----
    // All of the main variables are defined here.

    // This is, of course, the pig!
    // It has a location and a speed.
    const pig = {
        x: 484,
        y: 590,
        speed: 5
    };

    // This is a list of the planes that are currently on the screen.
    // They just have x and y coordinates.
    let planes = [];

    // The score, which gets increased whenever you hit the end of the screen.
    let score = 0;

    //-----
    // The input controls.
    // 'keys' keeps a record of which arrow keys are currently pressed.
    //
    // We listen for keyup and keydown events, and change the state of this object. 
    const keys = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    function changeKeys(key, onOrOff) {
        if (key == '38') { keys.up = onOrOff; }
        else if (key == '40') { keys.down = onOrOff; }
        else if (key == '37') { keys.left = onOrOff; }
        else if (key == '39') { keys.right = onOrOff; }
    }

    document.addEventListener('keydown', event => changeKeys(event.keyCode, true), false);
    document.addEventListener('keyup', event => changeKeys(event.keyCode, false), false);


    // We need to wait for both images to be loaded before starting the game.
    pigImage.onload = function () {
        planeImage.onload = function() {
            begin();
        }
    }

    function begin() {
        spawnPlanes();
        loop();
    }

    let spawner; // This is set to the timeout which spawns planes.
    let planeTime = 3000; // milliseconds between planes appearing.

    function spawnPlanes() {
        spawnPlane();
        spawner = setTimeout(spawnPlanes, planeTime);        
    }

    // Create a new plane and put it in the list of planes. 
    function spawnPlane() {
        planes.push({
            x: 1000,
            y: Math.random() * 400
        }); 
    }

    //-----
    // The main game logic

    function update() {
        updatePig();
        planes.forEach(updatePlane);
        cullOffscreenPlanes();
    }

    function draw() {
        clear();
        drawPig();
        planes.forEach(drawPlane);
        drawScore();
    }

    // This is the main loop which happens on every frame.
    function loop() {
        update();
        draw();

        if (planes.some(isHittingPig)) {
            gameOver();
        } else {
            window.requestAnimationFrame(loop);
        }        
    }

    function updatePig() {
        pig.y -= pig.speed;
        if (keys.left)  { pig.x -= 2; }
        if (keys.right) { pig.x += 2; }
        if (keys.up)    { pig.y -= 2; }
        if (keys.down)  { pig.y += 2; }
        if (pig.x < 0) { pig.x = 0; }
        if (pig.x > 1000) { pig.x = 1000; }

        if (pig.y < 0) {
            // Off the top of the screen... you did it!
            nextLevel();
        }
    }

    function nextLevel() {
        pig.y = 590;
        pig.speed += 1;
        planeTime = Math.max(planeTime - 50, 500);
        score++;
    }

    function updatePlane(plane) {
        plane.x -= 5;
    }

    function cullOffscreenPlanes() {
        planes = planes.filter(plane => plane.x > 0);
    }

    function isHittingPig(plane) {
        const pigLeft = pig.x - 32;
        const pigRight = pig.x + 32;
        const pigTop = pig.y - 32;
        const pigBottom = pig.y + 32;
        const planeLeft = plane.x - 32;
        const planeRight = plane.x + 32;
        const planeTop = plane.y - 16;
        const planeBottom = plane.y + 16;
        if (pigRight < planeLeft) return false;
        if (pigLeft > planeRight) return false;
        if (pigTop > planeBottom) return false;
        if (pigBottom < planeTop) return false;
        return true;
    }

    function gameOver() {
        clearInterval(spawner); // Stop spawning planes
        drawGameOverText();
    }

    //-----
    // Drawing functions

    function clear() {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, 1000, 600);
    }

    function drawPig() {
        ctx.drawImage(pigImage, pig.x - 32, pig.y - 32);        
    }

    function drawPlane(plane) {
        ctx.drawImage(planeImage, plane.x - 32, plane.y - 16);        
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(score,10,50);
    }

    function drawGameOverText() {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game the fuck Over",300,200);
        ctx.fillText("You scored " + score,350,280);
    }
}
