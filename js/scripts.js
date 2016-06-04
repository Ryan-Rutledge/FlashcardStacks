// Change back inner html of card
function changeText(stack) {
	say = document.getElementsByName('say')[0]
	say.blur();

	document.getElementById('backSpan').innerText = say.value; 
	document.activeElement = document.body
}

// Draw text in center of canvas
function drawCenter(text, ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	ctx.fillStyle = '#333';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, w, h);
}

/******************************
 * Integer class methods      *
 ******************************/

// Integer constructor
Integer = function(number, string) {
	this.number = number;
	this.string = string;
}

// Draws the front of an integer card
Integer.prototype.drawFront = function(ctx) {
	ctx.font = (ctx.canvas.height / 2) + 'px "Trebuchet MS", "Tahoma", sans-serif';
	drawCenter(this.string, ctx)
}

// Draws the back of an integer card
Integer.prototype.drawBack = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;
	var circleDist = w / 2;
	var circleDiameter = w / 5;

	// Draw circles
	ctx.fillStyle = '#333';
	for (var i = 0; i < this.number; i++) {
		ctx.beginPath()
		ctx.arc(circleDist+circleDist*(i%3), h * (i >= 3 ? 1.4:0.6), circleDiameter, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath()
	}
}

/******************************
 * Color class methods        *
 ******************************/

// Color constructor
Color = function(color) {
	this.color = color;
}

// Draws the front of a color card
Color.prototype.drawFront = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// Draw string
	ctx.font = (ctx.canvas.width / 4) + 'px serif';
	drawCenter(this.color, ctx);
}

// Draws the back of a color card
Color.prototype.drawBack = function(ctx) {
	// Color
	ctx.fillStyle = this.color;
	ctx.beginPath()
	ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, ctx.canvas.height/3, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath()
}

// Change container color
Color.prototype.onFlipDown = function(stack) {
	stack.container.style.backgroundColor = this.color;
}
// Restore container color
Color.prototype.onFlipUp = function(stack) {
	stack.container.style.backgroundColor = '';
}
// If stack is faceup, call function 'onflipdown'
Color.prototype.onEnter = function(stack) {
	if (!stack.isFaceUp) this.onFlipDown(stack);
}

/******************************
 * Init function              *
 ******************************/

 function init() {
	// Load flashcards onto webpage
	fc.init({
		'integers': [
			new Integer(1, 'One'),
			new Integer(2, 'Two'),
			new Integer(3, 'Three'),
			new Integer(4, 'Four'),
			new Integer(5, 'Five'),
			new Integer(6, 'Six'),
		],
		'colors': [
			new Color('Green'),
			new Color('Blue'),
			new Color('Purple')
		]
	});
 }

