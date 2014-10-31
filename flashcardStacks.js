/******************************
 * fc class                   *
 ******************************/

var fc = {
	FLIP_TIME: 400, // Length of card flip animation 
	SWITCH_TIME: 500, // Duration of card switch animation
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
		if (Math.abs(startX - endX) > Math.abs(startY - endY))
			return (startX > endX) ? fc.MOVEMENT.LEFT : fc.MOVEMENT.RIGHT;
		else
			return (startY > endY) ? fc.MOVEMENT.UP : fc.MOVEMENT.DOWN;
	},

	// Resize all stacks
	resize: function() {
		for (var key in fc.stacks)
			fc.stacks[key].resize();
	},

	// Sets touch/mousedown event variables
	touchstart: function(e) {
		fc.touchX = e.touches[0].pageX;
		fc.touchY = e.touches[0].pageY;
	},

	// Moves card based on cursor/pointer movement
	touchend: function(e) {
		if (fc.touchedStack) {
			var endX = e.changedTouches[0].pageX;
			var endY = e.changedTouches[0].pageY;
			e.preventDefault();

			// If swipe length is long enough
			if (Math.abs(endX - fc.touchX) > fc.touchedStack.swipeDist || Math.abs(endY - fc.touchY) > fc.touchedStack.swipeDist) {
				fc.touchedStack.moveCard(fc.swipeDirection(fc.touchX, fc.touchY, endX, endY));
			}
		}

		fc.resetTouchEvent();
	},

	// Resets touch variables
	resetTouchEvent: function() {
		fc.touchX = null;
		fc.touchY = null;
		fc.prevDir = null;

		if (fc.touchedStack)
			with (fc.touchedStack) {
				card.classList.remove('fc_tiltLeft');
				card.classList.remove('fc_tiltRight');
				outerHolder.classList.remove('fc_tiltUp');
				outerHolder.classList.remove('fc_tiltDown');
			}
	},

	// Tilts card based on mouse/pointer movement
	touchmove: function(e) {
		if (!fc.isAnimating && fc.touchedStack) {
			e.preventDefault();
			var card = fc.touchedStack.card;
			var holder = fc.touchedStack.outerHolder;
			var curX = e.touches[0].pageX;
			var curY = e.touches[0].pageY;
			var dist = Math.max(Math.abs(curX - fc.touchX), Math.abs(curY - fc.touchY));

			// If length of swipe is long enough
			if (dist > fc.touchedStack.swipeDist) {
				var swipeDir = fc.swipeDirection(fc.touchX, fc.touchY, curX, curY);

				card.classList.add('fc_animateTilt');
				holder.classList.add('fc_animateTilt');

				// If direction of swipe has changed
				if (fc.prevDir != swipeDir) {
					fc.prevDir = swipeDir;

					card.classList.remove('fc_tiltRight');
					card.classList.remove('fc_tiltLeft');
					holder.classList.remove('fc_tiltUp');
					holder.classList.remove('fc_tiltDown');

					switch (swipeDir) {
						case fc.MOVEMENT.LEFT:
							card.classList.add('fc_tiltLeft');
							break;
						case fc.MOVEMENT.RIGHT:
							card.classList.add('fc_tiltRight');
							break;
						case fc.MOVEMENT.UP:
							holder.classList.add('fc_tiltUp');
							break
						default:
							holder.classList.add('fc_tiltDown');
							break;
					}
				}
			}
			else if (fc.prevDir !== null) {
				card.classList.remove('fc_tiltLeft');
				card.classList.remove('fc_tiltRight');
				holder.classList.remove('fc_tiltUp');
				holder.classList.remove('fc_tiltDown');
				fc.prevDir = null;
			}
		}
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

		// Set touch variables to default
		fc.resetTouchEvent();

		// Load parameter objects
		for (var key in objectStacks)
			if (fc.stacks[key].usingCanvas)
				for (var o in objectStacks[key])
					fc.stacks[key].push(new fc.FlashCard(objectStacks[key][o]));
			else 
				for (var o in objectStacks[key])
					fc.stacks[key].fc_cards[o].events = objectStacks[key][o];

		// Get layout engine info
		var LE = 'webkitTransform' in document.body.style ?  'webkit' :'MozTransform' in document.body.style ?  'Moz':'';
		// Check for flip effect support
		var animationIsSupported = ((LE === '' ? 'b':LE + 'B') + 'ackfaceVisibility') in document.body.style;

		// If 3d animations are supported
		if (animationIsSupported) {
			// Flip flashcard over
			fc.Stack.prototype.flipCard = function(direction) {
				if (!fc.isAnimating) {
					fc.isAnimating = true;
					var thisStack = this

					// Remove tilt classes
					thisStack.card.classList.remove('fc_animateTilt');
					thisStack.outerHolder.classList.remove('fc_animateTilt');

					// Switch facedown and faceup css classes after animation finishes
					var faceArr = ['fc_faceup', 'fc_facedown'];

					if (this.isFaceUp) faceArr.reverse();
					this.isFaceUp = !this.isFaceUp;

					var t1 = setTimeout(function() {
						thisStack.card.classList.add(faceArr[0]);
						thisStack.card.classList.remove(faceArr[1]);
					}, fc.FLIP_TIME);

					// Add css flip animation classes, then remove them after animation finishes
					var dirArr = ['fc_flipLeft', 'fc_flipRight'];

					if (direction == fc.MOVEMENT.RIGHT) dirArr.reverse();
					
					thisStack.card.classList.add(dirArr[0]);
					var t2 = setTimeout(function() {
						thisStack.card.classList.remove(dirArr[0]);
						fc.isAnimating = false;
					}, fc.FLIP_TIME);

					thisStack.handleFlip(direction);
				}
			} 

			// Switch to adjacent card
			fc.Stack.prototype.switchCard = function(direction) {
				if (!fc.isAnimating) {
					fc.isAnimating = true;
					var thisStack = this;

					thisStack.card.classList.remove('fc_animateTilt');
					thisStack.outerHolder.classList.remove('fc_animateTilt');

					thisStack.handleSwitch(fc.MOVEMENT.LEAVE);

					// Add appropriate css move class, and remove when animation is finished
					switch (direction) {
						case fc.MOVEMENT.UP:
							thisStack.outerHolder.classList.add('fc_moveUp');

							var t1 = setTimeout(function() {
								thisStack.showNextCard();
							}, fc.SWITCH_TIME/2);
							var t2 = setTimeout(function() {
								thisStack.outerHolder.classList.remove('fc_moveUp');
								fc.isAnimating = false;
							}, fc.SWITCH_TIME);

							break;
						default:
							thisStack.outerHolder.classList.add('fc_moveDown');

							var t1 = setTimeout(function() {
								thisStack.showPrevCard(thisStack);
							}, fc.SWITCH_TIME/2);

							var t2 = setTimeout(function() {
								thisStack.outerHolder.classList.remove('fc_moveDown');
								fc.isAnimating = false;
							}, fc.SWITCH_TIME);
							break;
					}
				}
			}
		}
		else { // If 3d animations are not supported
			for (var key in fc.stacks) {
				fc.stacks[key].card.classList.add('fc_noAnimation');
			}

			// Flip flashcard over
			fc.Stack.prototype.flipCard = function(direction) {
				this.card.classList.toggle('fc_facedown');
				this.card.classList.toggle('fc_faceup');
				this.isFaceUp = !this.isFaceUp;
				this.handleFlip(direction);
			} 

			// Switch to adjacent card
			fc.Stack.prototype.switchCard = function(direction) {
				this.handleSwitch(this, fc.MOVEMENT.LEAVE);

				if (direction === fc.MOVEMENT.UP)
					this.showNextCard();
				else
					this.showPrevCard();
			}
		}

		// Listener class
		var setListener = {
			// Set touch/mouse movement listeners
			tilt: function() {
				// Touchmove
				window.addEventListener('touchmove', function(e) {
					if (fc.touchedStack && fc.touchedStack.enabled.tilt) {
						e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc.touchmove(e);
					}
				});

				// Mousemove
				window.addEventListener('mousemove', function(e) {
					if (fc.touchedStack && fc.touchedStack.enabled.tilt) {
						e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc.touchmove(e);
					}
				});
			},

			// Set mouse drag listener for stacks
			drag: function(stacks) {
				for (var s in stacks)
					setListener.dragStack(stacks[s]);

				// MouseUp
				window.addEventListener('mouseup', function(e) {
					if (fc.touchedStack) {
						e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc.touchend(e);
					}
					fc.touchedStack = false;
				});
			},

			// Set click listener for stacks
			click: function(stacks) {
				for (var s in stacks)
					setListener.clickStack(stacks[s]);
			},

			// Set click listener for individual stack
			clickStack: function(stack) {
				stack.card.addEventListener('click', function(e) {
					stack.flipCard();
				});
			},

			// Set mousedown listener for individual stack
			dragStack: function(stack) {
				// MouseDown
				stack.card.addEventListener('mousedown', function(e) {
					fc.touchedStack = stack;
					e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
					fc.touchstart(e);
				});
			},

			// Set touch listeners for stacks
			swipe: function(stacks) {
				for (var s in stacks)
					setListener.swipeStack(stacks[s]);

				// Touchend
				window.addEventListener('touchend', function(e) {
					if (fc.touchedStack) fc.touchend(e);
					fc.touchedStack = false;
				});
			},

			// Set touchstart/end listeners for individual stack
			swipeStack: function(stack) {
				// Touchstart
				stack.card.addEventListener('touchstart', function(e) {
					fc.touchedStack = stack;
					fc.touchstart(e);
				});

				// Touchend
				stack.card.addEventListener('touchend', function(e) {
					fc.touchend(e);
				});
			},

			// Set keydown listener for stacks
			arrowkeys: function(stacks) {
					window.addEventListener('keydown', function(e) {
						if (e.which >= 37 && e.which <= 40)
							for (var s in stacks)
								stacks[s].moveCard(e.which - 37);
					}, false);
			}
		};

		// Add listeners
		if (animationIsSupported && fc.tiltStacks.length) setListener.tilt();
		if (fc.dragStacks.length) setListener.drag(fc.dragStacks);
		if (fc.clickStacks.length) setListener.click(fc.clickStacks);
		if (fc.swipeStacks.length) setListener.swipe(fc.swipeStacks);
		if (fc.arrowkeyStacks.length) setListener.arrowkeys(fc.arrowkeyStacks);
	}
}

/******************************
 * FlashCard class methods    *
 ******************************/

// FlashCard constructor
fc.FlashCard = function() {
	if (arguments.length == 1) {
		this.events = arguments[0];
	}
	else {
		this.events = {};
		this.sides = arguments;
	}
},

// Draw sides of card
fc.FlashCard.prototype.draw = function(front, back) {
	with (this) {
		if (events) {
			if (events.drawFront)
				drawFront(front.getContext('2d'));
			if (events.drawBack)
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
	this.events.drawFront(ctx);
}
// Draws back of flashcard
fc.FlashCard.prototype.drawBack = function(ctx) {
	this.preDraw(ctx);
	this.events.drawBack(ctx);
}

// Handles card flip events
fc.FlashCard.prototype.handleFlip = function(stack, direction) {
	if (this.events.onFlip)
		this.events.onFlip(stack);

	if (stack.isFaceUp) {
		if (this.events.onFlipUp) {
			this.events.onFlipUp(stack);
		}
	}
	else if (this.events.onFlipDown) {
		this.events.onFlipDown(stack);
	}

	if (direction === fc.MOVEMENT.RIGHT) {
		if (this.events.onFlipRight)
			this.events.onFlipRight(stack);
	}
	else if (this.events.onFlipLeft) {
			this.events.onFlipLeft(stack);
	}
}

// Handles card switch events
fc.FlashCard.prototype.handleSwitch = function(stack, movement) {
	if (movement === fc.MOVEMENT.LEAVE) {
		if (this.events.onSwitch)
			this.events.onSwitch(stack);

		if (this.events.onLeave)
			this.events.onLeave(stack);

	}
	else if (this.events.onEnter) {
		this.events.onEnter(stack);
	}
}

/******************************
 * Stack class methods        *
 ******************************/

// Stack constructor
fc.Stack = function(container) {
	var self = this;
	self.container = container;
	self.fc_cards = []; // Empty stack of cards
	self.swipeDist = 1;
	self.isFaceUp = true;
	this.cur = 0; // Index of current card

	// Check which listeners are enabled
	self.enabled = {};
	self.enabled.tilt = container.getAttribute('fc-enableTilt') === '';
	self.enabled.drag = container.getAttribute('fc-enableDrag') === '';
	self.enabled.click = container.getAttribute('fc-enableClick') === '';
	self.enabled.swipe = container.getAttribute('fc-enableSwipe') === '';
	self.enabled.arrowkeys = container.getAttribute('fc-enableArrowkeys') === '';

	// If no fc attributes are provided, enable everything
	if (!(self.enabled.tilt || self.enabled.drag || self.enabled.click || self.enabled.swipe || self.enabled.arrowkeys))
		self.enabled.tilt = self.enabled.drag = self.enabled.click = self.enabled.swipe = self.enabled.arrowkeys = true;

	// Add self stack to appropriate arrays
	if (self.enabled.tilt) fc.tiltStacks.push(self);
	if (self.enabled.drag) fc.dragStacks.push(self);
	if (self.enabled.click) fc.clickStacks.push(self);
	if (self.enabled.swipe) fc.swipeStacks.push(self);
	if (self.enabled.arrowkeys) fc.arrowkeyStacks.push(self);

	self.enabled.scaling = container.getAttribute('fc-enableCanvasScale') === '';

	// Create card element
	self.card = document.createElement('div');

	// Set front and back of flashcard
	var elements = container.getElementsByClassName('fc_content');
	if (elements.length) {
		self.usingCanvas = false;
		self.front = document.createElement('div');
		self.back = document.createElement('div');
	}
	else {
		self.usingCanvas = true;
		self.front = document.createElement('canvas');
		self.back = document.createElement('canvas');
	}

	// Add classes to front and back
	self.front.classList.add('fc_side');
	self.front.classList.add('fc_front');
	self.back.classList.add('fc_side');
	self.back.classList.add('fc_back');

	with (self.card) {
		// Add card classes
		classList.add('fc_card');
		classList.add('fc_faceup');

		// Append front and back
		appendChild(self.front);
		appendChild(self.back);
	}

	// Create inner element for translation animation
	self.innerHolder = document.createElement('div');
	self.innerHolder.appendChild(self.card);
	self.innerHolder.classList.add('fc_innerHolder');

	// Create outer element for translation animation
	self.outerHolder = document.createElement('div');
	self.outerHolder.appendChild(self.innerHolder);
	self.outerHolder.style.display = 'none';
	self.outerHolder.classList.add('fc_outerHolder');
	container.appendChild(self.outerHolder);

	// Set dimensions
	if (container.getAttribute('fc-margin')) self.outerHolder.style.padding = container.getAttribute('fc-margin');
	self.front.height = self.back.height = container.getAttribute('fc-height') ? container.getAttribute('fc-height'):400;
	self.front.width = self.back.width = container.getAttribute('fc-width') ? container.getAttribute('fc-width'):600;
	self.card.style.height = self.front.height + 'px';
	self.card.style.width = self.front.width + 'px';
	self.aspectRatio = self.front.width / self.front.height;

	if (!self.usingCanvas) {
		for (var count = Math.floor(elements.length / 2); count > 0; count--) {
			var front = container.removeChild(elements[0]);
			var back = container.removeChild(elements[0]);
			
			var flashcard = new fc.FlashCard(front, back)

			flashcard.events.onSwitch = window[front.getAttribute('fc-onSwitch')];
			flashcard.events.onEnter = window[front.getAttribute('fc-onEnter')];
			flashcard.events.onLeave = window[front.getAttribute('fc-onLeave')];
			flashcard.events.onFlip = window[front.getAttribute('fc-onFlip')];
			flashcard.events.onFlipUp = window[front.getAttribute('fc-onFlipUp')];
			flashcard.events.onFlipDown = window[front.getAttribute('fc-onFlipDown')];
			flashcard.events.onFlipRight = window[front.getAttribute('fc-onFlipRight')];
			flashcard.events.onFlipLeft = window[front.getAttribute('fc-onFlipLeft')];

			self.push(flashcard);
		}
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
	if (this.fc_cards.length <= 1)
		this.outerHolder.style.display = 'none';
	else if (this.cur === this.fc_cards.length - 1)
		this.showPrevCard();

	return this.fc_cards.pop();
}

// Loads content-based flashcard into stack
fc.Stack.prototype.load = function() {
	this.front.removeChild(this.front.firstElementChild);
	this.back.removeChild(this.back.firstElementChild);
	this.front.appendChild(this.curCard().sides[0]);
	this.back.appendChild(this.curCard().sides[1]);
};

// Returns currently displayed card
fc.Stack.prototype.curCard = function() {return this.fc_cards[this.cur]};

// Switch to, and draw, the previous card
fc.Stack.prototype.showPrevCard = function() {
	this.cur = (this.cur + this.fc_cards.length - 1) % this.fc_cards.length;

	if (this.usingCanvas)
		this.draw();
	else
		this.load();

	this.handleSwitch(this, fc.MOVEMENT.ENTER);
};

// Switch to, and draw, the next card
fc.Stack.prototype.showNextCard = function() {
	this.cur = (this.cur + 1) % this.fc_cards.length;

	if (this.usingCanvas)
		this.draw();
	else
		this.load();

	this.handleSwitch(this, fc.MOVEMENT.ENTER);
};

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

		if (enabled.scaling) {
			front.width = back.width = w;
			front.height = back.height = h;
			draw();
		}
	}
}

// Handles stack flip events
fc.Stack.prototype.handleFlip = function(direction) {
	this.curCard().handleFlip(this, direction);

	if (window[this.container.getAttribute('fc-onFlip')])
		window[this.container.getAttribute('fc-onFlip')](this);

	if (this.isFaceUp) {
		if (window[this.container.getAttribute('fc-onFlipUp')])
			window[this.container.getAttribute('fc-onFlipUp')](this);
	}
	else if (window[this.container.getAttribute('fc-onFlipDown')]) {
		this.window[this.container.getAttribute('fc-onFlipDown')](this);
	}

	if (direction === fc.MOVEMENT.RIGHT) {
		if (window[this.container.getAttribute('fc-onFlipRight')])
			window[this.container.getAttribute('fc-onFlipRight')](this);
	}
	else if (window[this.container.getAttribute('fc-onFlipLeft')]) {
			window[this.container.getAttribute('fc-onFlipLeft')](this);
	}
}

// Handles stack switch events
fc.Stack.prototype.handleSwitch = function(movement) {
	this.curCard().handleSwitch(this, movement);

	if (movement === fc.MOVEMENT.LEAVE) {
		if (window[this.container.getAttribute('fc-onSwitch')])
			window[this.container.getAttribute('fc-onSwitch')](this);

		if (window[this.container.getAttribute('fc-onLeave')])
			window[this.container.getAttribute('fc-onLeave')](this)
	}
	else if (window[this.container.getAttribute('fc-onEnter')]) {
		window[this.container.getAttribute('fc-onEnter')](this);
	}
}

// Choose action based on direction
fc.Stack.prototype.moveCard = function(direction) {
	switch (direction) {
		case fc.MOVEMENT.LEFT:
		case fc.MOVEMENT.RIGHT:
			this.flipCard(direction);
			if (this.curCard().flip)
				this.curCard().flip(direction);
			break;
		default:
			if (this.fc_cards.length > 1)
				this.switchCard(direction);
	}
}

// Draw front and back of current card
fc.Stack.prototype.draw = function() {
	if (this.fc_cards.length) this.curCard().draw(this.front, this.back);
}
