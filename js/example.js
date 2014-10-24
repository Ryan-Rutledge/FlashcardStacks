/******************************
 * Integer class              *
 ******************************/

Integer = function(number, string) {
	this.number = number;
	this.string = string;
}
Integer.prototype.drawFront = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// Number
	ctx.fillStyle = '#333';
	ctx.font = h + 'px "Trebuchet MS", "Tahoma", sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.string, w, h);
}
Integer.prototype.drawBack = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;
	var circleDist = w / 2;
	var circleDiameter = w / 5;

	// Circles
	ctx.fillStyle = '#333';
	for (var i = 0; i < this.number; i++) {
		ctx.beginPath()
		ctx.arc(circleDist+circleDist*(i%3), h * (i >= 3 ? 1.4:0.6), circleDiameter, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath()
	}
}

/******************************
 * Color class                *
 ******************************/

Color = function(color) {
	this.color = color;
}
Color.prototype.drawFront = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// String
	ctx.fillStyle = '#333';
	ctx.font = w / 2 + 'px serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.color, w, h);
}
Color.prototype.drawBack = function(ctx) {
	// Color
	ctx.fillStyle = this.color;
	ctx.beginPath()
	ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, ctx.canvas.height/3, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath()
}

/******************************
 * Init function              *
 ******************************/

 function init() {
	colors = [
		new Color('Red'),
		new Color('Orange'),
		new Color('Yellow'),
		new Color('Green'),
		new Color('Blue'),
		new Color('Purple')
	]

	integers = [
		new Integer(1, 'One'),
		new Integer(2, 'Two'),
		new Integer(3, 'Three'),
		new Integer(4, 'Four'),
		new Integer(5, 'Five'),
		new Integer(6, 'Six'),
	]

	fc.init({
		'integers': integers,
		'colors': colors
	});
	
	fc.enableArrowKeys('integers'); // Enable arrow keys on integers stack
	fc.enableDragging(); // Enable mouse dragging on all stacks
	fc.enableTilting('integers', 'words'); // Allow dragging/swiping to tilt all stacks
	fc.enableSwiping(); // Enable touchscreen swiping on all stacks

	fc.enableClicking('colors', 'words'); // Enable mouse dragging on colors and words stacks
	fc.rescale('colors'); // Resize the colors canvas context to match the actual size of the canvas
 }
