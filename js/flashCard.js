// Global variables
var fc_stack; // List of flashcard stacks
var fc_clickedCard // Card mouse is currently clicking

// Direction enum
var DIRECTION = {LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3};


/*
 *	Framework
 */

function swipeDirection(startX, startY, endX, endY) {
	if (Math.abs(startX - endX) > Math.abs(startY - endY))
		return (startX > endX) ? DIRECTION.LEFT : DIRECTION.RIGHT;
	else
		return (startY > endY) ? DIRECTION.UP: DIRECTION.DOWN;
}

// Stack class
var fc_Stack = function(container) {
	// Record parent
	this.container = container;

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
		dataset.stackId = container.getAttribute('id');
		appendChild(this.front);
		appendChild(this.back);
	}

	// Append to parent
	container.appendChild(this.card);

	this.cur == 0;
	this.resetTouchEvent();
}
// Set draw function for front of flashcard
fc_Stack.prototype.setFrontFunction = function(ff) {
	this.frontFunction = ff;
}
// Set draw function for back of flashcard
fc_Stack.prototype.setBackFunction = function(fb) {
	this.backFunction = fb;
}
// Touch Reset
fc_Stack.prototype.resetTouchEvent = function() {
	this.touchX = null;
	this.touchY = null;
	this.tiltDirection = null;
}

// Touchstart
fc_Stack.prototype.touchstart = function(e) {
	this.touchX = e.touches[0].pageX;
	this.touchY = e.touches[0].pageY;
	e.preventDefault();
}

// TouchEnd
fc_Stack.prototype.touchend = function(e) {
	if (this.touchX != null && this.touchY != null) {
		this.alterRotation(this.degreesFlipped);

		var endX = e.changedTouches[0].pageX;
		var endY = e.changedTouches[0].pageY;

		// If swipe length is long enough
		if (Math.abs(endX - this.touchX) > 50 || Math.abs(endY - this.touchY) > 50) {
			e.preventDefault();
			this.moveCard(swipeDirection(this.touchX, this.touchY, endX, endY));
		}
	}

	this.resetTouchEvent();
}

// Resize flashcards while maintaining aspect ratio
function fc_resize() {
	var stack = document.getElementsByClassName('fc_stack');
	
	for (var i = 0; i < stack.length; i++) {
		var h = stack[i].clientHeight;
		var w = stack[i].clientWidth;
		
		if (h*1.5 > w)
			h = w/1.5;
		else
			w = h*1.5;

		with (fc_stack[stack[i].getAttribute('id')].card.style) {
			maxHeight = h + 'px';
			maxWidth = w + 'px';
		}
	}
}

// Setup
function fc_init() {
	fc_stack = {};

	// Get layout engine info
	var LE = 'webkitTransform' in document.body.style ?  'webkit' :'MozTransform' in document.body.style ?  'Moz':'';
	// Check for flip effect support
	var canAnimateFlip = ((LE === '' ? 'b':LE + 'B') + 'ackfaceVisibility') in document.body.style;
	// Check for touch event support
	var canBeSwiped = 'ontouchstart' in window;

	// Setup Flashcard elements
	var stack = document.getElementsByClassName('fc_stack');
	for (var i = 0; i < stack.length; i++) {
		var tmp_flashcard = new fc_Stack(stack[i]);
		fc_stack[stack[i].getAttribute('id')] = tmp_flashcard;
	}

	// Resize flashcards
	window.addEventListener('resize', fc_resize, false);
	fc_resize();

	// If 3d animations are supported
	if (canAnimateFlip) {
		fc_Stack.prototype.alterRotation = function(degrees) {
			this.card.style.transform = 'rotateY(' + degrees + 'deg)';
		}

		// Flip flash card over
		fc_Stack.prototype.flipCard = function(direction) {
			this.degreesFlipped += direction === DIRECTION.LEFT ? -180:180;
			this.alterRotation(this.degreesFlipped);
		} 
		fc_Stack.prototype.moveCard = function(direction) {
			console.log(direction);
			switch (direction) {
				case DIRECTION.LEFT:
				case DIRECTION.RIGHT:
					this.flipCard(direction);
					break;
				case DIRECTION.UP:
					//this.card.classList.add('moveUp');
					var t1 = setTimeout(this.showNextCard, 250);
					//var t2 = setTimeout(function() {this.card.classList.remove('moveUp');}, 500);
					break;
				case DIRECTION.DOWN:
					//this.card.classList.add('moveDown');
					var t1 = setTimeout(this.showPrevCard, 250);
					//var t2 = setTimeout(function() {this.card.classList.remove('moveDown');}, 500);
					break;
			}
		}
	}

	// If touchscreen
	if (canBeSwiped) {
		// TouchMove
		fc_Stack.prototype.touchmove = function(e) {
			if (this.touchX != null && this.touchY != null) {
				e.preventDefault();

				var curX = e.touches[0].pageX;
				var curY = e.touches[0].pageY;
				var swipeDir = swipeDirection(curX, curY);

				// If tilt direction has changed
				if (this.tiltDirection != swipeDir) {
					var distX = Math.abs(curX - this.touchX);

					// If length of swipe is long enough
					if (distX > 50)
						this.tiltDirection = swipeDir;
						this.alterRotation(
							this.degreesFlipped + (
								(swipeDir === DIRECTION.LEFT) ? -15:15
							)
						);
				}
			}
		}

		for (var key in fc_stack) {
			// Touchstart
			fc_stack[key].card.addEventListener('touchstart', function(e) {
				fc_stack[this.dataset.stackId].touchstart(e);
			});

			// Touchend
			fc_stack[key].card.addEventListener('touchend', function(e) {
				fc_stack[this.dataset.stackId].touchend(e);
			});

			// Touchmove
			fc_stack[key].card.addEventListener('touchmove', function(e) {
				fc_stack[this.dataset.stackId].touchmove(e);
			});
		}
	}
	else {
		for (var key in fc_stack) {
			// MouseDown
			fc_stack[key].card.addEventListener('mousedown', function(e) {
				fc_clickedCard = fc_stack[this.dataset.stackId];
				e.touches = [{'pageX': e.clientX, 'pageY': e.clientX}];
				fc_clickedCard.touchstart(e);
			});

			// MouseUp
			window.addEventListener('mouseup', function(e) {
				if (fc_clickedCard) {
					e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientX}];
					console.log(e.changedTouches);
					fc_clickedCard.touchend(e);
				}
				fc_clickedCard = false;
			});
		}
	}
}
