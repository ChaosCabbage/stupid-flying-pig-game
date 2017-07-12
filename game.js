function runGame() {

    const canvasElement = document.getElementById("game");
    const ctx = canvasElement.getContext("2d");
    
    const pigImage = new Image();
    pigImage.src = 'pig.png';

    const planeImage = new Image();
    planeImage.src = 'plane.png';

    const pig = {
        x: 484,
        y: 590,
        speed: 5
    };

    let planes = [];

    let score = 0;

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

    pigImage.onload = function () {
        planeImage.onload = function() {
            begin();
        }
    }

    var spawner;
    var planeTime = 3000;

    function begin() {
        spawnPlane();
        loop();
    }

    function spawnPlane() {
        planes.push({
            x: 1000,
            y: Math.random() * 400
        }); 

        spawner = setTimeout(spawnPlane, planeTime);
    }

    function loop() {
        clear();
        updatePig();
        drawPig();

        planes.forEach(plane => {
            updatePlane(plane);
            drawPlane(plane);
        });

        if (planes.some(isHittingPig)) {
            return gameOver();
        }

        cullPlanes();
        drawScore();
        
        window.requestAnimationFrame(loop);
    }

    function clear() {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, 1000, 600);
    }

    function updatePig() {
        pig.y -= pig.speed;
        if (keys.left) { pig.x -= 2; }
        if (keys.right) { pig.x += 2; }
        if (keys.up) { pig.y -= 2; }
        if (keys.down) { pig.y += 2; }
        if (pig.x < 0) { pig.x = 0; }
        if (pig.x > 1000) { pig.x = 1000; }
        if (pig.y < 0) {
            nextLevel();
        }
    }

    function nextLevel() {
        pig.y = 590;
        pig.speed += 1;
        planeTime = Math.max(planeTime - 50, 500);
        score++;
    }

    function drawPig() {
        ctx.drawImage(pigImage, pig.x - 32, pig.y - 32);        
    }

    function updatePlane(plane) {
        plane.x -= 5;
    }

    function cullPlanes() {
        planes = planes.filter(plane => plane.x > 0);
    }

    function drawPlane(plane) {
        ctx.drawImage(planeImage, plane.x - 32, plane.y - 16);        
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
        clearInterval(spawner);
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game the fuck Over",300,200);
        ctx.fillText("You scored " + score,350,280);
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(score,10,50);
    }
}
