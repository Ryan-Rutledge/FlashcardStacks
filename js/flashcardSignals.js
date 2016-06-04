var rr = {
	signRadius: 32,
	signWidth: 0,
	postGap: 30,
	signalMargin: 0,
	blinkContext: 0,
	blinkOff: true,
	blinkingSigns: [],

	// Sign class
	Sign: function(color, blinks) {
		this.color = color;
		this.blinks = (blinks === true);
	},

	// Signal class
	Signal: function(number, name, indication, rows) {
		this.number = number;
		this.name = name;
		this.indication = indication;

		this.width = 0;

		for (var i = 0; i < rows.length; i++)
			if (rows[i].length > this.width)
				this.width = rows[i].length;

		this.rows = rows;
	},
	
	init: function() {
		var blinkEvent = setInterval (function() {
			for (var i = 0; i < rr.blinkingSigns.length; i++)
				rr.blinkingSigns[i][0].draw(rr.blinkContext, rr.blinkingSigns[i][1], rr.blinkingSigns[i][2], true);
			fc.blinkOff = !fc.blinkOff;
		}, 500);

		// Blank Sign
		var noSign = new rr.Sign('#222');

		// Red Sign
		var rSign = new rr.Sign('#C00');
		var rBSign = new rr.Sign('#C00', true);

		// Green Sign
		var gSign = new rr.Sign('#0A0');
		var gBSign = new rr.Sign('#0A0', true);

		// Yellow Sign
		var ySign = new rr.Sign('#FF0');
		var yBSign = new rr.Sign('#FF0', true);

		// Lunar Sign
		var lSign = new rr.Sign('#BBF');
		var lBSign = new rr.Sign('#BBF', true);

		fc.init({
			'railroadSignals': [
				new rr.Signal('9.1.3', 'Clear', 'Proceed.', [
						[gSign, gSign, gSign, gSign],
						[null, noSign, rSign, rSign],
						[null, null, null, rSign]
				]),
				new rr.Signal('9.1.3', 'Clear', 'Proceed.', [
						[gSign, gSign, gSign],
						[noSign, noSign, rSign],
						[noSign, rSign, noSign]
				]),
				new rr.Signal('9.1.4', 'Approach Limited', 'Proceed to pass next signal not exceeding 60 mph and be prepared to enter diverging route at prescribed speed.', [
						[ySign],
						[gBSign]
				]),
				new rr.Signal('9.1.5', 'Advance Approach', 'Proceed prepared to pass next signal not exceeding 50 mph and be prepared to enter diverging route at prescribed speed.', [
						[ySign, ySign, ySign],
						[gSign, gSign, gSign],
						[null, rSign, noSign]
				]),
				new rr.Signal('9.1.6', 'Approach Medium', 'Proceed prepared to pass next signal not exceeding 40 mph and be prepared to enter diverging route at prescribed speed.', [
						[yBSign, yBSign, yBSign, ySign],
						[null, rSign, rSign, ySign],
						[null, null, rSign, null]
				]),
				new rr.Signal('9.1.6', 'Approach Medium', 'Proceed prepared to pass next signal not exceeding 40 mph and be prepared to enter diverging route at prescribed speed.', [
						[yBSign, yBSign, ySign, yBSign],
						[noSign, noSign, ySign, noSign],
						[null, noSign, rSign, rSign]
				]),
				new rr.Signal('9.1.6', 'Approach Medium', 'Proceed prepared to pass next signal not exceeding 40 mph and be prepared to enter diverging route at prescribed speed.', [
						[yBSign, ySign],
						[rSign, ySign],
						[noSign, noSign]
				]),
				new rr.Signal('9.1.7', 'Approach Restricting', 'Proceed prepared to pass next signal at restricted speed.', [
						[ySign, ySign, ySign],
						[lSign, lSign, rBSign],
						[null, rSign, null]
				]),
				new rr.Signal('9.1.7', 'Approach Restricting', 'Proceed prepared to pass next signal at restricted speed.', [
						[ySign, ySign],
						[rBSign, rBSign],
						[noSign, rSign]
				]),
				new rr.Signal('9.1.8', 'Approach', 'Proceed prepared to stop at next signal, trains exceeding 30mpg immediately reduce to that speed.', [
						[ySign, ySign, ySign, ySign],
						[null, rSign, rSign, noSign],
						[null, null, rSign, null]
				]),
				new rr.Signal('9.1.8', 'Approach', 'Proceed prepared to stop at next signal, trains exceeding 30mpg immediately reduce to that speed.', [
						[ySign, ySign, noSign, ySign],
						[noSign, noSign, ySign, rSign],
						[noSign,  rSign,  null, noSign]
				]),
				new rr.Signal('9.1.9', 'Diverging Clear', 'Proceed on diverging route not exceeding prescribed speed through turnout.', [
						[rSign, rSign, rSign, rSign],
						[gSign, gSign, rSign, gSign],
						[null,  rSign,  gSign, noSign]
				]),
				new rr.Signal('9.1.9', 'Diverging Clear', 'Proceed on diverging route not exceeding prescribed speed through turnout.', [
						[rSign],
						[ySign],
						[ySign]
				]),
				new rr.Signal('9.1.11', 'Diverging Approach Medium', 'Proceed on diverging route not exceeding prescribed speed through turnout prepared to pass next signal not exceeding 35 mph.', [
						[rSign, rSign, rSign],
						[yBSign, yBSign, yBSign],
						[null,  rSign,  noSign]
				]),
				new rr.Signal('9.1.11', 'Diverging Approach Medium', 'Proceed on diverging route not exceeding prescribed speed through turnout prepared to pass next signal not exceeding 35 mph.', [
						[rSign, rSign, rSign, rSign],
						[ySign, ySign, rSign, ySign],
						[null,  rSign,  ySign, noSign]
				]),
				new rr.Signal('9.1.13', 'Restricting', 'Proceed at restricted speed.', [
						[rBSign, rSign, rSign, rBSign],
						[null, rBSign, rBSign, rSign],
						[null, null, rSign, null]
				]),
				new rr.Signal('9.1.13', 'Restricting', 'Proceed at restricted speed.', [
						[rBSign, rSign, rBSign, noSign],
						[rSign, rSign, noSign, rBSign],
						[rSign, rBSign]
				]),
				new rr.Signal('9.1.13', 'Restricting', 'Proceed at restricted speed.', [
						[lSign, lSign, lSign],
						[null, rSign, rSign],
						[null, null, rSign]
				]),
				new rr.Signal('9.1.13', 'Restricting', 'Proceed at restricted speed.', [
						[rSign, rSign, rSign, noSign],
						[lSign, rSign, lSign, lSign],
						[null, lSign, rSign]
				]),
				new rr.Signal('9.1.13', 'Restricting', 'Proceed at restricted speed.', [
						[noSign, rBSign, rBSign, rSign],
						[rBSign, noSign, rSign, rBSign],
						[rSign, rSign, noSign, noSign]
				]),
				new rr.Signal('9.1.15', 'Stop', 'Stop.', [
						[rSign, rSign, rSign, rSign],
						[null, noSign, rSign, rSign],
						[null, null, null, rSign]
				]),

				new rr.Signal('9.1.15', 'Stop', 'Stop.', [
						[noSign, noSign, rSign, rSign],
						[rSign, rSign, noSign, rSign],
						[null, rSign, rSign, noSign]
				])
			]
		})
	}
}

rr.Sign.prototype.draw = function(ctx, x, y, lightOnly) {
	var stroke = lightOnly ? 5:0;

	ctx.beginPath();
	ctx.arc(x, y, rr.signRadius - stroke, 0, 2 * Math.PI, false);
	ctx.fillStyle = (lightOnly && fc.blinkOff) ? '#222':this.color;
	ctx.fill();
	ctx.lineWidth = 22 - (stroke * 2);
	ctx.strokeStyle = '#000';
	ctx.stroke();
}

rr.Signal.prototype.drawPost = function(ctx, x) {
	ctx.beginPath();
	ctx.moveTo(x - rr.postGap, rr.signRadius * 12);
	ctx.lineTo(x + rr.postGap, rr.signRadius * 12);
	ctx.moveTo(x, rr.signRadius * 12);
	ctx.lineTo(x, rr.signRadius);
	ctx.stroke();
	ctx.closePath();
}

rr.Signal.prototype.drawPosts = function(ctx) {
	rr.signWidth = rr.signRadius * 2 + rr.postGap;
	rr.signalMargin = (ctx.canvas.width - (rr.signWidth * this.width) + rr.signWidth) / 2;

	ctx.lineWidth = 5;
	ctx.strokeStyle = '#000';

	for (var i = 0; i < this.width; i++) {
		this.drawPost(ctx, rr.signalMargin + (rr.signWidth * i));
	}
}

rr.Signal.prototype.drawFront = function(ctx) {

	// Clear blinkingSigns array
	while (rr.blinkingSigns.length) rr.blinkingSigns.pop();
	rr.blinkContext = ctx;

	// Draw posts
	this.drawPosts(ctx);

	// Draw signs
	for (var r = 0; r < this.rows.length; r++) {
		for (var c = 0; c < this.rows[r].length; c++) {
			if (this.rows[r][c] !== null) {
				var y = rr.signRadius + rr.postGap + r * rr.signWidth;
				var x = rr.signalMargin + c * rr.signWidth;
				this.rows[r][c].draw(ctx, x, y);

				// Fill blinkingSigns array
				if (this.rows[r][c].blinks)
					rr.blinkingSigns.push([this.rows[r][c], x, y]);
			}
		}
	}
}

rr.Signal.prototype.drawBack = function(ctx) {
	// Draw rule number
	var sectSize = ctx.canvas.height / 10;
	ctx.font = 'bold ' + sectSize + 'px sans-serif';
	ctx.fillStyle = '#000';
	ctx.textAlign = 'center';
	ctx.fillText('Rule ' + this.number, ctx.canvas.width / 2, sectSize);

	// Draw headers
	ctx.rect(sectSize/4, sectSize*1.5, ctx.canvas.width - sectSize/2, sectSize*1.5);
	ctx.rect(sectSize/4, sectSize*4.5, ctx.canvas.width - sectSize/2, sectSize*1.5);
	ctx.fill();
	ctx.fillStyle = '#FFF';
	ctx.font = 'bold ' + sectSize * 0.75 + 'px sans-serif';
	ctx.fillText('Name', ctx.canvas.width / 2, sectSize*2.5);
	ctx.fillText('Indication', ctx.canvas.width / 2, sectSize*5.5);

	// Draw name
	ctx.fillStyle = '#000';
	ctx.font = sectSize * 0.5 + 'px sans-serif';
	ctx.fillText(this.name, ctx.canvas.width/2, sectSize*4);

	// Draw Indication
	ctx.fillStyle = '#000';
	ctx.textAlign = 'left';
	ctx.font = sectSize * 0.5 + 'px sans-serif';

	var indicationWords = this.indication.split(' ');
	var lineNum = 1;
	var i = 0;
	while (i < indicationWords.length) {
		var line = '';
		while (i < indicationWords.length && ctx.measureText(line + ' ' + indicationWords[i]).width < ctx.canvas.width - sectSize/2)
			line += ' ' + indicationWords[i++];

		ctx.fillText(line, sectSize/4, sectSize*6.5 + (lineNum++)*sectSize/2);
	}
}
