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
	ctx.font = h + 'px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.string, w, h);
}
Integer.prototype.drawBack = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// Circle
	ctx.fillStyle = '#333';
	ctx.beginPath()
	ctx.arc(w, h, w, 0, 2*Math.PI);
	ctx.closePath()
	ctx.fill();

	// Number
	ctx.font = w + 'px monospace';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(this.number, w, h);
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

	// Number
	ctx.fillStyle = '#333';
	ctx.font = w / 2 + 'px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.color, w, h);
}
Color.prototype.drawBack = function(ctx) {
	ctx.fillStyle = this.color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/******************************
 * Init function              *
 ******************************/

 function init() {
	colors = [
		new Color('red'),
		new Color('orange'),
		new Color('yellow'),
		new Color('green'),
		new Color('blue'),
		new Color('purple')
	]

	integers = [
		new Integer(0, 'Zero'),
		new Integer(1, 'One'),
		new Integer(2, 'Two'),
		new Integer(3, 'Three'),
		new Integer(4, 'Four'),
		new Integer(5, 'Five'),
		new Integer(6, 'Six'),
		new Integer(7, 'Seven'),
		new Integer(8, 'Eight'),
		new Integer(9, 'Nine')
	]

	fc.init({
		'integers': integers,
		'colors': colors
	});
	
	fc.enableClicking(); // Enable mouse dragging
	fc.enableDragging(); // Enable mouse dragging
	fc.enableArrowKeys('integers'); // Enable arrow keys
	fc.enableTilting(); // Enable mouse dragging
	fc.enableSwiping(); // Enable touchscreen swiping
 }
