// Global variables
var fc_stack; // List of flashcard stacks
var fc_clickedCard // Card mouse is currently clicking
var fc_SWIPE_DISTANCE = 0.15 // Percentage of width required to flip a card
var fc_tiltDegrees = 15 // Degrees card tilts

// Direction enum
var DIRECTION = {LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3};


/*
 *	Framework
 */

// Return direction of cursor/touch movement
function swipeDirection(startX, startY, endX, endY) {
	if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
		return (startX > endX) ? DIRECTION.LEFT : DIRECTION.RIGHT;
	}
	else {
		return (startY > endY) ? DIRECTION.UP: DIRECTION.DOWN;
	}
}

// FlashCard Class
fc_FlashCard = function(ff, bf) {
	this.frontFunction = ff;
	this.backFunction = bf;
}

// Stack class
var fc_Stack = function(stack) {

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

	// Append to parent
	var margin = document.createElement('div');
	margin.appendChild(this.card);
	this.container = margin;
	stack.appendChild(margin);

	this.cur == -1;
	this.fc_card = []; // Empty stack of cards

	this.resetTouchEvent();
}
// Add card to stack
fc_Stack.prototype.push = function(ff, bf) {
	this.fc_card.push(new fc_flashcard(ff, bf));
}
// Allow arrow keys to control stack
fc_Stack.prototype.enableKeys = function() {
	var stack = this;
	window.addEventListener('keydown', function(e) {
		if (e.which >= 37 && e.which <= 40)
			stack.moveCard(e.which - 37);
	}, false);
}
// Set height and width of canvas context
fc_Stack.prototype.setContextSize = function(x, y) {
	this.card.width = x;
	this.card.height = y;
}
// Set height and width of canvas
fc_Stack.prototype.setSize = function(x, y) {
	this.card.style.width = x + 'px';
	this.card.style.height = y + 'px';
}
// Draw current card
fc_Stack.prototype.draw = function() {
	this.fc_card[cur].frontFunction(this.front.getContext('2d'));
	this.fc_card[cur].backFunction(this.back.getContext('2d'));
}


// Touch Reset
fc_Stack.prototype.resetTouchEvent = function() {
	this.touchX = null;
	this.touchY = null;
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
		var endX = e.changedTouches[0].pageX;
		var endY = e.changedTouches[0].pageY;

		// If swipe length is long enough
		if (Math.abs(endX - this.touchX) > this.swipeDist || Math.abs(endY - this.touchY) > this.swipeDist) {
			e.preventDefault();
			this.moveCard(swipeDirection(this.touchX, this.touchY, endX, endY));
		}
	}

	this.resetTouchEvent();
}

// Resize flashcards while maintaining aspect ratio
function fc_resize() {
	for (var key in fc_stack) {
		var h = fc_stack[key].container.clientHeight;
		var w = fc_stack[key].container.clientWidth;
		
		if (h*1.5 > w)
			h = w/1.5;
		else
			w = h*1.5;

		with (fc_stack[key].card.style) {
			maxHeight = h + 'px';
			maxWidth = w + 'px';
		}

		fc_stack[key].swipeDist = w * fc_SWIPE_DISTANCE;
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
	window.addEventListener('resize', fc_resize);
	fc_resize();

	// If 3d animations are supported
	if (canAnimateFlip) {
		fc_Stack.prototype.alterRotation = function(degrees, tilt) {
			this.card.style.transform = 'rotateY(' + degrees + 'deg)' + (tilt ? ' rotateX(' + tilt + 'deg)':'');
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
				default:
					var cur = this.card;
					this.alterRotation(this.degreesFlipped);
					switch (direction) {
						case DIRECTION.UP:
							this.card.classList.add('fc_moveUp');
							var t1 = setTimeout(cur.showNextCard, 250);
							var t2 = setTimeout(function() {cur.classList.remove('fc_moveUp');}, 500);
							break;
						case DIRECTION.DOWN:
							this.card.classList.add('fc_moveDown');
							var t1 = setTimeout(cur.showPrevCard, 250);
							var t2 = setTimeout(function() {cur.classList.remove('fc_moveDown');}, 500);
							break;
					}
			}
		}

		// TouchMove
		fc_Stack.prototype.touchmove = function(e) {
			if (this.touchX != null && this.touchY != null) {
				e.preventDefault();

				var curX = e.touches[0].pageX;
				var curY = e.touches[0].pageY;

				var dist = Math.max(Math.abs(curX - this.touchX), Math.abs(curY - this.touchY));

				// If length of swipe is long enough
				if (dist > this.swipeDist) {
					var swipeDir = swipeDirection(this.touchX, this.touchY, curX, curY);

					if (swipeDir % 2)  {
						var tilt = (swipeDir === DIRECTION.DOWN ? -fc_tiltDegrees:fc_tiltDegrees);
						tilt *= (this.degreesFlipped % 360 === 0 ? 1:-1);

						this.alterRotation(this.degreesFlipped, tilt);
					}
					else {
						this.alterRotation(this.degreesFlipped + ((swipeDir === DIRECTION.LEFT) ? -fc_tiltDegrees:fc_tiltDegrees));
					}
				}
				else {
					this.alterRotation(this.degreesFlipped);
				}
			}
		}

		if (canBeSwiped) {
			for (var key in fc_stack) {
				// Touchmove
				fc_stack[key].card.addEventListener('touchmove', function(e) {
					fc_stack[this.dataset.stackId].touchmove(e);
				});
			}
		}
		else {
			for (var key in fc_stack) {
				// Mousemove
				fc_stack[key].card.addEventListener('mousemove', function(e) {
					if (fc_clickedCard) {
						e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
						fc_clickedCard.touchmove(e);
					}
				});
			}
		}

		for (var key in fc_stack) {
			fc_stack[key].degreesFlipped = 3600000;
		}
	}
	else { // !canAnimateFlip
		
	}

	// If touchscreen
	if (canBeSwiped) {
		for (var key in fc_stack) {
			// Touchstart
			fc_stack[key].card.addEventListener('touchstart', function(e) {
				fc_stack[this.dataset.stackId].touchstart(e);
			});

			// Touchend
			fc_stack[key].card.addEventListener('touchend', function(e) {
				fc_stack[this.dataset.stackId].touchend(e);
			});
		}
	}
	else {
		for (var key in fc_stack) {
			// MouseDown
			fc_stack[key].card.addEventListener('mousedown', function(e) {
				fc_clickedCard = fc_stack[this.dataset.stackId];
				e.touches = [{'pageX': e.clientX, 'pageY': e.clientY}];
				fc_clickedCard.touchstart(e);
			});

			// MouseUp
			window.addEventListener('mouseup', function(e) {
				if (fc_clickedCard) {
					e.changedTouches = [{'pageX': e.clientX, 'pageY': e.clientY}];
					fc_clickedCard.touchend(e);
				}
				fc_clickedCard = false;
			});
		}
	}
}
