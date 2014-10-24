/******************************
 * fc class                   *
 ******************************/
var fc = {
	// Global variables
	stacks: {}, // List of flashcard stacks
	keys: [], // List of stack keys
	SWIPE_DISTANCE: 0.15, // Percentage of flashcard width required to flip a card
	tiltDegrees: 15, // Degrees card tilts
	flipTime: 400, // Length of card flip animation 
	changeTime: 500, // Length of card change animation
	changeHalf: 250,
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

	// FlashCard constructor
	FlashCard: function(functions) {
		this.functions = functions;
	},

	// Stack constructor
	Stack: function(stack) {
		this.isFaceup = true; // Card is face up
		this.touchEnabled = false; // Swiping
		this.tiltEnabled = false; // Tilt flip indication
		this.dragEnabled = false; // Mouse dragging
		this.keysEnabled = false; // Arrow keys
		this.clickEnabled = false; // Mouse clicking

		// Set front and back of flashcard
		this.front = document.createElement('canvas');
		this.back = document.createElement('canvas');

		// Set dimensions
		this.front.height = this.back.height = 400;
		this.front.width = this.back.width = 600;

		// Set card
		this.card = document.createElement('div');
		with (this.card) {
			classList.add('fc_card');
			classList.add('fc_faceup');
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

		this.cur = 0; // Index of current card
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

	enableSwiping: function(swipeStacks) {
		if (!swipeStacks) swipeStacks = fc.keys;

		for (var s in swipeStacks) {
			var curStack = fc.stacks[swipeStacks[s]];
			curStack.enableSwiping();
		}
	},

	enableDragging: function(dragStacks) {
		if (!dragStacks) dragStacks = fc.keys;

		for (var s in dragStacks) {
			var curStack = fc.stacks[dragStacks[s]];
			curStack.dragEnabled = true;
			curStack.enableDragging();
		}

		// MouseUp
		window.addEventListener('mouseup', function(e) {
			if (fc.clickedCard) {
				e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientY}];
				fc.clickedCard.touchend(e);
			}
			fc.clickedCard = false;
		});
	},

	enableTilting: function(tiltStacks) {
		if (!tiltStacks) tiltStacks = fc.keys;

		for (var s in tiltStacks) {
			var curStack = fc.stacks[tiltStacks[s]];
			curStack.tiltEnabled = true;

			// Touchmove
			if (curStack.touchEnabled) {
				window.addEventListener('touchmove', function(e) {
					curStack.touchmove(e);
				});
			}

			// Mousemove
			if (curStack.dragEnabled) {
				window.addEventListener('mousemove', function(e) {
					if (fc.clickedCard) {
						e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc.clickedCard.touchmove(e);
					}
				});
			}
		}
	},

	enableArrowKeys: function(arrowStack) {
		var curStack = fc.stacks[arrowStack ? arrowStack:fc.keys[0]];
		curStack.keysEnabled = true;

		window.addEventListener('keydown', function(e) {
			if (e.which >= 37 && e.which <= 40)
				curStack.moveCard(e.which - 37);
		}, false);
	},

	enableClicking: function(clickStacks) {
		if (!clickStacks) clickStacks = fc.keys;

		for (var s in clickStacks) {
			var curStack = fc.stacks[clickStacks[s]];
			curStack.enableClicking();
		}
	},

	// Create flashcard stacks
	init: function(objectStacks) {
		// Setup Flashcard elements
		var stackElements = document.getElementsByClassName('fc_stack');
		for (var i = 0; i < stackElements.length; i++) {
			var tmp_flashcard = new fc.Stack(stackElements[i]);
			fc.stacks[stackElements[i].getAttribute('id')] = tmp_flashcard;
		}

		// Resize flashcards
		fc.resize();
		window.addEventListener('resize', fc.resize);

		// Get layout engine info
		var LE = 'webkitTransform' in document.body.style ?  'webkit' :'MozTransform' in document.body.style ?  'Moz':'';
		// Check for flip effect support
		fc.animationIsSupported = ((LE === '' ? 'b':LE + 'B') + 'ackfaceVisibility') in document.body.style;


		// Load parameter objects
		for (var key in objectStacks) {
			fc.keys.push(key);
			for (var o in objectStacks[key]) {
				fc.stacks[key].push(new fc.FlashCard(objectStacks[key][o]));
			}
		}

		// If 3d animations are supported
		if (fc.animationIsSupported) {
			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				if (!this.animating) {
					this.animating = true;
					var thisStack = this

					if (this.isFaceup) {
						this.isFaceup = false;
						var t1 = setTimeout(function() {
							thisStack.card.classList.add('fc_facedown');
							thisStack.card.classList.remove('fc_faceup');
						}, fc.flipTime);
					}
					else {
						this.isFaceup = true;
						var t1 = setTimeout(function() {
							thisStack.card.classList.add('fc_faceup');
							thisStack.card.classList.remove('fc_facedown');
						}, fc.flipTime);
					}

					if (direction == fc.DIRECTION.LEFT) {
						thisStack.card.classList.add('fc_flipLeft');
						var t2 = setTimeout(function() {thisStack.card.classList.remove('fc_flipLeft'); ; thisStack.animating = false;}, fc.flipTime);
					}
					else {
						thisStack.card.classList.add('fc_flipRight');
						var t2 = setTimeout(function() {thisStack.card.classList.remove('fc_flipRight'); thisStack.animating = false;}, fc.flipTime);
					}
				}
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				if (!this.animating) {
					this.animating = true;
					var thisStack = this;
					switch (direction) {
						case fc.DIRECTION.UP:
							this.card.classList.add('fc_moveUp');
							var t1 = setTimeout(function() {thisStack.showNextCard()}, fc.changeHalf);
							var t2 = setTimeout(function() {thisStack.card.classList.remove('fc_moveUp'); thisStack.animating = false;}, fc.changeTime);
							break;
						default:
							this.card.classList.add('fc_moveDown');
							var t1 = setTimeout(function() {thisStack.showPrevCard(thisStack)}, fc.changeHalf);
							var t2 = setTimeout(function() {thisStack.card.classList.remove('fc_moveDown'); thisStack.animating = false;}, fc.changeTime);
							break;
					}
				}
			}
		}
		else { // If 3d animations are not supported
			for (var key in fc.stacks) {
				fc.stacks[key].card.classList.add('fc_noAnimation');
			}

			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				this.card.classList.toggle('fc_facedown');
				this.card.classList.toggle('fc_faceup');
				this.isFaceup = !this.isFaceup;
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				if (direction === fc.DIRECTION.UP)
					this.showNextCard();
				else
					this.showPrevCard();
			}
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
fc.Stack.prototype.showNextCard = function() {
	with (this) {
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
	this.card.classList.remove('fc_tiltLeft');
	this.card.classList.remove('fc_tiltRight');
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

// Touchmove
fc.Stack.prototype.touchmove = function(e) {
	if (this.touchX != null && this.touchY != null) {
		e.preventDefault();

		var card = this.card;
		var curX = e.touches[0].pageX;
		var curY = e.touches[0].pageY;
		var dist = Math.max(Math.abs(curX - this.touchX), Math.abs(curY - this.touchY));

		// If length of swipe is long enough
		if (dist > this.swipeDist) {
			switch (fc.swipeDirection(this.touchX, this.touchY, curX, curY)) {
				case fc.DIRECTION.LEFT:
					card.classList.remove('fc_tiltRight');
					card.classList.add('fc_tiltLeft');
					break;
				case fc.DIRECTION.RIGHT:
					card.classList.remove('fc_tiltLeft');
					card.classList.add('fc_tiltRight');
					break;
				default:
					card.classList.remove('fc_tiltLeft');
					card.classList.remove('fc_tiltRight');
			}
		}
		else {
			card.classList.remove('fc_tiltLeft');
			card.classList.remove('fc_tiltRight');
		}
	}
}

fc.Stack.prototype.enableSwiping = function() {
	var thisStack = this;
	thisStack.touchEnabled = true;

	// Touchstart
	thisStack.card.addEventListener('touchstart', function(e) {
		thisStack.card.touchstart(e);
	});

	// Touchend
	thisStack.card.addEventListener('touchend', function(e) {
		thisStack.card.touchend(e);
	});
}

fc.Stack.prototype.enableDragging = function() {
	var thisStack = this;
	thisStack.dragEnabled = true;

	// MouseDown
	thisStack.card.addEventListener('mousedown', function(e) {
		fc.clickedCard = thisStack;
		e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
		fc.clickedCard.touchstart(e);
	});
}

fc.Stack.prototype.enableClicking = function() {
	var thisStack = this;

	thisStack.card.addEventListener('click', function(e) {
		thisStack.flipCard();
	});
}
