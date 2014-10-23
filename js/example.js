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
	var h = ctx.canvas.height;

	// Text appearance
	ctx.textAlign = 'center';

	// Circle
	ctx.textBaseline = 'alphabetic';
	ctx.font = h * 2 + 'px sans';
	ctx.fillStyle = '#333';
	ctx.fillText('●', w, h);

	// Number
	ctx.textBaseline = 'middle';
	ctx.font = w + 'px monospace';
	ctx.fillStyle = '#fff';
	ctx.fillText(this.number, w, h/2);
}

/******************************
 * Color class                *
 ******************************/

Color = function(color, name) {
	this.color = color;
	this.name = name;
}
Color.prototype.drawFront = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// Number
	ctx.fillStyle = '#333';
	ctx.font = w / 2 + 'px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.name, w, h);
}
Color.prototype.drawBack = function(ctx) {
	ctx.fillStyle = this.color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/******************************
 * Initiate stacks            *
 ******************************/

colors = [
	new Color('#F00', 'Red'),
	new Color('#0F0', 'Green'),
	new Color('#00F', 'Blue')
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
