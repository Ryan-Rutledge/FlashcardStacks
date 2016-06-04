var CARD_COUNT = 16,
	otherStack = null,
	otherName = null,
	score = 0,
	highscore = 99999,
	popup,
	stat,
	foundCount,
	found = {
		NONE: -1,
		ONE: 0,
		MATCH: 1,
		NOMATCH: 2
	};

function init() {
	popup = document.getElementsByClassName('popup')[0];

	function MemCard() {
		this.name = '';
	};

	MemCard.prototype.onFlipFinish = function(stack) {
		if (stack !== otherStack && !stack.container.visibility) {
			if (stat > found.ONE) {
				otherStack.container.setAttribute('fc-disableFlip', false);

				if (stat === found.MATCH) {
					foundCount++;

					setTimeout(function() {
						stat = found.NONE;
						otherStack.container.style.visibility = 'hidden';
						stack.container.style.visibility = 'hidden';
						otherStack.flipCard();
						stack.flipCard();
						otherStack = null;

						if (foundCount >= CARD_COUNT / 2) {
							if (highscore > score) {
								highscore = score;
							}

							document.getElementsByClassName('score')[0].innerText = 'MISSES: ' + score + '\nBEST: ' + highscore;
							popup.className = 'popup won';
						}
						else {
							popup.className = 'popup';
						}
					}, fc.FLIP_TIME);
				}
				else {
					stat = found.NONE;
					otherStack.flipCard();
					stack.flipCard();
					otherStack = null;

					setTimeout(function() {
						popup.className = 'popup';
					}, fc.FLIP_TIME);
				}
			}
		}
	}

	MemCard.prototype.onFlipDown = function(stack) {
		if (!stack.container.style.visibility) {
			if (otherStack === null) {
				otherStack = stack;
				stack.container.setAttribute('fc-disableFlip', true);
				otherName = this.name;
				stat = found.ONE;
			}
			else {
				if (otherName === this.name) {
					popup.className = 'popup foundmatch';
					stat = found.MATCH;
				}
				else {
					score++;
					document.getElementsByClassName('score')[0].innerText = 'MISSES: ' + score;
					popup.className = 'popup foundnomatch';
					stat = found.NOMATCH;
				}
			}
		}
	}

	function StarCard(color) {this.color = color;};
	StarCard.prototype = new MemCard();
	StarCard.prototype.drawBack = function(ctx) {
		var radius = [ctx.canvas.height / 4, ctx.canvas.height / 2];
		var iterations = 11;
		var deltaAngle = Math.PI / 5;
		var curAngle = 0;

		centerX = ctx.canvas.width / 2;
		centerY = ctx.canvas.height / 2;
		
		ctx.beginPath();
		ctx.fillStyle = this.color;

		ctx.moveTo(centerX + radius[0]*Math.sin(curAngle), centerY + radius[0]*Math.cos(curAngle));
		for (var i = 0; i < iterations; i++) {
			ctx.lineTo(
				centerX + radius[i%2]*Math.sin(curAngle), centerY + radius[i%2]*Math.cos(curAngle)
			);
			curAngle += deltaAngle;
		}

		ctx.fill();
		ctx.closePath();
	}

	function CircCard(color) {this.color = color;};
	CircCard.prototype = new MemCard();

	CircCard.prototype.drawBack = function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2, ctx.canvas.height/3, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	var memCards = {};
	for (var i = 0; i < CARD_COUNT; i++) {
		var color = 'blue';

		switch (i % 4) {
			case 1:
				color = 'green';
				break;
			case 2:
				color = 'red';
				break;
			case 3:
				color = 'yellow';
				break;
		}

		var curCard;
		var shape;
		if (i >= 8 == 0) {
			shape = 'star';
			curCard = new StarCard(color);
		}
		else {
			shape = 'circle';
			curCard = new CircCard(color);
		}

		curCard.name = color + shape;

		memCards['c' + i] = [curCard];
	}


	for (var key in memCards) {
		var newStack = document.createElement('div');
		newStack.setAttribute('id', key);
		newStack.setAttribute('class', 'fc_container');
		newStack.setAttribute('fc-height', '400');
		newStack.setAttribute('fc-width', '400');
		newStack.setAttribute('fc-enableClick', '');
		document.getElementById('memDiv').appendChild(newStack);
	}

	fc.init(memCards);
	startGame();
}

function startGame() {
	stat = -1;
	foundCount = 0;
	score = 0;

	var md = document.getElementById('memDiv');
	var memCards = [];

	while (md.lastChild !== null) {
		memCards.push(md.removeChild(md.lastChild));
	}

	for(var j, x, i = memCards.length; i; j = Math.floor(Math.random() * i), x = memCards[--i], memCards[i] = memCards[j], memCards[j] = x);

	for (var i = 0; i < memCards.length; i++) {
		memCards[i].style.visibility = '';
		md.appendChild(memCards[i]);
	}

	popup.className = 'popup';
}
