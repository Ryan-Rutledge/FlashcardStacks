/******************************
 * fc class                   *
 ******************************/
var fc = {
	// Global variables
	stacks: {}, // List of flashcard stacks
	SWIPE_DISTANCE: 0.15, // Percentage of flashcard width required to flip a card
	tiltDegrees: 15, // Degrees card tilts
	DIRECTION: {LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3}, // Direction enum

	// Return direction of cursor/touch movement
	swipeDirection: function(startX, startY, endX, endY) {
		if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
			return (startX > endX) ? fc.DIRECTION.LEFT : fc.DIRECTION.RIGHT;
		}
		else {
			return (startY > endY) ? fc.DIRECTION.UP: fc.DIRECTION.DOWN;
		}
	},

	// FlashCard class
	FlashCard: function(functions) {
		this.functions = functions;
	},

	// Stack class for flashcards
	Stack: function(stack) {

		// Set front and back of flashcard
		this.front = document.createElement('canvas');
		this.back = document.createElement('canvas');

		// Set dimensions
		this.front.height = this.back.height = 400;
		this.front.width = this.back.width = 600;

		// Set card
		this.card = document.createElement('div');
		with (this.card) {
			classList.add('fc_card')
			dataset.stackId = stack.getAttribute('id');
			appendChild(this.front);
			appendChild(this.back);
		}

		// Create inner element for margins
		var margin = document.createElement('div');
		margin.appendChild(this.card);
		margin.style.display = 'none';
		this.container = margin;

		// Append to parent
		stack.appendChild(margin);

		this.cur = 0;
		this.fc_cards = []; // Empty stack of cards

		this.resetTouchEvent();
	},

	// Resize flashcards while maintaining aspect ratio
	resize: function() {
		for (var key in fc.stacks) {
			var h = fc.stacks[key].container.clientHeight;
			var w = fc.stacks[key].container.clientWidth;
			
			if (h*1.5 > w)
				h = w/1.5;
			else
				w = h*1.5;

			with (fc.stacks[key].card.style) {
				maxHeight = h + 'px';
				maxWidth = w + 'px';
			}

			fc.stacks[key].swipeDist = w * fc.SWIPE_DISTANCE;
		}
	},

	init: function(objectStacks) {
		// Get layout engine info
		var LE = 'webkitTransform' in document.body.style ?  'webkit' :'MozTransform' in document.body.style ?  'Moz':'';
		// Check for flip effect support
		var canAnimateFlip = ((LE === '' ? 'b':LE + 'B') + 'ackfaceVisibility') in document.body.style;
		// Check for touch event support
		var canBeSwiped = 'ontouchstart' in window;

		// Setup Flashcard elements
		var stacks = document.getElementsByClassName('fc_stack');

		for (var i = 0; i < stacks.length; i++) {
			var tmp_flashcard = new fc.Stack(stacks[i]);
			fc.stacks[stacks[i].getAttribute('id')] = tmp_flashcard;
		}

		// Resize flashcards
		window.addEventListener('resize', fc.resize);
		fc.resize();

		// Load parameter objects
		for (var key in objectStacks) {
			for (var o in objectStacks[key]) {
				fc.stacks[key].push(new fc.FlashCard(objectStacks[key][o]));
			}
		}

		// If 3d animations are supported
		if (canAnimateFlip) {
			fc.Stack.prototype.alterRotation = function(degrees, tilt) {
				this.card.style.transform = 'rotateY(' + degrees + 'deg)';
			}

			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				this.degreesFlipped += direction === fc.DIRECTION.LEFT ? -180:180;
				this.alterRotation(this.degreesFlipped);
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				var cur = this;
				this.alterRotation(this.degreesFlipped);
				switch (direction) {
					case fc.DIRECTION.UP:
						this.card.classList.add('fc_moveUp');
						var t1 = setTimeout(function() {cur.showNextCard(cur)}, 250);
						var t2 = setTimeout(function() {cur.card.classList.remove('fc_moveUp');}, 500);
						break;
					default:
						this.card.classList.add('fc_moveDown');
						var t1 = setTimeout(function() {cur.showPrevCard(cur)}, 250);
						var t2 = setTimeout(function() {cur.card.classList.remove('fc_moveDown');}, 500);
						break;
				}
			}

			// TouchMove
			fc.Stack.prototype.touchmove = function(e) {
				if (this.touchX != null && this.touchY != null) {
					e.preventDefault();

					var curX = e.touches[0].pageX;
					var curY = e.touches[0].pageY;

					var dist = Math.max(Math.abs(curX - this.touchX), Math.abs(curY - this.touchY));

					// If length of swipe is long enough
					if (dist > this.swipeDist) {
						var swipeDir = fc.swipeDirection(this.touchX, this.touchY, curX, curY);

						if (swipeDir % 2 === 0)  {
							this.alterRotation(this.degreesFlipped + ((swipeDir === fc.DIRECTION.LEFT) ? -fc.tiltDegrees:fc.tiltDegrees));
						}
					}
					else {
						this.alterRotation(this.degreesFlipped);
					}
				}
			}

			if (canBeSwiped) {
				for (var key in fc.stacks) {
					// Touchmove
					fc.stacks[key].card.addEventListener('touchmove', function(e) {
						fc.stacks[this.dataset.stackId].touchmove(e);
					});
				}
			}
			else {
				for (var key in fc.stacks) {
					// Mousemove
					fc.stacks[key].card.addEventListener('mousemove', function(e) {
						if (fc.clickedCard) {
							e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
							fc.clickedCard.touchmove(e);
						}
					});
				}
			}

			for (var key in fc.stacks) {
				fc.stacks[key].degreesFlipped = 3600000;
			}
		}
		else { // If 3d animations are not supported
			for (var key in fc.stacks) {
				fc.stacks[key].card.classList.add('fc_noAnimation');
			}

			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				this.card.classList.toggle('fc_faceDown');
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				if (direction === fc.DIRECTION.UP)
					this.showNextCard(this);
				else
					this.showPrevCard(this);
			}
		}

		// If touchscreen
		if (canBeSwiped) {
			for (var key in fc.stacks) {
				// Touchstart
				fc.stacks[key].card.addEventListener('touchstart', function(e) {
					fc.stacks[this.dataset.stackId].touchstart(e);
				});

				// Touchend
				fc.stacks[key].card.addEventListener('touchend', function(e) {
					fc.stacks[this.dataset.stackId].touchend(e);
				});
			}
		}
		else {
			for (var key in fc.stacks) {
				// MouseDown
				fc.stacks[key].card.addEventListener('mousedown', function(e) {
					fc.clickedCard = fc.stacks[this.dataset.stackId];
					e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
					fc.clickedCard.touchstart(e);
				});
			}

				// MouseUp
				window.addEventListener('mouseup', function(e) {
					if (fc.clickedCard) {
						e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc.clickedCard.touchend(e);
					}
					fc.clickedCard = false;
				});
		}
	}
}

/******************************
 * FlashCard class methods    *
 ******************************/

// Called before draw functions
fc.FlashCard.prototype.preDraw = function(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
// Draws front of flashcard
fc.FlashCard.prototype.drawFront = function(ctx) {
	this.preDraw(ctx);
	this.functions.drawFront(ctx);
}
// Draws back of flashcard
fc.FlashCard.prototype.drawBack = function(ctx) {
	this.preDraw(ctx);
	this.functions.drawBack(ctx);
}

/******************************
 * Stack class methods        *
 ******************************/

// Push card to stack
fc.Stack.prototype.push = function(flashcard) {
	this.fc_cards.push(flashcard);

	if (this.fc_cards.length <= 1) {
		this.container.style.display = '';
		fc.resize();
		this.draw();
	}
}

// Pop card from stack
fc.Stack.prototype.pop = function() {
	if (this.fc_cards.length <= 1) {
		this.container.style.display = 'none';
	}
	return this.fc_cards.pop();
}

// Set height and width of canvas context
fc.Stack.prototype.setContextSize = function(x, y) {
	this.card.width = x;
	this.card.height = y;
}

// Set height and width of canvas
fc.Stack.prototype.setSize = function(x, y) {
	this.card.style.width = x + 'px';
	this.card.style.height = y + 'px';
}

// Switch to, and draw, the previous card
fc.Stack.prototype.showPrevCard = function(thisStack) {
	with (thisStack) {
		cur = (cur + fc_cards.length - 1) % fc_cards.length;
		draw();
	}
}
// Switch to, and draw, the next card
fc.Stack.prototype.showNextCard = function(thisStack) {
	with (thisStack) {
		cur = (cur + 1) % fc_cards.length;
		draw();
	}
}

// Choose action based on direction
fc.Stack.prototype.moveCard = function(direction) {
	switch (direction) {
		case fc.DIRECTION.LEFT:
		case fc.DIRECTION.RIGHT:
			this.flipCard(direction);
			if (this.fc_cards[this.cur].flip)
				this.fc_cards[this.cur].flip(direction);
			break;
		default:
			this.changeCard(direction);
	}
}

// Draw front and back of current card
fc.Stack.prototype.draw = function() {
	with (this) {
		if (fc_cards[cur].drawFront)
			fc_cards[cur].drawFront(front.getContext('2d'));
		if (fc_cards[cur].drawBack)
			fc_cards[cur].drawBack(back.getContext('2d'));
	}
}

// Touch Reset
fc.Stack.prototype.resetTouchEvent = function() {
	this.touchX = null;
	this.touchY = null;
}

// Touchstart
fc.Stack.prototype.touchstart = function(e) {
	this.touchX = e.touches[0].pageX;
	this.touchY = e.touches[0].pageY;
	e.preventDefault();
}

// TouchEnd
fc.Stack.prototype.touchend = function(e) {
	if (this.touchX != null && this.touchY != null) {
		var endX = e.changedTouches[0].pageX;
		var endY = e.changedTouches[0].pageY;

		// If swipe length is long enough
		if (Math.abs(endX - this.touchX) > this.swipeDist || Math.abs(endY - this.touchY) > this.swipeDist) {
			e.preventDefault();
			this.moveCard(fc.swipeDirection(this.touchX, this.touchY, endX, endY));
		}
	}

	this.resetTouchEvent();
}

// Allow arrow keys to control stack
fc.Stack.prototype.enableKeys = function() {
	var stack = this;
	window.addEventListener('keydown', function(e) {
		if (e.which >= 37 && e.which <= 40)
			stack.moveCard(e.which - 37);
	}, false);
}

