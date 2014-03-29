// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Mayor modifications(monsters,collisions,movements,positions,texts,weapons,sounds,menus,style,localstorage,offline navigation)
// by Jonathan Laguna <jlciudad91@gmail.com> for DAT. 

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
	render();
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

//sword image
var swordReady = false;
var swordImage = new Image();
swordImage.onload = function () {
	swordReady = true;
};
swordImage.src = "images/sword.png";

//shield image
var shieldReady = false;
var shieldImage = new Image();
shieldImage.onload = function () {
	shieldReady = true;
};
shieldImage.src = "images/shield.png";

var ringReady = false;
var ringImage = new Image();
ringImage.onload = function () {
	ringReady = true;
};
ringImage.src = "images/ring.png";

//sounds
var sndmonster = new Audio("sounds/monster.mp3");
var sndstone = new Audio("sounds/stone.mp3");
var sndgameover1 = new Audio("sounds/gameover1.mp3");
var sndgameover2 = new Audio("sounds/gameover2.mp3");
var sndsword = new Audio("sounds/sword.mp3");
var sndshield = new Audio("sounds/shield.mp3");
var sndring = new Audio("sounds/ring.mp3");
var sndprincess = new Audio("sounds/princess.mp3");
var sndvictory = new Audio("sounds/victory.mp3");
var sndintro = new Audio("sounds/music(wolfblood).mp3");
var sndsave = new Audio("sounds/save.mp3");
var sndload = new Audio("sounds/load.mp3");
var sndremove =  new Audio("sounds/remove.mp3");
var sndpause =  new Audio("sounds/pause.mp3");
var sndresume = new Audio("sounds/resume.mp3");
var sndstart = new Audio("sounds/start.mp3");
var snderror = new Audio("sounds/error.mp3");
sndintro.loop=true;
sndintro.play();


// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var sword = {};
var shield = {};
var ring = {};
var stones= new Array();
var monsters = new Array();

// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var intouch = function  (obj1,obj2) {
	if (obj1.x <= (obj2.x + 31) && obj2.x <= (obj1.x + 31)&& obj1.y <= (obj2.y + 31) && obj2.y <= (obj1.y + 31))
		return true;
	else
		return false;
};


var initpos = function(type) {
	if ((type == "monster" || type == "princess") && (princessesCaught>=4)) {
		var posx = Math.random() * canvas.width;
		if (posx >= (hero.x-100) && posx <= hero.x)
			posx = hero.x-100;
		else if (posx <= (hero.x+100) && posx >= hero.x)
			posx = hero.x+100;
		else
			posx = posx;
		var posy = Math.random() * canvas.height;
		if (posy >= (hero.y-100) && posy <= hero.y)
			posy = hero.y-100;
		else if (posy <= (hero.y+100) && posy >= hero.y)
			posy = hero.y+100;
		else
			posy = posy;
	}else{
		var posx = Math.random() * canvas.width;
		var posy = Math.random() * canvas.height;
	}
	var posxobj;
	var posyobj;
	if (posx <= 32 )
		posxobj = 33 ;
	else if (posx+32 >= canvas.width - 32)
		posxobj = canvas.width - 64 ;
	else
		posxobj = posx;
	if (posy <= 32)
		posyobj = 33;
	else if (posy+32 >= canvas.height - 32)
		posyobj = canvas.height - 64;
	else
		posyobj = posy;
	return [posxobj,posyobj];
};



// Reset the game when the player catches a princess
var reset = function () {
	sword={};
	if (power==true)
		power=false;
	shield={};
	if (protection==true)
		protection=false;
	ring={};
	if (lord==true)
		lord = false;

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	[princess.x,princess.y]=initpos("princess");


	if (princessesCaught>=8){
		nummonsters=4;
		numstones=40;
		if (princessesCaught>=9)
			speedmonster = 200;
		else
			speedmonster = 150;
		[sword.x,sword.y]=initpos("sword");
		[ring.x,ring.y]=initpos("ring");
	}else if (princessesCaught>=4){
		if (princessesCaught>=6){
			nummonsters = 3;
			numstones=35;
		}else{
			nummonsters=2;
			numstones=30;
		}	
		speedmonster = 70 + princessesCaught*10;
		[sword.x,sword.y]=initpos("sword");
		[shield.x,shield.y]=initpos("shield");
	}else{
		nummonsters=1;
		speedmonster = 60 + princessesCaught*30;
		numstones=(princessesCaught+1)*4;

	}
	stones=new Array(numstones);
	monsters=new Array(nummonsters)

	for(var i=0;i<monsters.length;i++){
		monsters[i]={speed: speedmonster};
		var monsterok=false;
		while (monsterok!=true){
			[monsters[i].x,monsters[i].y]=initpos("monster");
			if ( !intouch(monsters[i],princess) && !intouch(monsters[i],hero) )
				monsterok=true;
		}		
	}
	for(var i=0;i<stones.length;i++){
		var stoneok = false;
		stones[i] = {};
		while (stoneok != true){
			[stones[i].x,stones[i].y]=initpos("stone");
			if ( !intouch(stones[i],princess) && !intouch(stones[i],hero) && !intouch(stones[i],sword) &&  !intouch(stones[i],shield) && !intouch(stones[i],ring)){
				stoneok=true;
				for (var z=0;z<monsters.length;z++){
					if ( intouch(stones[i],monsters[z]) ){
						stoneok = false;	
						break;	
					}	
				}	
			}		
		}	
	}
};



var movetodown=function(modifier,obj,sizemove,sizecollision){
	var collisiondown = false;
	if (obj.y+32 < canvas.height-32){
		for(var i=0;i<stones.length;i++){
			if( (obj.y+33) >= stones[i].y && obj.y<stones[i].y ) {
				if (!(obj.x > (stones[i].x+28) || obj.x+30 < stones[i].x)){
					collisiondown=true;
					break;
				}	
			}	
		}	
		if (collisiondown==false)
			obj.y += sizemove;
		else{
			if (obj == hero && power){
				sndstone.play();
				stones.splice(stones.indexOf(stones[i]), 1);
			}else{
				obj.y -= sizecollision;
			}	
		}	
	}else{
		obj.y -= sizecollision;
	}			
};
var movetoup=function(modifier,obj,sizemove,sizecollision){
	var collisionup = false;
	if (obj.y > 30){
		for(var i=0;i<stones.length;i++){
			if ( obj.y <= (stones[i].y+31) && (obj.y + 32)>(stones[i].y+30) ){
				if (!(obj.x > (stones[i].x+28) || obj.x+30 < stones[i].x)){
					collisionup = true;
					break;
				}	
			}
		}
		if (collisionup==false)
			obj.y -= sizemove;
		else{
			if (obj == hero && power){
				sndstone.play();
				stones.splice(stones.indexOf(stones[i]), 1);
			}else{	
				obj.y += sizecollision;	
			}	
		}			
	}else{
		obj.y += sizecollision;
	}	
};
var movetoright=function(modifier,obj,sizemove,sizecollision){
	var collisionright = false;
	if (obj.x+32 < canvas.width-30){
		for(var i=0;i<stones.length;i++){
			if ((obj.x+33) >= stones[i].x && obj.x < stones[i].x ){
				if (!( obj.y > (stones[i].y+28)  ||  obj.y+30 < stones[i].y )){
					collisionright=true;
					break;	
				}
			}
		}	
		if (collisionright==false)
			obj.x += sizemove;
		else{
			if (obj == hero && power){
				sndstone.play();
				stones.splice(stones.indexOf(stones[i]), 1);
			}else{
				obj.x -= sizecollision;
			}		
		}	
	}else{	
		obj.x -= sizecollision;
	}	
};
var movetoleft=function(modifier,obj,sizemove,sizecollision){
	var collisionleft = false;
	if (obj.x > 30){
		for(var i=0;i<stones.length;i++){
			if (obj.x <= (stones[i].x+31) && (obj.x+32) > (stones[i].x+30) ){
				if (!( obj.y > (stones[i].y+28)  ||  obj.y+30 < stones[i].y )){
					collisionleft=true;
					break;
				}	
			}
		}	
		if (collisionleft==false)
			obj.x -= sizemove;
		else{
			if (obj == hero && power){
				sndstone.play();
				stones.splice(stones.indexOf(stones[i]), 1);
			}else{
				obj.x += sizecollision;
			}
		}
			
	}else{	
		obj.x += sizecollision;
	}	
};



// Update game objects
var update = function (modifier) {
	if (38 in keysDown) // Player holding up
		movetoup(modifier,hero,hero.speed * modifier,0);
	if (40 in keysDown) // Player holding down
		movetodown(modifier,hero,hero.speed * modifier,0);	
	if (37 in keysDown) // Player holding left
		movetoleft(modifier,hero,hero.speed * modifier,0);
	if (39 in keysDown) // Player holding right
		movetoright(modifier,hero,hero.speed * modifier,0);

	for(var i=0;i<monsters.length;i++){
		if (monsters[i].y > hero.y)
			movetoup(modifier,monsters[i],monsters[i].speed * modifier,5);
		else if (monsters[i].y < hero.y)
			movetodown(modifier,monsters[i],monsters[i].speed * modifier,5);		
		else
			monsters[i].y = monsters[i].y;

		if (monsters[i].x > hero.x)
			movetoleft(modifier,monsters[i],monsters[i].speed * modifier,5);
		else if (monsters[i].x < hero.x)
			movetoright(modifier,monsters[i],monsters[i].speed * modifier,5);
		else
			monsters[i].x = monsters[i].x;

		if ( intouch(princess,monsters[i])){
			if (!lord){
				gameover2=true;
				sndgameover2.play();
			}	
		}	

		if (intouch(hero,monsters[i])){
			if (power){
   				monsters.splice(monsters.indexOf(monsters[i]), 1);
   				sndmonster.play();
			}else{
				if (!(protection || lord)){
					gameover1=true; 
					sndgameover1.play();
				}
			}		
		}	

	}
	// Are they touching?
	if (intouch(hero,princess)) {
		++princessesCaught;
		if (princessesCaught == 10){
			end = true;
			sndvictory.play();
		}else{
			sndprincess.play();
			reset();
		}
		
	}
	if (intouch(hero,sword)){
		sndsword.play();
		power=true;
		delete sword.x;
		delete sword.y;
	}
	if (intouch(hero,shield)){
		sndshield.play();
		protection=true;
		delete shield.x;
		delete shield.y;
	}
	if (intouch(hero,ring)){
		sndring.play();
		lord=true;
		delete ring.x;
		delete ring.y;
	}			
};

// Draw everything
var render = function () {
	if (bgReady)
		ctx.drawImage(bgImage, 0, 0);
	if (heroReady) 
		ctx.drawImage(heroImage, hero.x, hero.y);
	if (princessReady) 
		ctx.drawImage(princessImage, princess.x, princess.y);
	if (swordReady) 
		ctx.drawImage(swordImage, sword.x, sword.y);
	if (shieldReady) 
		ctx.drawImage(shieldImage, shield.x, shield.y);
	if (ringReady) 
		ctx.drawImage(ringImage, ring.x, ring.y);
	if (stoneReady) {
		for (var i=0;i<stones.length;i++)
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
	}
	for(var i=0;i<monsters.length;i++){
		if (monsterReady) 
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
	}
	// Info
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "bold 22px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if (stop){	
		ctx.fillText("Pause - Press space to resume",95, 0);
		ctx.fillText("s: save data   l: load data   r: remove data", 45, canvas.height-24);
	}else if (begin){
		ctx.fillText("Press space to start the game!",95, 200);
	}else if (gameover1){
		ctx.fillText("Princesses saved: " + princessesCaught, 150, 0);	
		ctx.fillText("You are dead! Press space to try again", 60, canvas.height-24);	
	}else if (gameover2){
		ctx.fillText("Princesses saved: " + princessesCaught, 150, 0);	
		ctx.fillText("Princess is dead! Press space to try again", 40, canvas.height-24);
	}else if (end){
		ctx.fillText("Princesses saved: " + princessesCaught, 150, 0);	
		ctx.fillText("You are the Hero! Press space to start again", 23, canvas.height-24);
	}else{	
		ctx.fillText("Princesses saved: " + princessesCaught, 150, 0);
		if (lord)
			ctx.fillText("You've found the only Ring!", 110, canvas.height-24);
		else if(protection)
			ctx.fillText("You've found the Shield!", 130, canvas.height-24);
		else if(power)
			ctx.fillText("You've found the Sword!", 130, canvas.height-24);
		else
			ctx.fillText("", 145, canvas.height-24);				
	}
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	if (!gameover1 && !gameover2 && !stop && !end && !begin){
		update(delta / 1000);
		render();
	}
	then = now;
};

var stop = false;
var gameover1 = false;
var gameover2 = false;
var power = false;
var protection = false;
var lord = false;
var end = false;
var begin = true;
var numstones = 0;
var nummonsters = 0;
var speedmonster = 0;
var princessesCaught = 0;



document.onkeypress=function(event){
	if (event.which==32){
		if (gameover1 || gameover2 || end){
			if (end)
				sndstart.play();
			princessesCaught = 0;
			gameover1 = false;
			gameover2 = false;
			end = false;
			reset();
		}else{
			if (begin){
				begin = false;
				sndintro.pause();
				sndstart.play();
			}else{
				if (stop){
					stop = false;
					sndresume.play();
				}else{
					stop = true;
					sndpause.play();
					render();
				}	
			}
	
		}	
	}
	if ((event.which==108) && stop){
		if (localStorage.length !== 0){
			princessesCaught=localStorage.getItem("pc");
			monsters = JSON.parse(localStorage.getItem("m"));
			stones = JSON.parse(localStorage.getItem("st"));
			hero = JSON.parse(localStorage.getItem("h"));
			princess = JSON.parse(localStorage.getItem("p"));
			sword = JSON.parse(localStorage.getItem("sw"));
			shield = JSON.parse(localStorage.getItem("sh"));
			ring = JSON.parse(localStorage.getItem("r"));
			power = JSON.parse(localStorage.getItem("pow"));
			protection = JSON.parse(localStorage.getItem("prot"));
			lord = JSON.parse(localStorage.getItem("l"));
			sndload.play();
		}else{
			snderror.play();
		}
	}
	if ((event.which==115) && stop){
		localStorage.setItem("pc", princessesCaught);
		localStorage.setItem("m", JSON.stringify(monsters));
		localStorage.setItem("st", JSON.stringify(stones));
		localStorage.setItem("h", JSON.stringify(hero));
		localStorage.setItem("p", JSON.stringify(princess));
		localStorage.setItem("sw", JSON.stringify(sword));
		localStorage.setItem("sh", JSON.stringify(shield));
		localStorage.setItem("r", JSON.stringify(ring));
		localStorage.setItem("pow", JSON.stringify(power));
		localStorage.setItem("prot", JSON.stringify(protection));
		localStorage.setItem("l", JSON.stringify(lord));
		sndsave.play();
	}
	if ((event.which==114) && stop){
		localStorage.clear();
		sndremove.play();
	}
};


// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
