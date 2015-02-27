//.. Initialzing
var engine = new LittleGameEngine();
engine.setTitle('Simple Game');
engine.setCanvas('game');
engine.setContextMenu(true, 'contextmenu'); // Standard is false
engine.create();
var m = 0;

//.. Game screen
engine.addScreen('game', function() { 
	engine.addSprite('sun', window.innerWidth - 128,0,128,128, 'image', 'img/sprites/sun/sun.png');
	engine.addSprite('block', 0,window.innerHeight - 250, 250, 250);
	engine.setBackground('img/bg/afternoon/stagnand/background.png');
	engine.setFont(20, 'Arial');
	engine.addSprite('m', window.innerWidth - window.innerWidth/4, 20, 0,0, 'text', 'Meters: ' + m);
	engine.setColor('black');
	document.addEventListener('keydown', function(e){

	var key = e.which || e.keyCode;
	if ( key == 83 ) // Down
	{
		engine.moveSprite('block',engine.sprite['block'][0],engine.sprite['block'][1] + 10, 'down', engine.sprite['block'][2], engine.sprite['block'][3]/*,'image'*/);
	} 
		else if ( key == 68 ) // Right
	{
		m += 10;
		engine.context.clearRect(window.innerWidth - window.innerWidth/4, 20, 20, 20);
		delete engine.sprite['m'];
		engine.addSprite('m', window.innerWidth - window.innerWidth/4, 20, 0,0, 'text', 'Meters: ' + m);

		engine.moveSprite('block',engine.sprite['block'][0] + 10,engine.sprite['block'][1], 'right', engine.sprite['block'][2], engine.sprite['block'][3]/*,'image'*/);
		
	}
		else if ( key == 87 ) // Up
	{
		engine.moveSprite('block',engine.sprite['block'][0],engine.sprite['block'][1] - 10, 'up', engine.sprite['block'][2], engine.sprite['block'][3]/*,'image'*/);
	}
		else if ( key == 65 ) // Left
	{
		if ( m != 0 )
		{
			m -= 10;
			engine.context.clearRect(window.innerWidth - window.innerWidth/4, 20, 20, 20);
			delete engine.sprite['m'];
			engine.addSprite('m', window.innerWidth - window.innerWidth/4, 20, 0,0, 'text', 'Meters: ' + m);
		}
	
		engine.moveSprite('block',engine.sprite['block'][0] - 10,engine.sprite['block'][1], 'left', engine.sprite['block'][2], engine.sprite['block'][3]/*,'image'*/);
	} 

	});

	engine.addFixed('sun');

});

//.. Menu screen
engine.addScreen('menu', function() {
	engine.setBackground('img/mario.gif');
	engine.setFont(60,'Arial');
	engine.addSprite('GameTitle', window.innerWidth/2 - 175,100, 0,0,'text', 'Simple Game');
	engine.addSprite('PlayButton', window.innerWidth/2 - 175, 200, 400, 60, 'rect');
	engine.setColor('white');
	engine.addSprite('PlayText', window.innerWidth/2 - 50, 250, 0,0, 'text', 'Play!');
	engine.canvas.addEventListener('click', gotoGame, false);
	
});

//.. Function for the event handler, is made because you can't delete event handlers that makes use of anonymous functions.
function gotoGame(e)
{
	if ( engine.mouseClick( 'PlayButton', e ) )
	{
		engine.canvas.removeEventListener('click',gotoGame);
		for ( k in engine.sprite )
		{
			delete engine.sprite[k];
		}
		engine.setColor('black');
		engine.clearCanvas();
		engine.gotoScreen('game');
	}
}

//.. When everything has set up, go to the 'menu'-screen.
engine.gotoScreen('menu');
