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

	// Circle
	ctx.beginPath();
	ctx.fillStyle = '#333';
	ctx.arc(w, h, w / 2,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();

	// Number
	ctx.fillStyle = '#fff';
	ctx.font = w + 'px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.number, w, h);
}
Integer.prototype.drawBack = function(ctx) {
	var w = ctx.canvas.width / 2;
	var h = ctx.canvas.height / 2;

	// Number
	ctx.fillStyle = '#333';
	ctx.font = w / 2 + 'px sans';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(this.string, w, h);
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
 * Initiate instances         *
 ******************************/

colors = [];
colors.push(new Color('#F00', 'Red'));
colors.push(new Color('#0F0', 'Green'));
colors.push(new Color('#00F', 'Blue'));

integers = [];
integers.push(new Integer(1, 'One'));
integers.push(new Integer(2, 'Two'));
integers.push(new Integer(3, 'Three'));
