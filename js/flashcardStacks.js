/******************************
 * fc class                   *
 ******************************/
var fc = {
	// 
	FLIP_TIME: 400, // Length of card flip animation 
	CHANGE_TIME: 500, // Length of card change animation
	SWIPE_DISTANCE: 0.15, // Percentage of flashcard width required to flip a card
	MOVEMENT: {LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3, ENTER: 4, LEAVE: 5}, // Direction enum

	stacks: {}, // List of flashcard stacks
	tiltStacks: [], // List of tilt enabled stacks
	dragStacks: [], // List of drag enabled stacks
	clickStacks: [], // List of click enabled stacks
	swipeStacks: [], // List of swipe enabled stacks
	arrowkeyStacks: [], // List of arrowkey enabled stacks

	// Return direction of cursor/touch movement
	swipeDirection: function(startX, startY, endX, endY) {
		if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
			return (startX > endX) ? fc.MOVEMENT.LEFT : fc.MOVEMENT.RIGHT;
		}
		else {
			return (startY > endY) ? fc.MOVEMENT.UP: fc.MOVEMENT.DOWN;
		}
	},

	// Resize all stacks
	resize: function() {
		for (var key in fc.stacks)
			fc.stacks[key].resize();
	},

	// Set touch/mouse movement listeners
	tiltListener: function() {
		// Touchmove
		window.addEventListener('touchmove', function(e) {
			if (fc.touchedStack && fc.touchedStack.tiltEnabled) {
				e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
				fc.touchedStack.touchmove(e);
			}
		});

		// Mousemove
		window.addEventListener('mousemove', function(e) {
			if (fc.touchedStack && fc.touchedStack.tiltEnabled) {
				e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
				fc.touchedStack.touchmove(e);
			}
		});
	},

	// Set mouse drag listener for stacks
	dragListener: function(stacks) {
		for (var s in stacks)
			stacks[s].dragListener();

		// MouseUp
		window.addEventListener('mouseup', function(e) {
			if (fc.touchedStack) {
				e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientY}];
				fc.touchedStack.touchend(e);
			}
			fc.touchedStack = false;
		});
	},

	// Set click listener for stacks
	clickListener: function(stacks) {
		for (var s in stacks)
			stacks[s].clickListener();
	},

	// Set touch listeners for stacks
	swipeListener: function(stacks) {
		for (var s in stacks)
			stacks[s].swipeListener();

		// Touchend
		window.addEventListener('touchend', function(e) {
			if (fc.touchedStack) {
				fc.touchedStack.touchend(e);
			}
			fc.touchedStack = false;
		});
	},

	// Set keydown listener for stacks
	arrowkeyListener: function(stacks) {
			window.addEventListener('keydown', function(e) {
				if (e.which >= 37 && e.which <= 40)
					for (var s in stacks)
						stacks[s].moveCard(e.which - 37);
			}, false);
	},

	// Create flashcard stacks
	init: function(objectStacks) {
		// Setup Flashcard elements
		var stackContainers = document.getElementsByClassName('fc_container');
		for (var i = 0; i < stackContainers.length; i++) {
			var newStack = new fc.Stack(stackContainers[i]);
			fc.stacks[stackContainers[i].getAttribute('id')] = newStack;
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
			if (fc.stacks[key].usingCanvas)
				for (var o in objectStacks[key])
					fc.stacks[key].push(new fc.FlashCard(objectStacks[key][o]));
			else 
				for (var o in objectStacks[key])
					fc.stacks[key].fc_cars[o].functions = objectStacks[key][o];

		}

		// If 3d animations are supported
		if (fc.animationIsSupported) {
			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				if (!this.animating) {
					this.animating = true;
					var thisStack = this

					// Switch facedown and faceup css classes after animation finishes
					if (this.isFaceUp) {
						this.isFaceUp = false;

						var t1 = setTimeout(function() {
							thisStack.card.classList.add('fc_facedown');
							thisStack.card.classList.remove('fc_faceup');
						}, fc.FLIP_TIME);

					}
					else {
						this.isFaceUp = true;

						var t1 = setTimeout(function() {
							thisStack.card.classList.add('fc_faceup');
							thisStack.card.classList.remove('fc_facedown');
						}, fc.FLIP_TIME);
					}

					// Add css flip animation classes, then remove them after animation finishes
					if (direction == fc.MOVEMENT.LEFT) {
						thisStack.card.classList.add('fc_flipLeft');
						var t2 = setTimeout(function() {
							thisStack.card.classList.remove('fc_flipLeft');
							thisStack.animating = false;
						}, fc.FLIP_TIME);
					}
					else {
						thisStack.card.classList.add('fc_flipRight');
						var t2 = setTimeout(function() {
							thisStack.card.classList.remove('fc_flipRight');
							thisStack.animating = false;
						}, fc.FLIP_TIME);
					}

					thisStack.onFlip(direction);
				}
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				if (!this.animating) {
					this.animating = true;
					var thisStack = this;

					thisStack.onChange(fc.MOVEMENT.LEAVE);

					// Add appropriate css move class, and remove when animation is finished
					switch (direction) {
						case fc.MOVEMENT.UP:
							thisStack.outerHolder.classList.add('fc_moveUp');

							var t1 = setTimeout(function() {
								thisStack.showNextCard();
							}, fc.CHANGE_TIME/2);
							var t2 = setTimeout(function() {thisStack.outerHolder.classList.remove('fc_moveUp'); thisStack.animating = false;}, fc.CHANGE_TIME);

							break;
						default:
							thisStack.outerHolder.classList.add('fc_moveDown');

							var t1 = setTimeout(function() {
								thisStack.showPrevCard(thisStack);
							}, fc.CHANGE_TIME/2);

							var t2 = setTimeout(function() {thisStack.outerHolder.classList.remove('fc_moveDown'); thisStack.animating = false;}, fc.CHANGE_TIME);
							break;
					}

				}
			}

			if (fc.tiltStacks.length) fc.tiltListener();
		}
		else { // If 3d animations are not supported
			for (var key in fc.stacks) {
				fc.stacks[key].card.classList.add('fc_noAnimation');
			}

			// Flip flash card over
			fc.Stack.prototype.flipCard = function(direction) {
				this.card.classList.toggle('fc_facedown');
				this.card.classList.toggle('fc_faceup');
				this.isFaceUp = !this.isFaceUp;
				this.onFlip(direction);
			} 

			// Change to adjacent card
			fc.Stack.prototype.changeCard = function(direction) {
				this.onChange(this, fc.MOVEMENT.LEAVE);

				if (direction === fc.MOVEMENT.UP)
					this.showNextCard();
				else
					this.showPrevCard();
			}
		}

		if (fc.dragStacks.length) fc.dragListener(fc.dragStacks);
		if (fc.clickStacks.length) fc.clickListener(fc.clickStacks);
		if (fc.swipeStacks.length) fc.swipeListener(fc.swipeStacks);
		if (fc.arrowkeyStacks.length) fc.arrowkeyListener(fc.arrowkeyStacks);
	}
}

/******************************
 * FlashCard class methods    *
 ******************************/

// FlashCard constructor
fc.FlashCard = function() {
	if (arguments.length == 1) {
		this.functions = arguments[0];
	}
	else {
		this.functions = {};
		this.sides = arguments;
	}
},

// Draw sides of card
fc.FlashCard.prototype.draw = function(front, back) {
	with (this) {
		if (functions) {
			if (functions.drawFront)
				drawFront(front.getContext('2d'));
			if (functions.drawBack)
				drawBack(back.getContext('2d'));
		}
	}
}
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

// Called every time card is flipped
fc.FlashCard.prototype.onFlip = function(stack, direction) {
	if (this.functions.onFlip)
		this.functions.onFlip(stack);

	if (stack.isFaceUp) {
		if (this.functions.onFlipUp) {
			this.functions.onFlipUp(stack);
		}
	}
	else if (this.functions.onFlipDown) {
		this.functions.onFlipDown(stack);
	}

	if (direction === fc.MOVEMENT.RIGHT) {
		if (this.functions.onFlipRight)
			this.functions.onFlipRight(stack);
	}
	else if (this.functions.onFlipLeft) {
			this.functions.onFlipLeft(stack);
	}
}

// Called every time card is changed
fc.FlashCard.prototype.onChange = function(stack, movement) {
	if (movement === fc.MOVEMENT.LEAVE) {
		if (this.functions.onChange)
			this.functions.onChange(stack);

		if (this.functions.onLeave)
			this.functions.onLeave(stack);

	}
	else if (this.functions.onEnter) {
		this.functions.onEnter(stack);
	}
}
/******************************
 * Stack class methods        *
 ******************************/

// Stack constructor
fc.Stack = function(container) {
	this.container = container;
	this.cur = 0; // Index of current card
	this.fc_cards = []; // Empty stack of cards
	this.swipeDist = 1;
	this.isFaceUp = true;

	// Check which listeners are enabled
	this.tiltEnabled = container.getAttribute('fc-tilt') === '';
	this.dragEnabled = container.getAttribute('fc-drag') === '';
	this.clickEnabled = container.getAttribute('fc-click') === '';
	this.swipeEnabled = container.getAttribute('fc-swipe') === '';
	this.arrowkeysEnabled = container.getAttribute('fc-arrowkeys') === '';

	// If no fc attributes are provided, enable everything
	if (!(this.tiltEnabled || this.dragEnabled || this.clickEnabled || this.swipeEnabled || this.arrowkeysEnabled))
		this.tiltEnabled = this.dragEnabled = this.clickEnabled = this.swipeEnabled = this.arrowkeysEnabled = true;

	// Add this stack to appropriate arrays
	if (this.tiltEnabled) fc.tiltStacks.push(this);
	if (this.dragEnabled) fc.dragStacks.push(this);
	if (this.clickEnabled) fc.clickStacks.push(this);
	if (this.swipeEnabled) fc.swipeStacks.push(this);
	if (this.arrowkeysEnabled) fc.arrowkeyStacks.push(this);

	this.scalingEnabled = container.getAttribute('fc-scale') === '';

	// Assign stack functions
	this.functions = {};
	this.functions.onChange = window[container.getAttribute('fc-onChange')];
	this.functions.onEnter = window[container.getAttribute('fc-onEnter')];
	this.functions.onLeave = window[container.getAttribute('fc-onLeave')];
	this.functions.onFlip = window[container.getAttribute('fc-onFlip')];
	this.functions.onFlipUp = window[container.getAttribute('fc-onFlipup')];
	this.functions.onFlipDown = window[container.getAttribute('fc-onFlipdown')];
	this.functions.onFlipRight = window[container.getAttribute('fc-onFlipright')];
	this.functions.onFlipLeft = window[container.getAttribute('fc-onFlipleft')];

	// Create card element
	this.card = document.createElement('div');

	// Set front and back of flashcard
	var elements = container.getElementsByClassName('fc_content');
	if (elements.length) {
		this.usingCanvas = false;
		this.front = document.createElement('div');
		this.back = document.createElement('div');
	}
	else {
		this.usingCanvas = true;
		this.front = document.createElement('canvas');
		this.back = document.createElement('canvas');
	}

	// Add classes to front and back
	this.front.classList.add('fc_side');
	this.front.classList.add('fc_front');
	this.back.classList.add('fc_side');
	this.back.classList.add('fc_back');

	with (this.card) {
		// Add card classes
		classList.add('fc_card');
		classList.add('fc_faceup');

		// Append front and back
		appendChild(this.front);
		appendChild(this.back);
	}


	// Create inner element for translation animation
	this.innerHolder = document.createElement('div');
	this.innerHolder.appendChild(this.card);
	this.innerHolder.classList.add('fc_innerHolder');

	// Create outer element for translation animation
	this.outerHolder = document.createElement('div');
	this.outerHolder.appendChild(this.innerHolder);
	this.outerHolder.style.display = 'none';
	this.outerHolder.classList.add('fc_outerHolder');
	container.appendChild(this.outerHolder);

	// Set dimensions
	if (container.getAttribute('fc-margin')) this.outerHolder.style.padding = container.getAttribute('fc-margin');
	this.front.height = this.back.height = container.getAttribute('fc-height') ? container.getAttribute('fc-height'):400;
	this.front.width = this.back.width = container.getAttribute('fc-width') ? container.getAttribute('fc-width'):600;
	this.card.style.height = this.front.height + 'px';
	this.card.style.width = this.front.width + 'px';
	this.aspectRatio = this.front.width / this.front.height;

	if (!this.usingCanvas) {
		for (var i = 0; i < elements.length; i+=2) {
			var front = container.firstElementChild;
			container.removeChild(front);

			var back = container.firstElementChild;
			container.removeChild(back);
			
			var flashcard = new fc.FlashCard(front, back)

			flashcard.functions.onChange = window[front.getAttribute('fc-onChange')];
			flashcard.functions.onEnter = window[front.getAttribute('fc-onEnter')];
			flashcard.functions.onLeave = window[front.getAttribute('fc-onLeave')];
			flashcard.functions.onFlip = window[front.getAttribute('fc-onFlip')];
			flashcard.functions.onFlipUp = window[front.getAttribute('fc-onFlipup')];
			flashcard.functions.onFlipDown = window[front.getAttribute('fc-onFlipdown')];
			flashcard.functions.onFlipRight = window[front.getAttribute('fc-onFlipright')];
			flashcard.functions.onFlipLeft = window[front.getAttribute('fc-onFlipleft')];

			this.push(flashcard);
		}

		this.resetTouchEvent();
	}
}

// Push card to stack
fc.Stack.prototype.push = function(flashcard) {
	this.fc_cards.push(flashcard);

	if (this.fc_cards.length <= 1) {
		this.outerHolder.style.display = '';
		this.resize();

		if (this.usingCanvas) {
			this.draw();
		}
		else {
			this.front.appendChild(flashcard.sides[0]);
			this.back.appendChild(flashcard.sides[1]);
		}
	}
}

// Pop card from stack
fc.Stack.prototype.pop = function() {
	if (this.fc_cards.length <= 1) {
		this.outerHolder.style.display = 'none';
	}
	return this.fc_cards.pop();
}

// Loads content-based flashcard into stack
fc.Stack.prototype.load = function() {
	with (this) {
		front.removeChild(front.firstElementChild);
		back.removeChild(back.firstElementChild);
		front.appendChild(fc_cards[cur].sides[0]);
		back.appendChild(fc_cards[cur].sides[1]);
	}
}

// Resize flashcards while maintaining aspect ratio
fc.Stack.prototype.resize = function() {
	with (this) {
		var h = innerHolder.clientHeight;
		var w = innerHolder.clientWidth;

		if (h*aspectRatio > w)
			h = w/aspectRatio;
		else
			w = h*aspectRatio;

		card.style.maxHeight = h + 'px';
		card.style.maxWidth = w + 'px';

		swipeDist = w * fc.SWIPE_DISTANCE;

		if (scalingEnabled) {
			front.width = back.width = w;
			front.height = back.height = h;
			draw();
		}
	}
}

// Calls onChange, onLeave, and onEnter
fc.Stack.prototype.onChange = function(movement) {
	if (movement === fc.MOVEMENT.LEAVE) {
		if (this.functions.onChange)
			this.functions.onChange(this);

		if (this.functions.onLeave)
			this.functions.onLeave(this);
	}
	else if (this.functions.onEnter) {
		this.functions.onEnter(this);
	}

	this.fc_cards[this.cur].onChange(this, movement);
}

// Calls onFlip, onFlipUp, onFlipDown, onFlipRight, and onFlipLeft
fc.Stack.prototype.onFlip = function(direction) {
	if (this.functions.onFlip)
		this.functions.onFlip(this);

	if (this.isFaceUp) {
		if (this.functions.onFlipUp) {
			this.functions.onFlipUp(this);
		}
	}
	else if (this.functions.onFlipDown) {
		this.functions.onFlipDown(this);
	}

	if (direction === fc.MOVEMENT.RIGHT) {
		if (this.functions.onFlipRight)
			this.functions.onFlipRight(this);
	}
	else if (this.functions.onFlipLeft) {
			this.functions.onFlipLeft(this);
	}

	this.fc_cards[this.cur].onFlip(this, direction);
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
fc.Stack.prototype.showPrevCard = function() {
	with (this) {
		cur = (cur + fc_cards.length - 1) % fc_cards.length;

		if (usingCanvas) draw();
		else             load();

		this.onChange(this, fc.MOVEMENT.ENTER);
	}
}
// Switch to, and draw, the next card
fc.Stack.prototype.showNextCard = function() {
	with (this) {
		cur = (cur + 1) % fc_cards.length;

		if (usingCanvas) draw();
		else             load();

		this.onChange(this, fc.MOVEMENT.ENTER);
	}
}

// Choose action based on direction
fc.Stack.prototype.moveCard = function(direction) {
	switch (direction) {
		case fc.MOVEMENT.LEFT:
		case fc.MOVEMENT.RIGHT:
			this.flipCard(direction);
			if (this.fc_cards[this.cur].flip)
				this.fc_cards[this.cur].flip(direction);
			break;
		default:
			if (this.fc_cards.length > 1) {
				this.changeCard(direction);
			}
	}
}

// Draw front and back of current card
fc.Stack.prototype.draw = function() {
	if (this.fc_cards.length) this.fc_cards[this.cur].draw(this.front, this.back);
}

// Resets touch variables
fc.Stack.prototype.resetTouchEvent = function() {
	fc.touchX = null;
	fc.touchY = null;
	fc.prevDir = null;
	this.card.classList.remove('fc_tiltLeft');
	this.card.classList.remove('fc_tiltRight');
	this.outerHolder.classList.remove('fc_tiltUp');
	this.outerHolder.classList.remove('fc_tiltDown');
}

// Sets touch/mousedown event variables
fc.Stack.prototype.touchstart = function(e) {
	fc.touchX = e.touches[0].pageX;
	fc.touchY = e.touches[0].pageY;
}

// Moves card based on cursor/pointer movement
fc.Stack.prototype.touchend = function(e) {
	if (fc.touchX != null && fc.touchY != null) {
		var endX = e.changedTouches[0].pageX;
		var endY = e.changedTouches[0].pageY;

		// If swipe length is long enough
		if (Math.abs(endX - fc.touchX) > this.swipeDist || Math.abs(endY - fc.touchY) > this.swipeDist) {
			e.preventDefault();
			this.moveCard(fc.swipeDirection(fc.touchX, fc.touchY, endX, endY));
		}
	}

	this.resetTouchEvent();
}

// Tilts card based on mouse/pointer movement
fc.Stack.prototype.touchmove = function(e) {
	if (fc.touchX != null && fc.touchY != null) {
		var card = this.card;
		var holder = this.outerHolder;
		var curX = e.touches[0].pageX;
		var curY = e.touches[0].pageY;
		var dist = Math.max(Math.abs(curX - fc.touchX), Math.abs(curY - fc.touchY));

		// If length of swipe is long enough
		if (dist > this.swipeDist) {
			e.preventDefault();
			var swipeDir = fc.swipeDirection(fc.touchX, fc.touchY, curX, curY);
			// If direction of swipe has changed
			if (fc.prevDir != swipeDir) {
				fc.prevDir = swipeDir;

				switch (swipeDir) {
					case fc.MOVEMENT.LEFT:
						card.classList.remove('fc_tiltRight');
						holder.classList.remove('fc_tiltUp');
						holder.classList.remove('fc_tiltDown');

						card.classList.add('fc_tiltLeft');
						break;
					case fc.MOVEMENT.RIGHT:
						card.classList.remove('fc_tiltLeft');
						holder.classList.remove('fc_tiltUp');
						holder.classList.remove('fc_tiltDown');

						card.classList.add('fc_tiltRight');
						break;
					case fc.MOVEMENT.UP:
						card.classList.remove('fc_tiltLeft');
						card.classList.remove('fc_tiltRight');
						holder.classList.remove('fc_tiltDown');

						holder.classList.add('fc_tiltUp');
						break
					default:
						card.classList.remove('fc_tiltLeft');
						card.classList.remove('fc_tiltRight');
						holder.classList.remove('fc_tiltUp');

						holder.classList.add('fc_tiltDown');
						break;
				}
			}
		}
		else if (fc.prevDir) {
			card.classList.remove('fc_tiltLeft');
			card.classList.remove('fc_tiltRight');
			holder.classList.remove('fc_tiltUp');
			holder.classList.remove('fc_tiltDown');
		}
	}
}

// Sets mousedown listener
fc.Stack.prototype.dragListener = function() {
	var thisStack = this;

	// MouseDown
	thisStack.card.addEventListener('mousedown', function(e) {
		fc.touchedStack = thisStack;
		e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
		fc.touchedStack.touchstart(e);
	});
}

// Sets touchstart and touchend listeners
fc.Stack.prototype.swipeListener = function() {
	var thisStack = this;

	// Touchstart
	thisStack.card.addEventListener('touchstart', function(e) {
		fc.touchedStack = thisStack;
		thisStack.touchstart(e);
		fc.touchedStack.touchstart(e);
	});

	// Touchend
	thisStack.card.addEventListener('touchend', function(e) {
		thisStack.touchend(e);
	});
}

// Sets click listener
fc.Stack.prototype.clickListener = function() {
	var thisStack = this;
	thisStack.card.addEventListener('click', function(e) {
		thisStack.flipCard();
	});
}
