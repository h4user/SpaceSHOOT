let GAME_WIDTH;
let GAME_HEIGHT;
let phone;
if (window.innerWidth >= 800) {
	 phone = false;
	 GAME_WIDTH = 1200;
	 GAME_HEIGHT = 635;
} else{
	phone = true;
	GAME_WIDTH = 400;
	GAME_HEIGHT = 635;
}
function init() {
	const container = document.querySelector(".game");
	create_player(container);
}
const GAME_STATE = {
	leftPressed: false,
	rightPressed: false,
	spacePressed: false,
	playerX: 0,
	playerY: 0,
	lastTime: Date.now(),
	PLAYER_COOLDOWN: 0,
	lasers: []
};
const container = document.querySelector(".game");
const KEY_CODE_LEFT = 65;
const KEY_CODE_RIGHT = 68;
const KEY_CODE_SPACE = 32;
const PLAYER_WIDTH = 0;
let PLAYER_SPEED = 600;
let LASER_SPEED = 700;
const LASER_COOLDOWN = 0.5;
init();
function update(e) {
	const currentTime = Date.now();
	const DT = (currentTime - GAME_STATE.lastTime) / 1000.0;
	GAME_STATE.lastTime = currentTime;
	window.requestAnimationFrame(update);
	updatePlayer(DT, container);
	updateLasers(DT, container);
}
window.requestAnimationFrame(update);
function create_player(container) {
	GAME_STATE.playerX = GAME_WIDTH / 2;
	GAME_STATE.playerY = window.innerHeight - 120;

	const player = document.createElement("img");
	player.src = "img/Player/Ship_01.png";
	player.className = "player";
	container.appendChild(player);
	setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}
function setPosition(elem, x, y) {
	elem.style.transform = 'translate('+x+'px,'+y+'px)';
}
function onKeyDown(e) {
	if(e.keyCode == KEY_CODE_LEFT) {
		GAME_STATE.leftPressed = true;

	}
	if(e.keyCode == KEY_CODE_RIGHT) {
		GAME_STATE.rightPressed = true;

	}
	if(e.keyCode == KEY_CODE_SPACE) {
		GAME_STATE.spacePressed = true;
	}
}
function onKeyUp(e) {
	if(e.keyCode == KEY_CODE_LEFT) {
		GAME_STATE.leftPressed = false;
	}
	if(e.keyCode == KEY_CODE_RIGHT) {
		GAME_STATE.rightPressed = false;
	}
	if(e.keyCode == KEY_CODE_SPACE) {
		GAME_STATE.spacePressed = false;
	}
}
function updatePlayer(DT) {
	if(GAME_STATE.leftPressed) {
		GAME_STATE.playerX-=DT * PLAYER_SPEED;
	}
	if(GAME_STATE.rightPressed) {
		GAME_STATE.playerX+=DT * PLAYER_SPEED;
	}
	if(GAME_STATE.spacePressed && GAME_STATE.PLAYER_COOLDOWN <= 0) {
		createLaser(container, GAME_STATE.playerX, GAME_STATE.playerY);
		GAME_STATE.PLAYER_COOLDOWN = LASER_COOLDOWN;
	}
	if(GAME_STATE.PLAYER_COOLDOWN > 0) {
		GAME_STATE.PLAYER_COOLDOWN -= DT;
	}
	const player = document.querySelector(".player");
	GAME_STATE.playerX = clamp(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - 40,)
	setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const SHOOOOOT = document.querySelector(".SHOOOOOT");
left.addEventListener('touchstart', function(event){
		GAME_STATE.leftPressed = true;
});
right.addEventListener('touchstart', function(event){
		GAME_STATE.rightPressed = true;
});
SHOOOOOT.addEventListener('touchstart', function(event){
		GAME_STATE.spacePressed = true;
});
left.addEventListener('touchend', function(event){
		GAME_STATE.leftPressed = false;
});
right.addEventListener('touchend', function(event){
		GAME_STATE.rightPressed = false;
});
SHOOOOOT.addEventListener('touchend', function(event){
		GAME_STATE.spacePressed = false;
});
function clamp(val, min, max) {
	if(val < min) {
		return min;
	}
	else if(val > max) {
		return max;
	}
	else {
		return val
	}
}
function createLaser(container, x, y) {
	const element = document.createElement("img");
	element.src = "img/Bullets/BulletA_1.png";
	element.className = "laser";
	container.appendChild(element);
	const laser = {x, y, element};
	GAME_STATE.lasers.push(laser);
	setPosition(element, x - 31.5 , y);
}
function updateLasers(DT, container) {
	const lasers = GAME_STATE.lasers;
	for(let i = 0; i < lasers.length; i++) {
		const laser = lasers[i];
		laser.y -= DT * LASER_SPEED;
		if(laser.y < 0) {
			destroyLaser(container, laser);
		}
		setPosition(laser.element, laser.x -31.5, laser.y);
	}
	GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}
function destroyLaser(container, laser) {
	container.removeChild(laser.element);
	laser.isDead = true;
}
