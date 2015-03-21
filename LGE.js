/*
*  _     ____ _____ 
* | |   / ___| ____|
* | |  | |  _|  _|  
* | |__| |_| | |___ 
* |_____\____|_____|
*                  
* Little Game Engine
*
* @author ItsMeSam
* @license MIT
*
*/

function LittleGameEngine() 
{
	this.title = "LittleGameEngine";
	this.context = null;
	this.canvas;
	this.screen = new Array();
	this.sprite = new Array();
	this.background;
	this.contextmenu = new Array();
	this.fixed = new Array();
	this.stuck = false;
	this.block = false;

}

LittleGameEngine.prototype = {
	constructor: LittleGameEngine,

	/*
	* @param {string} title - Game title, will be used in the document.title
	*/
	setTitle:function( title )
	{
		this.title = title;
	},

	/*
	* @param {string} canvas - Id of the canvas element.
	*/
	setCanvas:function( canvas )
	{
		this.canvas = document.getElementById( canvas );
		this.context = this.canvas.getContext('2d');
	},

	/*
	* @param {string} path - The path of the background image
	*/
	setBackground:function( path )
	{
		this.canvas.style.backgroundImage = 'url(' + path + ')';
	},

	/*
	* @param {boolean} bool  - If true, the contextmenu will be disabled.
	* @param {string} toshow - The element to show on contextmenu, if nothing is set, it will ofcourse show nothing
	*/
	setContextMenu:function( bool, toshow )
	{
		toshow = typeof toshow !== 'undefined' ? toshow : null;
		this.contextmenu.push(bool);
		this.contextmenu.push(toshow);
	},

	create:function()
	{
		document.title = this.title;
		if ( this.context == null )
		{
			console && console.warn('No canvas has been set.');
		} 
		else 
		{
			this.canvas.height = window.innerHeight;
			this.canvas.width = window.innerWidth;
		}

		if ( this.contextmenu[0] )
		{
			if ( this.contextmenu[1] != null )
			{

				var element = document.getElementById(this.contextmenu[1]);
				document.addEventListener('contextmenu', function(e) {
					element.style.top     = e.clientY + 'px';
					element.style.left    = e.clientX + 'px';
					element.style.display = 'block';
					e.preventDefault();
					return false;
				});
				document.addEventListener('mouseup',function(e){
					if( e.target != element && e.target.parentNode != element )
					{
						element.style.display = 'none';
					}
				});
			}
			else
			{
				document.addEventListener('contextmenu', function(e){
					e.preventDefault();
					return false;
				});
			}
		}
	},

	/*
	* @param {string} name     - Name of the screen
	* @param {function} screen - Screen to add
 	*/
 	addScreen:function(name, screen)
 	{
 		this.screen[name] = screen;
 	},

 	/*
 	* @param {string} name - Name of the screen to go to
 	*/
 	gotoScreen:function(name)
 	{
 		this.context.clearRect( 0,0,this.canvas.width,this.canvas.height );
 		if ( this.screen[name] == undefined)
 		{
 			console && console.warn('Selected screen doesn\'t exist');
 		} 
 		else
 		{
 			this.screen[name](); 
 		}
 			
 	},

	/*
	* @param {string} path - Path to the image
	* @param {integer} x - X position of image
	* @param {integer} y - Y position of image
	*/
	addImage:function( path, x, y, w, h )
	{
		w = typeof w !== 'undefined' ? w : null;
		h = typeof h !== 'undefined' ? h : null;
		var self = this;

		var image = new Image();
		image.src = path;

		if( w == null & h == null )
		{
			self.context.drawImage( image,x,y );
		}
		else
		{
			self.context.drawImage( image,x,y,w,h );
		}
		
	},

	/*
	* @param {string} name - The name of the sprite
	* @param {integer} x   - The X coordinate of the sprite
	* @param {integer} y   - The Y coordinate of the sprite
	* @param {integer} w   - The width of the sprite
	* @param {integer} h   - The height of the sprite
	* @param {string} type - Type of the sprite
	* @param {string} path - If it's an image, provide the path here
	*/
	addSprite:function( name, x , y, w, h, type, path )
	{
		type = typeof type !== 'undefined' ? type : 'rect';
		path = typeof path !== 'undefined' ? path : null;

		if( type == 'rect' )
		{
			this.context.fillRect(x,y,w,h);
		}
		else if ( type == 'image' )
		{
			this.addImage( path, x, y, w, h );
		}	
		else if ( type == 'text' )
		{
			this.context.fillText(path, x, y);
		}

		this.sprite[name] = new Array();
		this.sprite[name][0] = x;
		this.sprite[name][1] = y;
		this.sprite[name][2] = w;
		this.sprite[name][3] = h;
		this.sprite[name][4] = type;
		this.sprite[name][5] = path;

	},
	


	/*
	* @param {integer} x       - The new X coördinate
	* @param {integer} y       - The new Y coördinate
	* @param {string} movement - Up, right, left or down. It's needed for collision detection.
	* @param {integer} w       - The new width
	* @param {integer} h       - The new height
	* @param {string} type     - Type of the sprite
	*/
	moveSprite:function( name, x, y, movement, w, h, type)
	{	
		w = typeof w !== 'undefined' ? w : this.sprite[name][2];
		h = typeof h !== 'undefined' ? h : this.sprite[name][3];
		type = typeof type !== 'undefined' ? type : 'rect';

		for ( f in this.fixed )
		{
			if ( this.stuck === false )
			{
				if 
				( 
				  // X

				  /* Left */ this.sprite[this.fixed[f]][0] < this.sprite[name][0] + this.sprite[name][2] && 
				  /* Right */ this.sprite[this.fixed[f]][0] + this.sprite[this.fixed[f]][2]  > this.sprite[name][0] &&

				  // Y

				  /* Bottom */ this.sprite[this.fixed[f]][1] < this.sprite[name][1] + this.sprite[name][3] && 
				  /* Top */ this.sprite[this.fixed[f]][1]  + this.sprite[this.fixed[f]][3] > this.sprite[name][1]
				)
				{
					this.stuck = movement;
					return;
				}
				
			}
			else if ( this.stuck !== false && movement == this.stuck )
			{
				this.block = true;
				return;
			}
			if ( this.stuck !== false && this.block == true && movement != this.stuck )
			{
				this.block = false;
				this.stuck = false;
				movement = null;
			}
		}

		if( type == 'rect' )
		{
			//this.context.clearRect(this.sprite[name][0],this.sprite[name][1],this.sprite[name][2],this.sprite[name][3]);
			//this.context.fillRect(x,y,w,h);

			var path = this.sprite[name][5];
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
			delete this.sprite[name];

			for ( var i in this.sprite )
			{
				if( this.sprite[i][4] == 'rect' )
				{
					this.context.fillRect(this.sprite[i][0],this.sprite[i][1],this.sprite[i][2],this.sprite[i][3]);
				}
				else if ( this.sprite[i][4] == 'image' )
				{
					this.addImage( this.sprite[i][5], this.sprite[i][0], this.sprite[i][1], this.sprite[i][2], this.sprite[i][3] );
				}	
				else if ( this.sprite[i][4] == 'text' )
				{
					this.context.fillText( this.sprite[i][5], this.sprite[i][0], this.sprite[i][1]);
				}
			}
			this.addSprite(name, x,y,w,h)
		}
		else if ( type == 'image' )
		{
			
			var path = this.sprite[name][5];
			this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
			delete this.sprite[name];

			for ( var i in this.sprite )
			{
				if( this.sprite[i][4] == 'rect' )
				{
					this.context.fillRect(this.sprite[i][0],this.sprite[i][1],this.sprite[i][2],this.sprite[i][3]);
				}
				else if ( this.sprite[i][4] == 'image' )
				{
					this.addImage( this.sprite[i][5], this.sprite[i][0], this.sprite[i][1], this.sprite[i][2], this.sprite[i][3] );
				}	
				else if ( this.sprite[i][4] == 'text' )
				{
					this.context.fillText( this.sprite[i][5], this.sprite[i][0], this.sprite[i][1]);
				}
			}

			this.addSprite(name, x,y,w,h,'image', path);
		
		}
		
	},

	/*
	* @param {integer} size - Size in pixels
	* @param {string} font  - Font
	*/

	setFont:function(size,font)
	{
		this.context.font = size + 'px ' + font; 
	},

	/*
	* @param {string} color - The fillColor
	*/
	setColor:function(color)
	{
		this.context.fillStyle = color;
	},


	clearCanvas:function()
	{
		if ( this.context.clearRect(0,0,this.canvas.width,this.canvas.height) && delete this.sprite )
		{
			return true;
		}
		else
		{
			return false;
		}
		
	},

	/*
	* @param {string} name - Name of the sprite that has to be fixed.
	*/
	addFixed:function(name)
	{
		if ( this.fixed.push(name) )
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	/*
	* @param {string} path - Path to the mp3 file
	*/
	playSound:function(path)
	{
		new Audio(path).play();
	},

	/*
	* @param {integer} x - If the Mouse X coordinate is equal to this
	* @param {integer} y - If the Mouse Y coordinate is equal to this
	*/
	mouseClick:function(name,e)
	{
		if 
		(
			e.clientX >= this.sprite[name][0] && 
			e.clientX <= this.sprite[name][0] + this.sprite[name][2] &&
			e.clientY >= this.sprite[name][1] &&
			e.clientY <= this.sprite[name][1] + this.sprite[name][3]
		) 
		{
			return true;
		}
		else
		{
			return false;
		}
			
	}
}
